import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useOrderStore } from '../../stores/orderStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { mockAlternatives } from '../../data/mockData';
import Header from '../shared/Header';
import Button from '../shared/Button';
import type { Order } from '../../types';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getOrdersByCustomer, getIssuesByOrder, cancelOrder } = useOrderStore();
  const { addNotification } = useNotificationStore();
  
  // Find orders for this customer (using user ID as customer ID)
  const customerOrders = user ? getOrdersByCustomer(user.id) : [];

  const getOrderIssues = (orderId: string) => {
    return getIssuesByOrder(orderId);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white';
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'issues': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'cancelled': return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'completed': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
      case 'issues': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
      case 'cancelled': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
    addNotification({
      title: 'Order Cancelled',
      message: `Order #${orderId} has been cancelled successfully.`,
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen">
      <Header 
        title={`Welcome, ${user?.name}`}
        subtitle="Manage your orders and track deliveries"
        variant="customer"
      />
      
      <div className="p-6">
        {/* User Info & Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-500 text-sm">{user?.phone}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              }
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
            <div className="text-sm text-gray-600">
              {customerOrders.length} {customerOrders.length === 1 ? 'order' : 'orders'}
            </div>
          </div>

          {customerOrders.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">You don't have any orders yet.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {customerOrders.map((order) => {
                const issues = getOrderIssues(order.id);
                const hasIssues = issues.length > 0;
                
                return (
                  <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                            #{order.id}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Order #{order.id}</h3>
                            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                          </div>
                          {hasIssues && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              {issues.length} issue{issues.length > 1 ? 's' : ''} need attention
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                              </svg>
                              {order.items.length} items
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              ${order.items.reduce((sum, item) => {
                                if (item.status === 'removed') return sum;
                                let itemPrice = item.originalPrice;
                                if (item.status === 'replaced' && item.replacementId) {
                                  const replacement = mockAlternatives.find(alt => alt.id === item.replacementId);
                                  if (replacement) {
                                    itemPrice = replacement.price;
                                  }
                                }
                                return sum + itemPrice * item.quantity;
                              }, 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {hasIssues ? (
                              <Button
                                onClick={() => navigate(`/customer/notifications/${order.id}`)}
                                variant="danger"
                                size="sm"
                                icon={
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V5a3 3 0 00-3-3H7a3 3 0 00-3 3v7L9 17h6z" />
                                  </svg>
                                }
                              >
                                Resolve Issues
                              </Button>
                            ) : (
                              <Button
                                onClick={() => navigate(`/customer/order-details/${order.id}`)}
                                size="sm"
                                icon={
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                }
                              >
                                View Details
                              </Button>
                            )}
                            {(order.status === 'pending' || order.status === 'issues') && (
                              <Button
                                onClick={() => handleCancelOrder(order.id)}
                                variant="secondary"
                                size="sm"
                                icon={
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                }
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}