import type { Order, Alternative, Issue, CustomerResponse } from '../types';

export const mockOrders: Order[] = [
  {
    id: '1001',
    customerName: 'John Smith',
    status: 'issues',
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      { id: 'item1', name: 'Organic Milk 1L', quantity: 2, status: 'available', originalPrice: 3.50 },
      { id: 'item2', name: 'Whole Grain Bread', quantity: 1, status: 'unavailable', originalPrice: 2.80 },
      { id: 'item3', name: 'Fresh Apples 1kg', quantity: 1, status: 'available', originalPrice: 4.20 }
    ]
  },
  {
    id: '1002',
    customerName: 'Sarah Johnson',
    status: 'in-progress',
    createdAt: '2024-01-15T11:15:00Z',
    items: [
      { id: 'item4', name: 'Greek Yogurt 500g', quantity: 3, status: 'available', originalPrice: 5.60 },
      { id: 'item5', name: 'Olive Oil 750ml', quantity: 1, status: 'available', originalPrice: 8.90 }
    ]
  },
  {
    id: '1003',
    customerName: 'Mike Chen',
    status: 'pending',
    createdAt: '2024-01-15T12:00:00Z',
    items: [
      { id: 'item6', name: 'Chicken Breast 1kg', quantity: 1, status: 'unavailable', originalPrice: 12.50 },
      { id: 'item7', name: 'Brown Rice 2kg', quantity: 1, status: 'available', originalPrice: 6.30 }
    ]
  }
];

export const mockAlternatives: Alternative[] = [
  { id: 'alt1', name: 'Sourdough Bread', price: 3.20, similarity: 85 },
  { id: 'alt2', name: 'Multigrain Bread', price: 2.95, similarity: 90 },
  { id: 'alt3', name: 'Rye Bread', price: 3.10, similarity: 75 },
  { id: 'alt4', name: 'White Bread', price: 2.40, similarity: 70 },
  { id: 'alt5', name: 'Gluten-Free Bread', price: 4.50, similarity: 60 }
];

export const mockIssues: Issue[] = [
  {
    id: 'issue1',
    orderId: '1001',
    itemId: 'item2',
    type: 'out-of-stock',
    message: 'Whole Grain Bread is currently out of stock',
    createdAt: '2024-01-15T10:45:00Z'
  },
  {
    id: 'issue2',
    orderId: '1003',
    itemId: 'item6',
    type: 'damaged',
    message: 'Chicken Breast package was damaged during transport',
    createdAt: '2024-01-15T12:15:00Z'
  }
];

export const mockCustomerResponses: CustomerResponse[] = [
  {
    orderId: '1001',
    itemId: 'item2',
    action: 'replace',
    replacementId: 'alt2',
    timestamp: '2024-01-15T11:30:00Z'
  }
];