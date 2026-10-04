import React, { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Star, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const RANKS = [
  { name: 'Bronze', color: '#cd7f32', bg: 'from-[#2a1a0f] to-[#140c07]', border: 'border-[#cd7f32]/50', text: 'text-[#cd7f32]' },
  { name: 'Silver', color: '#c0c0c0', bg: 'from-[#1c1c1c] to-[#0a0a0a]', border: 'border-[#c0c0c0]/50', text: 'text-[#c0c0c0]' },
  { name: 'Gold', color: '#ffd700', bg: 'from-[#2e2600] to-[#141100]', border: 'border-[#ffd700]/50', text: 'text-[#ffd700]' },
  { name: 'Platinum', color: '#00ced1', bg: 'from-[#002b2c] to-[#001111]', border: 'border-[#00ced1]/50', text: 'text-[#00ced1]' },
  { name: 'Diamond', color: '#b9f2ff', bg: 'from-[#122336] to-[#070e17]', border: 'border-[#b9f2ff]/50', text: 'text-[#b9f2ff]' },
  { name: 'Master', color: '#ff69b4', bg: 'from-[#2a0e1c] to-[#12060c]', border: 'border-[#ff69b4]/50', text: 'text-[#ff69b4]' },
  { name: 'Supreme', color: '#ff4500', bg: 'from-[#2e0c00] to-[#140500]', border: 'border-[#ff4500]/50', text: 'text-[#ff4500]' },
  { name: 'Extra Supreme', color: '#ff1493', bg: 'from-[#2e0419] to-[#14020b]', border: 'border-[#ff1493]/50', text: 'text-[#ff1493]' }
];

const POINTS_LIMITS = [100, 150, 200, 250, 300, 350, 400, 'MAX'];
const REWARDS_PER_RANK = [0, 50, 100, 150, 200, 300, 400, 500];

const RankBadge = ({ user, hideTooltip = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const [claimingIndex, setClaimingIndex] = useState(null);
  const [claimedAnim, setClaimedAnim] = useState({ index: null, points: 0 });

  if (!user) return null;

  const rankIndex = user.rankIndex || 0;
  const currentPoints = user.rankPoints || 0;

  const safeIndex = Math.min(rankIndex, RANKS.length - 1);
  const rank = RANKS[safeIndex];

  const maxPoints = safeIndex === RANKS.length - 1 ? 1 : POINTS_LIMITS[safeIndex]; 
  const displayMax = safeIndex === RANKS.length - 1 ? 'MAX' : maxPoints;
  const progress = safeIndex === RANKS.length - 1 ? 100 : Math.min((currentPoints / maxPoints) * 100, 100);

  const radius = 26;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (progress / 100) * arcLength;

  const handleClaim = async (e, targetRankIndex) => {
    e.stopPropagation();
    if (claimingIndex !== null) return;
    setClaimingIndex(targetRankIndex);
    try {
      const res = await api.post('/auth/claim-reward', { targetRankIndex });
      updateUser({
        balance: res.data.newBalance,
        claimedRanks: res.data.claimedRanks
      });
      setClaimedAnim({ index: targetRankIndex, points: res.data.reward });
      setTimeout(() => setClaimedAnim({ index: null, points: 0 }), 2000);
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setClaimingIndex(null);
    }
  };

  return (
    <>
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <svg className="w-20 h-20" viewBox="0 0 64 64">
          <path
            d="M 6 40 A 26 26 0 0 1 58 40"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="5"
            fill="transparent"
            strokeLinecap="round"
            className="dark:stroke-white/5"
          />
          <motion.path
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d="M 6 40 A 26 26 0 0 1 58 40"
            stroke={rank.color}
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={arcLength}
            strokeLinecap="round"
            className="drop-shadow-md"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 mt-2">
          <img
            src={`/ranks/${safeIndex}.png`}
            alt={rank.name}
            className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] z-10"
          />
        </div>

        {!hideTooltip && (
          <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
            <div className="font-bold text-sm mb-1 text-center" style={{ color: rank.color }}>{rank.name}</div>
            <div className="text-gray-300">EXP: <span className="text-white font-semibold">{currentPoints}</span> / {displayMax}</div>
          </div>
        )}
      </div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex flex-col justify-end lg:justify-center lg:items-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-md"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full lg:w-[500px] bg-[#12121a] rounded-t-[40px] lg:rounded-[40px] pb-10 max-h-[85vh] overflow-y-auto hide-scrollbar z-[101] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5"
              >
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#12121a] px-8 py-6 z-30 border-b border-white/5 shadow-md">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-wider uppercase">Hệ Thống Rank</h2>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-[0.2em] mt-1">Chặng Đường Tới Đỉnh Cao</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 cursor-pointer transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 px-8">
                  {RANKS.map((r, idx) => {
                    const isCurrent = idx === safeIndex;
                    const isLocked = idx > safeIndex;
                    
                    return (
                      <div key={r.name} className={`p-[1px] rounded-[24px] ${isCurrent ? 'bg-gradient-to-r ' + r.bg.replace('from-', 'from-').replace('to-', 'to-') + ' shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-white/5'} overflow-hidden transition-all ${isCurrent ? 'scale-[1.02]' : ''}`}>
                        <div className={`h-full w-full rounded-[23px] bg-gradient-to-br ${isCurrent ? r.bg : 'from-[#1a1a24] to-[#12121a]'} p-4 flex items-center gap-4 relative overflow-hidden`}>
                          
                          {/* Inner glow and particles */}
                          {isCurrent && (
                            <div className="absolute inset-0 bg-white/5">
                              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                            </div>
                          )}

                          {isCurrent && (
                            <div className="absolute top-0 right-0 bg-white/10 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl backdrop-blur-md z-20 flex items-center gap-1">
                              <Star size={10} className={r.text} fill="currentColor" /> HIỆN TẠI
                            </div>
                          )}
                          
                          <div className={`relative w-16 h-16 flex items-center justify-center flex-shrink-0 z-10 ${isLocked ? 'grayscale opacity-30' : ''}`}>
                            <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl ${isCurrent ? 'animate-pulse' : ''}`}></div>
                            <img
                              src={`/ranks/${idx}.png`}
                              alt={r.name}
                              className="w-[120%] h-[120%] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                            />
                            {isLocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl backdrop-blur-[2px]">
                                <Lock size={20} className="text-white/70" />
                              </div>
                            )}
                          </div>

                          <div className={`flex-1 z-10 ${isLocked ? 'opacity-50' : ''}`}>
                            <h3 className={`font-black text-xl uppercase tracking-wide ${isCurrent ? r.text : 'text-gray-300'}`}>{r.name}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Level {idx + 1}</p>
                          </div>

                          <div className={`text-right z-10 ${isLocked ? 'opacity-50' : ''}`}>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mốc Kinh Nghiệm</p>
                            <div className={`font-black text-lg ${isCurrent ? 'text-white' : 'text-gray-300'} bg-black/40 px-3 py-1 rounded-xl border border-white/10 inline-block`}>
                              {POINTS_LIMITS[idx]} <span className="text-[10px] text-gray-400">EXP</span>
                            </div>
                            
                            {idx > 0 && (
                              <div className="mt-2 flex items-center justify-end relative">
                                {!isLocked && !(user.claimedRanks || []).includes(idx) ? (
                                  <button
                                    onClick={(e) => handleClaim(e, idx)}
                                    disabled={claimingIndex === idx}
                                    className="flex items-center gap-1 text-[11px] font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(234,88,12,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    Nhận: +{REWARDS_PER_RANK[idx]}
                                    <img src="/point.png" alt="pt" className="w-3.5 h-3.5 object-contain drop-shadow-md" />
                                  </button>
                                ) : (user.claimedRanks || []).includes(idx) ? (
                                  <div className="flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20">
                                    <CheckCircle size={12} />
                                    Đã nhận
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-500/50 bg-yellow-500/5 px-2 py-0.5 rounded-lg border border-yellow-500/10">
                                    Thưởng: +{REWARDS_PER_RANK[idx]}
                                    <img src="/point.png" alt="pt" className="w-3.5 h-3.5 object-contain opacity-50" />
                                  </div>
                                )}

                                <AnimatePresence>
                                  {claimedAnim.index === idx && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, y: -40, scale: 1.2 }}
                                      exit={{ opacity: 0, y: -60, scale: 0.8 }}
                                      transition={{ type: "spring", damping: 15, stiffness: 200 }}
                                      className="absolute right-0 bottom-full mb-2 text-2xl font-black z-[100] whitespace-nowrap pointer-events-none flex items-center gap-1"
                                      style={{
                                        background: "linear-gradient(to top, #ea580c, #fcd34d)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        filter: "drop-shadow(0px 4px 8px rgba(234,88,12,0.4))",
                                      }}
                                    >
                                      +{claimedAnim.points}
                                      <img src="/point.png" alt="Point" className="w-6 h-6 object-contain ml-1 drop-shadow-lg" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default RankBadge;
