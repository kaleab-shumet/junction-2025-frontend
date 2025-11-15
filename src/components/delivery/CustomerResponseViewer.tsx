import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import Button from '../shared/Button';
import { useAppContext } from '../../context/AppContext';
import type { CustomerResponse, Order } from '../../types';
import { mockOrders, mockAlternatives } from '../../data/mockData';

export default function CustomerResponseViewer() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { customerResponses } = useAppContext();
  const [response, setResponse] = useState<CustomerResponse | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      // Get latest response from context (real-time)
      const foundResponse = customerResponses
        .filter(r => r.orderId === orderId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      const foundOrder = mockOrders.find(o => o.id === orderId);
      
      setResponse(foundResponse || null);
      setOrder(foundOrder || null);
    }
  }, [orderId, customerResponses]);

  const handleConfirmAndContinue = () => {
    console.log('Confirming customer response and continuing with order processing');
    navigate('/delivery');
  };

  if (!response || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Customer Response" 
          showBack 
          onBack={() => navigate('/delivery')} 
        />
        <div className="p-4">
          <div className="text-center text-gray-500">
            {!order ? 'Order not found' : 'No customer response available'}
          </div>
        </div>
      </div>
    );
  }

  const affectedItem = order.items.find(item => item.id === response.itemId);
  const replacement = response.replacementId ? 
    mockAlternatives.find(alt => alt.id === response.replacementId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Customer Response" 
        showBack 
        onBack={() => navigate('/delivery')} 
      />
      
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Order #{order.id}</h3>
          <p className="text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-500">
            Response received: {new Date(response.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-4">Customer Decision</h3>
          
          {affectedItem && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700">Original Item:</h4>
              <p className="text-gray-900">{affectedItem.name}</p>
              <p className="text-sm text-gray-500">Quantity: {affectedItem.quantity} • ${affectedItem.originalPrice.toFixed(2)}</p>
            </div>
          )}

          <div className={`p-4 rounded-lg border-2 ${
            response.action === 'replace' 
              ? 'border-blue-200 bg-blue-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            {response.action === 'replace' ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-blue-900">Customer chose replacement</span>
                </div>
                {replacement && (
                  <div>
                    <p className="font-medium text-gray-900">{replacement.name}</p>
                    <p className="text-sm text-gray-600">${replacement.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{replacement.similarity}% similarity match</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-red-900">Customer chose to remove item</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <Button
            onClick={handleConfirmAndContinue}
            className="w-full"
          >
            Confirm & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}