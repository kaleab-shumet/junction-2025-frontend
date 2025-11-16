import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import Button from '../shared/Button';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      addNotification({
        title: 'Validation Error',
        message: 'Please enter both email and password',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      
      if (success) {
        addNotification({
          title: 'Login Successful',
          message: 'Welcome back! Redirecting to your orders...',
          type: 'success'
        });
        onSuccess?.();
      } else {
        addNotification({
          title: 'Login Failed',
          message: 'Invalid email or password. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Customer Portal</h1>
            <p className="text-white/80 text-sm">Access your orders and manage replacements</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                variant="success"
                size="lg"
                className="w-full"
                disabled={isLoading}
                icon={
                  isLoading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  )
                }
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}