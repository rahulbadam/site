import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = uuidv4();
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Helper functions
export const toast = {
  success: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'success', title, message }),
  
  error: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'error', title, message, duration: 7000 }),
  
  warning: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'warning', title, message }),
  
  info: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'info', title, message }),
  
  withAction: (title: string, type: ToastType, action: { label: string; onClick: () => void }) =>
    useToastStore.getState().addToast({ type, title, action, duration: 10000 }),
};