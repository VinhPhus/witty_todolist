import React, { useState, useEffect, useContext } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Check, X } from 'lucide-react';
import api from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import RankBadge from '../components/RankBadge';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { selectedDate, setSelectedDate, refreshTasks, triggerRefresh } = useAppStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completingTasks, setCompletingTasks] = useState([]);

  // Generate a week of dates
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/tasks?date=${selectedDate.toISOString()}`);
        setTasks(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedDate, refreshTasks]);

  const handleComplete = async (taskId) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/complete`);
      const awarded = res.data.gamification?.awarded || 0;
      
      // Update local context
      if (res.data.gamification) {
        updateUser({ 
          rankPoints: res.data.gamification.newRankPoints,
          rankIndex: res.data.gamification.newRankIndex,
          balance: res.data.gamification.newBalance
        });
      }
      
      // Update local state instantly to turn it gray
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: 'completed' } : t));
      
      // Add to completing list to show animation and keep it on screen temporarily
      setCompletingTasks(prev => [...prev, { id: taskId, points: awarded }]);
      
      // After 1.5s, remove it completely from screen
      setTimeout(() => {
        setCompletingTasks(prev => prev.filter(t => t.id !== taskId));
        triggerRefresh();
      }, 1500);

    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const displayTasks = tasks.filter(task => task.status !== 'completed' || completingTasks.some(ct => ct.id === task._id));

  return (
    <div className="p-6 pt-10">
      <header className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img src="/w-logo.png" alt="Witty Logo" className="w-12 h-12 object-contain mix-blend-multiply" />
          <div className="flex flex-col justify-center">
            <p className="text-gray-400 font-medium text-xs mb-0.5">{format(selectedDate, 'MMM d, yyyy')}</p>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Today</h1>
          </div>
        </div>
        <RankBadge user={user} />
      </header>

      {/* Date Selector */}
      <div className="flex justify-between items-center mb-8">
        {weekDates.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <div key={i} onClick={() => setSelectedDate(date)} className="flex flex-col items-center cursor-pointer">
              <span className={`text-xs mb-2 ${isSelected ? 'text-primary font-medium' : 'text-gray-400'}`}>
                {format(date, 'EEE')}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${isSelected ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/40 scale-110' : 'glass-btn text-gray-700'}`}>
                {format(date, 'd')}
              </div>
              {isSelected && <div className="w-1 h-1 rounded-full bg-primary mt-2"></div>}
            </div>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {loading ? (
           <p className="text-center text-gray-400 py-10">Đang tải...</p>
        ) : displayTasks.length === 0 ? (
           <div className="text-center py-10 text-gray-400">
             <p>Chưa có công việc nào.</p>
             <p className="text-sm">Bấm dấu + để thêm mới</p>
           </div>
        ) : (
          displayTasks.map((task, index) => {
            const isCompleted = task.status === 'completed';
            return (
              <div key={task._id} className="flex gap-4 items-start relative">
                <div className="w-[2px] h-full bg-blue-100 flex flex-col items-center mt-2">
                  <div className={`w-4 h-4 rounded-full border-[3px] border-white shadow-sm -ml-[7px] ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}></div>
                  {index !== tasks.length - 1 && <div className="w-[2px] h-20 bg-blue-100"></div>}
                </div>
                
                <div className={`flex-1 rounded-[24px] p-5 transition-all relative overflow-hidden ${isCompleted ? 'glass-dark opacity-60' : 'glass-primary text-white'}`}>
                  {/* Glossy highlight */}
                  {!isCompleted && <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>}
                  
                  <div className="flex justify-between items-center mb-2 relative z-10">
                    <h3 className={`font-semibold text-lg ${isCompleted ? 'text-gray-500 line-through' : ''}`}>{task.title}</h3>
                    <span className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-blue-100'}`}>
                      {format(new Date(task.dueDate), 'HH:mm')}
                    </span>
                  </div>
                  {task.description && (
                    <p className={`text-sm mb-4 ${isCompleted ? 'text-gray-400' : 'text-blue-100'}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2 relative">
                    <span className={`text-xs px-2 py-1 rounded-md ${isCompleted ? 'bg-gray-200 text-gray-500' : 'bg-white/20 text-white'}`}>
                      {task.difficulty}
                    </span>
                    
                    <div className="relative">
                      {!isCompleted ? (
                        <button 
                          onClick={() => handleComplete(task._id)}
                          className="bg-white/90 backdrop-blur-md w-8 h-8 rounded-xl flex items-center justify-center text-primary shadow-sm hover:scale-110 hover:bg-white transition-all cursor-pointer">
                          <Check size={16} strokeWidth={3} />
                        </button>
                      ) : (
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 bg-black/10">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Animation placed outside overflow-hidden card */}
                <AnimatePresence>
                  {completingTasks.find(ct => ct.id === task._id) && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 0.3, rotate: -15 }}
                      animate={{ opacity: 1, y: -90, scale: 1.3, rotate: 5 }}
                      exit={{ opacity: 0, y: -120, scale: 0.8 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      className="absolute bottom-8 right-6 text-5xl font-black z-[100] whitespace-nowrap pointer-events-none flex items-center gap-1"
                      style={{
                        background: "linear-gradient(to top, #ea580c, #fcd34d)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: "drop-shadow(0px 8px 16px rgba(234,88,12,0.5))",
                      }}
                    >
                      +{completingTasks.find(ct => ct.id === task._id).points}
                      <span className="text-2xl" style={{ WebkitTextFillColor: '#fcd34d' }}>✦</span>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
