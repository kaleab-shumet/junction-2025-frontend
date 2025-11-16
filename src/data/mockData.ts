import type { Order, Alternative, Issue, CustomerResponse } from '../types';

export const mockOrders: Order[] = [
  {
    id: 'order_001',
    customerId: 'user_kaleab',
    customerName: 'Kaleab Kebede',
    status: 'issues',
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      { id: 'item1', name: 'Organic Milk 1L', quantity: 2, status: 'available', originalPrice: 3.50 },
      { id: 'item2', name: 'Whole Grain Bread', quantity: 1, status: 'unavailable', originalPrice: 2.80 },
      { id: 'item3', name: 'Fresh Apples 1kg', quantity: 1, status: 'available', originalPrice: 4.20 }
    ]
  },
  {
    id: 'order_002',
    customerId: 'user_kaleab',
    customerName: 'Kaleab Kebede',
    status: 'completed',
    createdAt: '2024-01-14T09:15:00Z',
    items: [
      { id: 'item8', name: 'Bananas 1kg', quantity: 2, status: 'available', originalPrice: 2.50 },
      { id: 'item9', name: 'Orange Juice 1L', quantity: 1, status: 'available', originalPrice: 4.80 }
    ]
  },
  {
    id: 'order_003',
    customerId: 'user_kaleab',
    customerName: 'Kaleab Kebede',
    status: 'pending',
    createdAt: '2024-01-15T11:15:00Z',
    items: [
      { id: 'item4', name: 'Greek Yogurt 500g', quantity: 3, status: 'available', originalPrice: 5.60 },
      { id: 'item5', name: 'Olive Oil 750ml', quantity: 1, status: 'available', originalPrice: 8.90 }
    ]
  },
  {
    id: 'order_004',
    customerId: 'user_fahim',
    customerName: 'Fahim orko',
    status: 'pending',
    createdAt: '2024-01-16T08:30:00Z',
    items: [
      { id: 'item10', name: 'Pasta 500g', quantity: 2, status: 'available', originalPrice: 3.20 },
      { id: 'item11', name: 'Tomato Sauce 400g', quantity: 3, status: 'available', originalPrice: 2.10 }
    ]
  },
  {
    id: 'order_005',
    customerId: 'user_fahim',
    customerName: 'Fahim orko',
    status: 'pending',
    createdAt: '2024-01-15T12:00:00Z',
    items: [
      { id: 'item6', name: 'Chicken Breast 1kg', quantity: 1, status: 'unavailable', originalPrice: 12.50 },
      { id: 'item7', name: 'Brown Rice 2kg', quantity: 1, status: 'available', originalPrice: 6.30 }
    ]
  },
  {
    id: 'order_006',
    customerId: 'user_fahim',
    customerName: 'Fahim orko',
    status: 'issues',
    createdAt: '2024-01-14T16:20:00Z',
    items: [
      { id: 'item12', name: 'Salmon Fillet 500g', quantity: 1, status: 'unavailable', originalPrice: 15.90 },
      { id: 'item13', name: 'Broccoli 1kg', quantity: 1, status: 'available', originalPrice: 3.80 }
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
    orderId: 'order_001',
    itemId: 'item2',
    type: 'out-of-stock',
    message: 'Whole Grain Bread is currently out of stock',
    createdAt: '2024-01-15T10:45:00Z'
  },
  {
    id: 'issue2',
    orderId: 'order_005',
    itemId: 'item6',
    type: 'damaged',
    message: 'Chicken Breast package was damaged during transport',
    createdAt: '2024-01-15T12:15:00Z'
  },
  {
    id: 'issue3',
    orderId: 'order_006',
    itemId: 'item12',
    type: 'expired',
    message: 'Salmon Fillet has passed its expiry date',
    createdAt: '2024-01-14T16:30:00Z'
  }
];

export const mockCustomerResponses: CustomerResponse[] = [
  {
    orderId: 'order_001',
    itemId: 'item2',
    action: 'replace',
    replacementId: 'alt2',
    timestamp: '2024-01-15T11:30:00Z'
  }
];

// get /orders -> to get all the ordders
// get /orders/:id -> to get specific order details

// put /orders/:id/:itemid -> to update order item data - not used

// post /orders/:id/:itemid/issue -> to create order item issue

// put /orders/:id/:itemid/issue -> to update order item issue


// get /service/:itemid/  -> to get alternatives for a specific item in an order from gemini api
