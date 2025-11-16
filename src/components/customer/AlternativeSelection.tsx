import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import Button from '../shared/Button';
import { useOrderStore } from '../../stores/orderStore';
import type { Alternative, Order } from '../../types';
import { mockAlternatives } from '../../data/mockData';

export default function AlternativeSelection() {
  const { orderId, itemId } = useParams<{ orderId: string; itemId: string }>();
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [filteredAlternatives, setFilteredAlternatives] = useState<Alternative[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load alternatives and order data
    const fetchAlternatives = async () => {
      try {
        // await fetch(`/api/alternatives?itemId=${itemId}`);
        const foundOrder = orders.find(o => o.id === orderId);
        setOrder(foundOrder || null);
        setAlternatives(mockAlternatives);
        setFilteredAlternatives(mockAlternatives);
      } catch (error) {
        console.error('Failed to fetch alternatives:', error);
      }
    };

    if (orderId && itemId) {
      fetchAlternatives();
    }
  }, [orderId, itemId, orders]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAlternatives(alternatives);
    } else {
      const filtered = alternatives.filter(alt =>
        alt.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAlternatives(filtered);
    }
  }, [searchQuery, alternatives]);

  const handleSendChoice = async () => {
    if (!selectedAlternative) return;

    // Navigate to confirmation screen with replacement details
    navigate(`/customer/confirmation/${orderId}?action=replace&itemId=${itemId}&replacementId=${selectedAlternative}`);
  };

  const originalItem = order?.items.find(item => item.id === itemId);

  return (
    <div className="min-h-screen">
      <Header 
        title="Choose Alternative" 
        subtitle="Find the perfect replacement for your item"
        showBack 
        onBack={() => navigate(`/customer/notifications/${orderId}`)} 
        variant="customer"
      />
      
      <div className="p-6 space-y-6">
        {originalItem && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Unavailable Item</h3>
                <p className="text-red-800 text-lg font-medium">{originalItem.name}</p>
                <p className="text-red-600 text-sm">Original price: ${originalItem.originalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            🔍 Search for alternatives
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for similar items..."
              className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200"
            />
            <svg className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Available Alternatives</h3>
          {filteredAlternatives.map((alternative) => (
            <div 
              key={alternative.id}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                selectedAlternative === alternative.id 
                  ? 'border-green-500 bg-green-50/80 shadow-green-200' 
                  : 'border-white/20 hover:border-green-300 hover:shadow-xl'
              }`}
              onClick={() => setSelectedAlternative(alternative.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{alternative.name}</h4>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      alternative.similarity >= 85 
                        ? 'bg-green-100 text-green-800' 
                        : alternative.similarity >= 70 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                    }`}>
                      {alternative.similarity}% match
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-lg font-semibold text-green-600">${alternative.price.toFixed(2)}</span>
                    </div>
                    {originalItem && (
                      <div className={`text-sm font-medium ${
                        alternative.price > originalItem.originalPrice 
                          ? 'text-red-600' 
                          : alternative.price < originalItem.originalPrice 
                            ? 'text-green-600' 
                            : 'text-gray-600'
                      }`}>
                        {alternative.price > originalItem.originalPrice && '+'}
                        ${(alternative.price - originalItem.originalPrice).toFixed(2)} difference
                      </div>
                    )}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-3 flex items-center justify-center transition-all ${
                  selectedAlternative === alternative.id 
                    ? 'border-green-500 bg-green-500 scale-110' 
                    : 'border-gray-300'
                }`}>
                  {selectedAlternative === alternative.id && (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlternatives.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No alternatives found matching your search</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <Button
            onClick={handleSendChoice}
            disabled={!selectedAlternative}
            variant="success"
            size="lg"
            className="w-full"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          >
            Confirm Replacement Choice
          </Button>
        </div>
      </div>
    </div>
  );
}