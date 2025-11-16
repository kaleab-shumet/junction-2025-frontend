import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../shared/Header';
import Button from '../shared/Button';
import { useOrderStore } from '../../stores/orderStore';
import { useNotificationStore } from '../../stores/notificationStore';
import type { Order } from '../../types';
import { mockAlternatives } from '../../data/mockData';

export default function ConfirmationScreen() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { submitCustomerResponse, orders } = useOrderStore();
  const { addNotification } = useNotificationStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const action = searchParams.get('action');
  const itemId = searchParams.get('itemId');
  const replacementId = searchParams.get('replacementId');

  useEffect(() => {
    // Get order from store
    const fetchOrder = async () => {
      try {
        // await fetch(`/api/orders/${orderId}`);
        const foundOrder = orders.find(o => o.id === orderId);
        setOrder(foundOrder || null);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, orders]);

  const handleSendToDelivery = async () => {
    if (!orderId || !itemId || !action) return;
    
    setIsSubmitting(true);
    try {
      // Submit customer response through Zustand store
      submitCustomerResponse({
        orderId,
        itemId,
        action: action as 'replace' | 'remove',
        replacementId: replacementId || undefined
      });
      
      // Show professional notification
      addNotification({
        title: 'Decision Submitted Successfully',
        message: 'Your decision has been sent to the delivery team. They will update your order accordingly.',
        type: 'success'
      });
      
      // Auto-navigate to customer dashboard after a brief delay
      setTimeout(() => {
        navigate('/customer');
      }, 2000);
    } catch (error) {
      console.error('Failed to send decision:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order || !action || !itemId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Confirmation" />
        <div className="p-4">
          <div className="text-center text-gray-500">Invalid confirmation parameters</div>
        </div>
      </div>
    );
  }

  const originalItem = order.items.find(item => item.id === itemId);
  const replacement = replacementId ? mockAlternatives.find(alt => alt.id === replacementId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Confirm Your Choice" />
      
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Order Summary
          </h2>
          <p className="text-gray-600">Order #{order.id}</p>
          <p className="text-sm text-gray-500">{order.customerName}</p>
        </div>

        <div className={`bg-white rounded-lg shadow-sm border-2 p-4 ${
          action === 'replace' ? 'border-blue-200' : 'border-red-200'
        }`}>
          <h3 className="font-medium text-gray-900 mb-4">Your Decision</h3>
          
          {originalItem && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Original Item:</h4>
              <p className="text-gray-900">{originalItem.name}</p>
              <p className="text-sm text-gray-500">${originalItem.originalPrice.toFixed(2)}</p>
            </div>
          )}

          {action === 'replace' && replacement ? (
            <div className={`p-4 rounded-lg bg-blue-50 border border-blue-200`}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-blue-900">Replace with:</span>
              </div>
              <p className="font-medium text-gray-900">{replacement.name}</p>
              <p className="text-sm text-gray-600">${replacement.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{replacement.similarity}% similarity match</p>
              
              {replacement.price !== originalItem?.originalPrice && (
                <div className="mt-2 text-sm">
                  <span className={replacement.price > (originalItem?.originalPrice || 0) 
                    ? 'text-red-600' 
                    : 'text-green-600'
                  }>
                    {replacement.price > (originalItem?.originalPrice || 0) ? '+' : ''}
                    ${(replacement.price - (originalItem?.originalPrice || 0)).toFixed(2)} price difference
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-red-900">Remove this item from order</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Refund: ${originalItem?.originalPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <Button
            onClick={handleSendToDelivery}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Sending...' : 'Send to Delivery'}
          </Button>
          
          <Button
            onClick={() => navigate(`/customer/notifications/${orderId}`)}
            variant="secondary"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}