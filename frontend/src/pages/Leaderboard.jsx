import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../services/api';

const RANKS = [
  { name: 'Bronze', color: '#b08d57', bg: 'from-[#b08d57]/20 to-transparent' },
  { name: 'Silver', color: '#c0c0c0', bg: 'from-[#c0c0c0]/20 to-transparent' },
  { name: 'Gold', color: '#ffd700', bg: 'from-[#ffd700]/20 to-transparent' },
  { name: 'Platinum', color: '#00ced1', bg: 'from-[#00ced1]/20 to-transparent' },
  { name: 'Diamond', color: '#b9f2ff', bg: 'from-[#b9f2ff]/20 to-transparent' },
  { name: 'Master', color: '#ff69b4', bg: 'from-[#ff69b4]/20 to-transparent' },
  { name: 'Grandmaster', color: '#ff4500', bg: 'from-[#ff4500]/20 to-transparent' },
  { name: 'Extra Supreme', color: '#ff1493', bg: 'from-[#ff1493]/20 to-transparent' }
];

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data via API
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();

    // Setup Socket.IO connection for real-time updates
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.emit('get_leaderboard');

    socket.on('leaderboard_data', (data) => {
      // Socket might not return totalTasksCompleted in its payload, 
      // but it will immediately push rank/point changes.
      setUsers(data);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getTopIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)]" size={32} />;
      case 1: return <Medal className="text-gray-300 drop-shadow-[0_2px_10px_rgba(209,213,219,0.5)]" size={28} />;
      case 2: return <Award className="text-amber-600 drop-shadow-[0_2px_10px_rgba(217,119,6,0.5)]" size={28} />;
      default: return <span className="text-gray-400 font-bold text-lg w-8 text-center">{index + 1}</span>;
    }
  };

  const getTopTitle = (index) => {
    switch (index) {
      case 0: return "TOP 1";
      case 1: return "TOP 2";
      case 2: return "TOP 3";
      default: return null;
    }
  };

  return (
    <div className="p-6 pt-10 pb-24 relative min-h-screen">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-40 left-0 w-64 h-64 bg-blue-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="mb-8 text-center relative z-10">
        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-4">
          <Trophy size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Bảng Xếp Hạng</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Những người chơi xuất sắc nhất</p>
      </header>

      {loading ? (
        <p className="text-center text-gray-400 dark:text-gray-500 py-10">Đang tải bảng xếp hạng...</p>
      ) : (
        <div className="space-y-4 relative z-10">
          {users.map((u, index) => {
            const isTop3 = index < 3;
            const rankInfo = RANKS[Math.min(u.rankIndex || 0, 7)];

            return (
              <div
                key={u._id}
                className={`glass p-4 rounded-[24px] flex items-center gap-4 relative overflow-hidden transition-all hover:scale-[1.02] ${isTop3 ? 'border-yellow-200/50 dark:border-yellow-500/30 shadow-[0_8px_30px_rgba(250,204,21,0.15)]' : ''}`}
              >
                {/* Background Rank Gradient Highlight */}
                <div className={`absolute inset-0 bg-gradient-to-r ${rankInfo.bg} opacity-50 pointer-events-none`}></div>
                {/* Glossy highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 dark:from-white/10 to-transparent pointer-events-none"></div>

                <div className="flex-shrink-0 flex items-center justify-center w-10 z-10 relative">
                  {getTopIcon(index)}
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/50 dark:border-white/20">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      (u.displayName || '?')[0].toUpperCase()
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center gap-2">
                    <h3 className={`truncate ${isTop3 ? 'font-black text-lg drop-shadow-sm' : 'font-bold'}`}>
                      {u.displayName}
                    </h3>
                    {getTopTitle(index) && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase
                        ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400' :
                          index === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' :
                            'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'}`}
                      >
                        {getTopTitle(index)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <img src={`/ranks/${Math.min(u.rankIndex || 0, 7)}.png`} alt={rankInfo.name} className="w-5 h-5 object-contain drop-shadow-sm" />
                    <p className="text-sm font-medium" style={{ color: rankInfo.color }}>
                      {rankInfo.name} • <span className="text-gray-500 dark:text-gray-400">{u.rankPoints || 0} pt</span>
                    </p>
                  </div>
                </div>

                <div className="text-right relative z-10">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Đã hoàn thành</p>
                  <p className="font-black text-lg">{u.totalTasksCompleted || 0}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
