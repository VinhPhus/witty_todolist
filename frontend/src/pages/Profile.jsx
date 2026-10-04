import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import RankBadge from '../components/RankBadge';
import { LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="p-6 pt-10">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Hồ sơ</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Thông tin & Thành tích</p>
        </div>
      </header>

      <div className="glass rounded-[32px] p-6 mb-6 flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 dark:from-white/10 to-transparent pointer-events-none"></div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/30 relative z-10">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            user.displayName.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-[32px] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/10 to-transparent pointer-events-none"></div>
          <div className="mb-2 scale-125 origin-center relative z-10">
            <RankBadge user={user} hideTooltip={true} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-medium relative z-10">Rank hiện tại</p>
          <div className="mt-1 font-bold" style={{ color: ['#b08d57', '#c0c0c0', '#ffd700', '#00ced1', '#b9f2ff', '#ff69b4', '#ff4500', '#ff1493'][Math.min(user.rankIndex || 0, 7)] }}>
            EXP: {user.rankPoints || 0} / {user.rankIndex >= 7 ? 'MAX' : [100, 150, 200, 250, 300, 350, 400, 400][user.rankIndex || 0]}
          </div>
        </div>

        <div className="glass rounded-[32px] p-6 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/10 to-transparent pointer-events-none"></div>
          <div className="w-16 h-16 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md shadow-inner flex items-center justify-center mb-2 relative z-10">
            <img src="/point.png" alt="Point" className="w-10 h-10 object-contain drop-shadow-md" />
          </div>
          <h3 className="text-4xl font-black relative z-10">{user.balance || 0}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium relative z-10">Điểm thưởng</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg px-2 pt-2">Cài đặt hệ thống</h3>
        
        <button 
          onClick={toggleTheme}
          className="w-full glass-btn rounded-[24px] p-4 flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-100/50 dark:bg-indigo-900/50 shadow-inner text-indigo-500 flex items-center justify-center group-hover:bg-indigo-200/50 transition-colors">
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </div>
          <span className="font-bold flex-1 text-left text-lg">
            Giao diện {theme === 'dark' ? 'Sáng' : 'Tối'}
          </span>
          <div className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </button>

        <button className="w-full glass-btn rounded-[24px] p-4 flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gray-100/80 dark:bg-gray-800/80 shadow-inner text-gray-700 dark:text-gray-300 flex items-center justify-center group-hover:bg-gray-200/80 transition-colors">
            <Settings size={22} />
          </div>
          <span className="font-bold flex-1 text-left text-lg">Cài đặt tài khoản</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full glass-btn rounded-[24px] p-4 flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-red-100/50 dark:bg-red-900/30 shadow-inner text-red-500 flex items-center justify-center group-hover:bg-red-100/80 transition-colors">
            <LogOut size={22} />
          </div>
          <span className="font-bold text-red-500 flex-1 text-left text-lg">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
