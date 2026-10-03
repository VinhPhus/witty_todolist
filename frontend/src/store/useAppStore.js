import { create } from 'zustand';

export const useAppStore = create((set) => ({
  isAddModalOpen: false,
  setAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),
  refreshTasks: 0,
  triggerRefresh: () => set((state) => ({ refreshTasks: state.refreshTasks + 1 })),
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
