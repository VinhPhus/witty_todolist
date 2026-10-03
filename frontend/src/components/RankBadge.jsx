import React from 'react';
import { motion } from 'framer-motion';

const RANKS = [
  { name: 'Bronze', color: '#b08d57', bg: 'from-amber-700 to-yellow-900', isHex: false },
  { name: 'Silver', color: '#c0c0c0', bg: 'from-gray-300 to-gray-500', isHex: false },
  { name: 'Gold', color: '#ffd700', bg: 'from-yellow-300 to-yellow-600', isHex: false },
  { name: 'Platinum', color: '#00ced1', bg: 'from-cyan-300 to-blue-500', isHex: true, wings: 'blue' },
  { name: 'Diamond', color: '#b9f2ff', bg: 'from-indigo-400 to-purple-600', isHex: true, wings: 'white' },
  { name: 'Master', color: '#ff69b4', bg: 'from-fuchsia-500 to-purple-700', isHex: true, wings: 'gold' },
  { name: 'Supreme', color: '#ff4500', bg: 'from-red-500 to-orange-500', isHex: true, wings: 'gold' },
  { name: 'Extra Supreme', color: '#ff1493', bg: 'from-pink-500 via-red-500 to-yellow-500', isHex: true, wings: 'rainbow' }
];

const RankBadge = ({ user, hideTooltip = false }) => {
  if (!user) return null;
  
  const rankIndex = user.rankIndex || 0;
  const currentPoints = user.rankPoints || 0;
  
  // Use safe index
  const safeIndex = Math.min(rankIndex, RANKS.length - 1);
  const rank = RANKS[safeIndex];
  
  const maxPoints = 100; // From backend constants POINTS_PER_RANK
  const progress = safeIndex === RANKS.length - 1 ? 100 : Math.min((currentPoints / maxPoints) * 100, 100);
  
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center cursor-pointer group">
      {/* Circular Progress Bar */}
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="32"
          cy="32"
          r={radius}
          stroke={rank.color}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="drop-shadow-md"
        />
      </svg>
      
      {/* Rank Icon Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Render CSS Shapes approximation for gems */}
        <div className={`relative w-8 h-8 flex items-center justify-center drop-shadow-sm`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${rank.bg} 
            ${rank.isHex ? 'clip-hexagon' : 'clip-pentagon'} 
            shadow-inner flex items-center justify-center
          `}>
             <div className={`w-[60%] h-[60%] bg-white/40 backdrop-blur-sm ${rank.isHex ? 'clip-hexagon' : 'clip-pentagon'}`}></div>
          </div>
          {rank.wings && (
             <div className={`absolute -left-2 -right-2 top-[30%] h-3 border-t-[3px] border-dotted ${rank.wings === 'gold' ? 'border-yellow-400' : 'border-blue-200'} -z-10 opacity-70`}></div>
          )}
        </div>
      </div>

      {/* Tooltip on Hover */}
      {!hideTooltip && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
          <div className="font-bold text-sm mb-1 text-center" style={{ color: rank.color }}>{rank.name}</div>
          <div className="text-gray-300">Điểm: <span className="text-white font-semibold">{currentPoints}</span> / {safeIndex === RANKS.length - 1 ? 'MAX' : maxPoints}</div>
        </div>
      )}
      
      {/* Dynamic styles for clip-path */}
      <style>{`
        .clip-pentagon { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }
        .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
      `}</style>
    </div>
  );
};

export default RankBadge;
