import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  timestamp: Date;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      duration: notificationData.duration ?? 5000,
    };
    
    set((state) => ({
      notifications: [...state.notifications, notification]
    }));
    
    // Auto-remove after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== notification.id)
        }));
      }, notification.duration);
    }
  },
  
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  clearAll: () => {
    set({ notifications: [] });
  },
}));