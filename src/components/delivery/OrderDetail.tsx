import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import Button from '../shared/Button';
import ReportProblemModal from './ReportProblemModal';
import AINotificationModal from '../shared/AINotificationModal';
import { useOrderStore } from '../../stores/orderStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { mockAlternatives } from '../../data/mockData';
import type { Order } from '../../types';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, markOrderAsCompleted, getPendingIssues, submitPendingIssues, removePendingIssue, getIssuesByOrder } = useOrderStore();
  const { addNotification } = useNotificationStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (orderId) {
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId, orders]);

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      case 'replaced': return 'bg-blue-100 text-blue-800';
      case 'removed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReportProblem = (itemId: string, itemName: string) => {
    setSelectedItem({ id: itemId, name: itemName });
    setModalOpen(true);
  };

  const handleMarkCompleted = () => {
    if (!orderId) return;
    
    markOrderAsCompleted(orderId);
    addNotification({
      title: 'Order Completed',
      message: `Order #${orderId} has been marked as completed successfully.`,
      type: 'success'
    });
    navigate('/delivery');
  };

  const getReplacementItem = (replacementId?: string) => {
    if (!replacementId) return null;
    return mockAlternatives.find(alt => alt.id === replacementId);
  };

  const getCustomerPhone = (customerId: string) => {
    // Map customer IDs to their phone numbers
    const phoneMap: Record<string, string> = {
      'user_kaleab': '+358403640854',
      'user_fahim': '+358415714761',
      'user_sarah': '+358501234567'
    };
    return phoneMap[customerId] || '+358403640854'; // default fallback
  };

  const handleSendIssuesToCustomer = () => {
    if (!orderId) return;
    
    const pendingIssues = getPendingIssues(orderId);
    if (pendingIssues.length === 0) return;
    
    setAiModalOpen(true);
  };

  const handleConfirmSendToAI = async () => {
    if (!orderId || !order) return;
    
    const pendingIssues = getPendingIssues(orderId);
    
    // Prepare the data for the API request
    const missedItemsAndReasons = pendingIssues.map(issue => {
      const item = order.items.find(i => i.id === issue.itemId);
      return `${item?.name}: ${issue.type.replace('-', ' ')}${issue.message ? ` - ${issue.message}` : ''}`;
    }).join('; ');

    const requestData = {
      name: order.customerName,
      phone_number: getCustomerPhone(order.customerId),
      missed_items_and_reasons: missedItemsAndReasons,
      update_items_url: `${window.location.protocol}//${window.location.host}/login`
    };

    try {
      // Make POST request to the webhook
      const response = await fetch('https://eodme8glxa1xlk8.m.pipedream.net', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        submitPendingIssues(orderId);
        
        addNotification({
          title: 'AI Agent Activated',
          message: `AI agent will contact ${order.customerName} about ${pendingIssues.length} issue(s) via SMS and phone call.`,
          type: 'success'
        });
      } else {
        addNotification({
          title: 'Failed to Contact AI Agent',
          message: 'Unable to send notification to AI agent. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      addNotification({
        title: 'Network Error',
        message: 'Unable to reach AI agent service. Please try again.',
        type: 'error'
      });
    }
    
    setAiModalOpen(false);
  };

  const handleRemovePendingIssue = (itemId: string) => {
    if (!orderId) return;
    removePendingIssue(orderId, itemId);
    addNotification({
      title: 'Issue Removed',
      message: 'Pending issue has been removed.',
      type: 'success'
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Order Detail" 
          showBack 
          onBack={() => navigate('/delivery')} 
        />
        <div className="p-4">
          <div className="text-center text-gray-500">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={`Order #${order.id}`} 
        showBack 
        onBack={() => navigate('/delivery')} 
      />
      
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
          <p className="text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-500">
            Order placed: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Pending Issues Section */}
        {orderId && getPendingIssues(orderId).length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-amber-900">Pending Issues ({getPendingIssues(orderId).length})</h3>
              <Button
                onClick={handleSendIssuesToCustomer}
                variant="danger"
                size="sm"
              >
                Send to Customer
              </Button>
            </div>
            <div className="space-y-2">
              {getPendingIssues(orderId).map((pendingIssue) => {
                const item = order.items.find(i => i.id === pendingIssue.itemId);
                return (
                  <div key={pendingIssue.itemId} className="flex items-center justify-between bg-white rounded p-3">
                    <div>
                      <span className="font-medium">{item?.name}</span>
                      <div className="text-sm text-gray-600">
                        {pendingIssue.type.replace('-', ' ')} - {pendingIssue.message}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemovePendingIssue(pendingIssue.itemId)}
                      variant="secondary"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => {
              const replacement = getReplacementItem(item.replacementId);
              const hasPendingIssue = orderId ? getPendingIssues(orderId).some(issue => issue.itemId === item.id) : false;
              
              const items = [];
              
              // Original item (show if not replaced, or show as crossed out if replaced)
              if (item.status !== 'replaced') {
                items.push(
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className={`font-medium ${item.status === 'removed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.name}
                      </h4>
                      {hasPendingIssue && (
                        <div className="mt-1 text-sm text-amber-600">
                          ⚠️ Pending issue - waiting to send to customer
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600">${item.originalPrice.toFixed(2)}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getItemStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === 'available' && (order.status === 'pending' || order.status === 'issues') && !hasPendingIssue && (
                        <Button
                          onClick={() => handleReportProblem(item.id, item.name)}
                          variant="secondary"
                          size="sm"
                        >
                          Report Problem
                        </Button>
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
                        <span className="text-sm text-gray-600 line-through">${item.originalPrice.toFixed(2)}</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border-gray-200">
                          Replaced
                        </span>
                      </div>
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
                          <span className="text-sm text-gray-600">${replacement.price.toFixed(2)}</span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border-blue-200">
                            New Item
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
              
              return items;
            }).flat()}
          </div>
        </div>


        {(order.status === 'pending' || order.status === 'issues') && (() => {
          const pendingIssuesCount = orderId ? getPendingIssues(orderId).length : 0;
          const activeIssuesCount = orderId ? getIssuesByOrder(orderId).length : 0;
          const hasAnyIssues = pendingIssuesCount > 0 || activeIssuesCount > 0;
          
          return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {hasAnyIssues ? (
                <div className="text-center">
                  <div className="text-sm text-amber-600 mb-2">
                    ⚠️ Cannot complete order with unresolved issues
                  </div>
                  <div className="text-xs text-gray-500">
                    {pendingIssuesCount > 0 && `${pendingIssuesCount} pending issue(s) need to be sent to customer`}
                    {pendingIssuesCount > 0 && activeIssuesCount > 0 && ' • '}
                    {activeIssuesCount > 0 && `${activeIssuesCount} active issue(s) awaiting customer response`}
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleMarkCompleted}
                  variant="success"
                  className="w-full"
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          );
        })()}
      </div>

      {selectedItem && (
        <ReportProblemModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedItem(null);
          }}
          itemName={selectedItem.name}
          orderId={order.id}
          itemId={selectedItem.id}
        />
      )}
      
      <AINotificationModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onConfirm={handleConfirmSendToAI}
        customerName={order?.customerName || ''}
        customerPhone={order ? getCustomerPhone(order.customerId) : ''}
        issueCount={orderId ? getPendingIssues(orderId).length : 0}
      />
    </div>
  );
}