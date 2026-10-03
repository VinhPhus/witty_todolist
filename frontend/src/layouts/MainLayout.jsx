import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Trophy, ShoppingBag, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import api from '../services/api';

const MainLayout = () => {
  const { isAddModalOpen, setAddModalOpen, selectedDate, triggerRefresh } = useAppStore();
  const [newTask, setNewTask] = useState({ title: '', description: '', difficulty: 'Dễ' });

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        ...newTask,
        dueDate: selectedDate
      });
      setAddModalOpen(false);
      setNewTask({ title: '', description: '', difficulty: 'Dễ' });
      triggerRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi thêm task');
    }
  };
  return (
    <div className="app-container flex flex-col relative bg-transparent">
      {/* Top Header / Status bar space can go here */}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full glass-panel px-6 py-4 flex justify-between items-center rounded-b-[40px] z-50">
        <NavItem to="/" icon={<Home size={24} />} />
        <NavItem to="/leaderboard" icon={<Trophy size={24} />} />
        
        {/* Floating Add Button in the middle */}
        <div className="relative -top-8">
          <button 
            onClick={() => setAddModalOpen(true)}
            className="bg-gradient-to-tr from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(59,130,246,0.5)] cursor-pointer">
            <span className="text-2xl font-light">+</span>
          </button>
        </div>

        <NavItem to="/shop" icon={<ShoppingBag size={24} />} />
        <NavItem to="/profile" icon={<User size={24} />} />
      </nav>

      {/* Add Task Modal overlaying the whole layout */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="absolute inset-0 z-[60] flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setAddModalOpen(false)} 
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full bg-white rounded-t-3xl p-6 shadow-2xl pb-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Thêm việc mới</h2>
                <button onClick={() => setAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Tên công việc..." 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Mô tả (tùy chọn)..." 
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-24"
                  />
                </div>
                <div className="flex gap-2">
                  {['Dễ', 'Vừa', 'Khó'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewTask({...newTask, difficulty: level})}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer
                        ${newTask.difficulty === level ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <button type="submit" className="w-full bg-primary text-white rounded-xl py-4 font-semibold shadow-md shadow-blue-200 hover:bg-blue-600 transition-colors mt-2 text-lg cursor-pointer">
                  Tạo mới
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem = ({ to, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `p-2 rounded-full transition-colors ${
        isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
      }`
    }
  >
    {icon}
  </NavLink>
);

export default MainLayout;
