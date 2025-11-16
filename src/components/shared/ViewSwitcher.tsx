import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Button from './Button';

export default function ViewSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  
  const isDeliveryView = location.pathname.startsWith('/delivery');
  const isCustomerView = location.pathname.startsWith('/customer');
  const isAuthView = location.pathname.startsWith('/login');

  const switchToDelivery = () => {
    navigate('/delivery');
  };

  const switchToCustomer = () => {
    if (isAuthenticated) {
      navigate('/customer');
    } else {
      navigate('/login');
    }
  };

  if (!isDeliveryView && !isCustomerView && !isAuthView) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="px-3 py-1 bg-gray-100/50 text-xs font-medium text-gray-600 text-center">
          Switch View
        </div>
        <div className="p-2 flex gap-2">
          <Button
            onClick={switchToDelivery}
            variant={isDeliveryView ? 'primary' : 'secondary'}
            size="sm"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          >
            Delivery
          </Button>
          <Button
            onClick={switchToCustomer}
            variant={isCustomerView ? 'success' : 'secondary'}
            size="sm"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            Customer
          </Button>
        </div>
      </div>
    </div>
  );
}