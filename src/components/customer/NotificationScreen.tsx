import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import Button from '../shared/Button';
import { useOrderStore } from '../../stores/orderStore';
import { useNotificationStore } from '../../stores/notificationStore';
import type { Issue, Order } from '../../types';

export default function NotificationScreen() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getIssuesByOrder, orders, cancelOrder } = useOrderStore();
  const { addNotification } = useNotificationStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    if (orderId) {
      // Get issues from Zustand store (real-time)
      const orderIssues = getIssuesByOrder(orderId);
      const foundOrder = orders.find(o => o.id === orderId);
      
      setIssues(orderIssues);
      setOrder(foundOrder || null);
    }
  }, [orderId, getIssuesByOrder, orders]);

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'out-of-stock':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
      case 'damaged':
        return (
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'expired':
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };


  const handleCancelOrder = () => {
    if (!orderId) return;
    
    cancelOrder(orderId);
    addNotification({
      title: 'Order Cancelled',
      message: `Order #${orderId} has been cancelled successfully.`,
      type: 'success'
    });
    navigate('/customer');
  };

  const hasIssue = (itemId: string) => {
    return issues.some(issue => issue.itemId === itemId);
  };

  if (!order || issues.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Order Update" />
        <div className="p-4">
          <div className="text-center text-gray-500">No issues found for this order</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Order Update" 
        subtitle={`We need your attention for order #${order.id}`}
        variant="customer"
        notificationCount={issues.length}
      />
      
      <div className="p-6 space-y-6">
        {/* Alert Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">
                Action Required
              </h2>
              <p className="text-white/90">
                We found some issues with items in your order and need your decision
              </p>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
              #{order.id}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{order.customerName}</h3>
              <p className="text-gray-600">Order placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Order Items with Issue Highlights */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Your Order Items</h3>
          
          {order.items.map((item) => {
            const itemHasIssue = hasIssue(item.id);
            const itemIssue = issues.find(issue => issue.itemId === item.id);
            
            return (
              <div 
                key={item.id} 
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden ${
                  itemHasIssue 
                    ? 'border-red-300 ring-2 ring-red-100' 
                    : 'border-white/20'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {itemHasIssue && (
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        {getIssueIcon(itemIssue?.type || 'other')}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                        {!itemHasIssue && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            ✓ Available
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600">${item.originalPrice.toFixed(2)} each</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${(item.originalPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {itemHasIssue && itemIssue && (
                        <>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-red-800 font-medium">⚠️ Issue:</span>
                              <span className="text-red-700 text-sm">{itemIssue.type.replace('-', ' ')}</span>
                            </div>
                            <p className="text-red-800 text-sm">
                              {itemIssue.message || `This item is ${itemIssue.type.replace('-', ' ')}`}
                            </p>
                          </div>
                          
                          <p className="text-gray-600 mb-4">What would you like us to do with this item?</p>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={() => navigate(`/customer/alternatives/${order.id}/${itemIssue.itemId}`)}
                              variant="success"
                              className="flex-1"
                              icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              }
                            >
                              Find Replacement
                            </Button>
                            <Button
                              onClick={() => navigate(`/customer/confirmation/${order.id}?action=remove&itemId=${itemIssue.itemId}`)}
                              variant="secondary"
                              className="flex-1"
                              icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              }
                            >
                              Remove from Order
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancel Order Option */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Options</h3>
          <p className="text-gray-600 text-sm mb-4">
            If you're not satisfied with the available alternatives, you can cancel the entire order for a full refund.
          </p>
          <Button
            onClick={handleCancelOrder}
            variant="danger"
            size="sm"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          >
            Cancel Entire Order
          </Button>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-semibold text-blue-900">Need Help?</h4>
          </div>
          <p className="text-blue-800 text-sm">
            If you have questions about these items or need assistance, please contact our support team. 
            We're here to help make sure you get exactly what you need.
          </p>
        </div>
      </div>
    </div>
  );
}