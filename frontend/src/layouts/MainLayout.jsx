import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Trophy, ShoppingBag, User, X, Coffee, Briefcase, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import api from '../services/api';

const MainLayout = () => {
  const { isAddModalOpen, setAddModalOpen, selectedDate, triggerRefresh, editTaskData, setEditTaskData } = useAppStore();
  const [taskForm, setTaskForm] = useState({ title: '', description: '', difficulty: 'Dễ' });

  const difficultyOptions = [
    { level: 'Dễ', icon: Coffee, colorClass: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/30' },
    { level: 'Vừa', icon: Briefcase, colorClass: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30' },
    { level: 'Khó', icon: Flame, colorClass: 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/30' },
  ];

  useEffect(() => {
    if (editTaskData) {
      setTaskForm({
        title: editTaskData.title,
        description: editTaskData.description || '',
        difficulty: editTaskData.difficulty
      });
      setAddModalOpen(true);
    }
  }, [editTaskData, setAddModalOpen]);

  const handleCloseModal = () => {
    setAddModalOpen(false);
    setTimeout(() => {
      setEditTaskData(null);
      setTaskForm({ title: '', description: '', difficulty: 'Dễ' });
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTaskData) {
        await api.put(`/tasks/${editTaskData._id}`, {
          ...taskForm,
          dueDate: editTaskData.dueDate
        });
      } else {
        await api.post('/tasks', {
          ...taskForm,
          dueDate: selectedDate
        });
      }
      handleCloseModal();
      triggerRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
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
            onClick={() => {
              setEditTaskData(null);
              setTaskForm({ title: '', description: '', difficulty: 'Dễ' });
              setAddModalOpen(true);
            }}
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
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-2xl pb-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editTaskData ? 'Chỉnh sửa công việc' : 'Thêm việc mới'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full p-1 cursor-pointer transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Tên công việc..."
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Mô tả (tùy chọn)..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-24 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-2">
                  {difficultyOptions.map(({ level, icon: Icon, colorClass }) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setTaskForm({ ...taskForm, difficulty: level })}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5
                        ${taskForm.difficulty === level ? colorClass + ' scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      <Icon size={16} className={taskForm.difficulty === level ? 'animate-pulse' : 'opacity-70'} />
                      {level}
                    </button>
                  ))}
                </div>
                <button type="submit" className="w-full bg-primary text-white rounded-xl py-4 font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-600 transition-colors mt-2 text-lg cursor-pointer">
                  {editTaskData ? 'Cập nhật' : 'Tạo mới'}
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
      `p-2 rounded-full transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
      }`
    }
  >
    {icon}
  </NavLink>
);

export default MainLayout;
