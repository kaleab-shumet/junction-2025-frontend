import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo - IDs match customer IDs in orders
const mockUsers = [
  { 
    id: 'user_kaleab', 
    name: 'Kaleab Kebede', 
    phone: '+358403640854',
    email: 'kaleabshumet@gmail.com', 
    password: 'admin123' 
  },
  { 
    id: 'user_fahim', 
    name: 'Fahim orko', 
    phone: '+358415714761',
    email: 'fahimorko4122@gmail.com', 
    password: 'admin123' 
  },
  { 
    id: 'user_sarah', 
    name: 'Sarah Martinez', 
    phone: '+358501234567',
    email: 'sarah.martinez@email.com', 
    password: 'admin123' 
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string): Promise<boolean> => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
          set({
            user: { id: user.id, name: user.name, phone: user.phone, email: user.email },
            isAuthenticated: true
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);