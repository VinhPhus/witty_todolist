import { create } from 'zustand';

// Sync theme with document and localStorage on initial load
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      return savedTheme;
    }
  }
  return 'light';
};

export const useAppStore = create((set) => ({
  isAddModalOpen: false,
  setAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),
  editTaskData: null,
  setEditTaskData: (task) => set({ editTaskData: task }),
  refreshTasks: 0,
  triggerRefresh: () => set((state) => ({ refreshTasks: state.refreshTasks + 1 })),
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  theme: getInitialTheme(),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
}));
