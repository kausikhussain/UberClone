import { create } from 'zustand';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
    removeToast: (id: number) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export default useToastStore;
