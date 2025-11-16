import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import Button from '../shared/Button';
import { useOrderStore } from '../../stores/orderStore';
import { useAuthStore } from '../../stores/authStore';
import { mockAlternatives } from '../../data/mockData';
import type { Order } from '../../types';

export default function CustomerOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, getIssuesByOrder } = useOrderStore();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId && user) {
      // Find the order and verify it belongs to the current user
      const foundOrder = orders.find(o => o.id === orderId && o.customerId === user.id);
      setOrder(foundOrder || null);
    }
  }, [orderId, orders, user]);

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
      case 'replaced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'removed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'completed': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
      case 'issues': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
      case 'cancelled': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Order Details" 
          showBack 
          onBack={() => navigate('/customer')} 
          variant="customer"
        />
        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-600">The order you're looking for doesn't exist or doesn't belong to you.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const issues = getIssuesByOrder(order.id);
  const totalPrice = order.items.reduce((sum, item) => {
    if (item.status === 'removed') return sum;
    
    // If item is replaced, use replacement price; otherwise use original price
    let itemPrice = item.originalPrice;
    if (item.status === 'replaced' && item.replacementId) {
      const replacement = mockAlternatives.find(alt => alt.id === item.replacementId);
      if (replacement) {
        itemPrice = replacement.price;
      }
    }
    
    return sum + (itemPrice * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen">
      <Header 
        title={`Order #${order.id}`}
        subtitle="View your order details and status"
        showBack 
        onBack={() => navigate('/customer')} 
        variant="customer"
      />
      
      <div className="p-6 space-y-6">
        {/* Order Status */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          
          {issues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium text-amber-900">Attention Required</span>
              </div>
              <p className="text-amber-800 text-sm">
                This order has {issues.length} issue{issues.length > 1 ? 's' : ''} that need your attention.
              </p>
              <Button
                onClick={() => navigate(`/customer/notifications/${order.id}`)}
                variant="danger"
                size="sm"
                className="mt-3"
              >
                Resolve Issues
              </Button>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => {
              const replacement = item.replacementId ? mockAlternatives.find(alt => alt.id === item.replacementId) : null;
              
              const items = [];
              
              // Original item (show if not replaced, or show as crossed out if replaced)
              if (item.status !== 'replaced') {
                items.push(
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className={`font-medium ${item.status === 'removed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600">${item.originalPrice.toFixed(2)} each</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getItemStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-medium ${item.status === 'removed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.status === 'removed' ? '$0.00' : `$${(item.originalPrice * item.quantity).toFixed(2)}`}
                      </span>
                      {item.status === 'removed' && (
                        <div className="text-xs text-red-600">Removed</div>
                      )}
                    </div>
                  </div>
                );
              } else {
                // Show original item as replaced (crossed out)
                items.push(
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className="font-medium line-through text-gray-500">{item.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600 line-through">${item.originalPrice.toFixed(2)} each</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">
                          Replaced
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium line-through text-gray-500">
                        $0.00
                      </span>
                    </div>
                  </div>
                );
                
                // Show replacement item as new line
                if (replacement) {
                  items.push(
                    <div key={`${item.id}-replacement`} className="flex items-center justify-between py-3 border-b border-gray-100 bg-blue-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <h4 className="font-medium text-blue-900">{replacement.name}</h4>
                        </div>
                        <div className="flex items-center gap-4 mt-1 ml-6">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="text-sm text-gray-600">${replacement.price.toFixed(2)} each</span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                            New Item
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-blue-900">
                          ${(replacement.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                }
              }
              
              return items;
            }).flat()}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {order.status === 'pending' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your order is being prepared. You can still cancel it if needed.
            </p>
            <Button
              onClick={() => {
                // This would trigger the cancel functionality
                navigate('/customer');
              }}
              variant="secondary"
              size="sm"
            >
              Cancel Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}