import type { Order, Alternative, Issue, CustomerResponse } from '../types';

export const mockOrders: Order[] = [
  {
    id: 'order_001',
    customerId: 'user_kaleab',
    customerName: 'Kaleab Kebede',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      { id: 'item1', name: 'Organic Almond Milk 1L', quantity: 2, status: 'available', originalPrice: 4.50 },
      { id: 'item2', name: 'Wholegrain Sourdough Bread', quantity: 1, status: 'available', originalPrice: 3.80 },
      { id: 'item3', name: 'Free-range Eggs 12-pack', quantity: 1, status: 'available', originalPrice: 5.20 },
      { id: 'item4', name: 'Greek Yogurt 500g', quantity: 2, status: 'available', originalPrice: 6.90 }
    ]
  },
  {
    id: 'order_002',
    customerId: 'user_fahim',
    customerName: 'Fahim orko',
    status: 'pending',
    createdAt: '2024-01-16T08:30:00Z',
    items: [
      { id: 'item5', name: 'Pasta Fusilli 500g', quantity: 3, status: 'available', originalPrice: 2.95 },
      { id: 'item6', name: 'Marinara Sauce 400g', quantity: 2, status: 'available', originalPrice: 3.40 },
      { id: 'item7', name: 'Parmesan Cheese 200g', quantity: 1, status: 'available', originalPrice: 7.80 }
    ]
  },
  {
    id: 'order_003',
    customerId: 'user_sarah',
    customerName: 'Sarah Martinez',
    status: 'pending',
    createdAt: '2024-01-17T09:15:00Z',
    items: [
      { id: 'item8', name: 'Chicken Breast 1kg', quantity: 1, status: 'available', originalPrice: 12.50 },
      { id: 'item9', name: 'Brown Rice 2kg', quantity: 1, status: 'available', originalPrice: 6.30 },
      { id: 'item10', name: 'Fresh Broccoli 500g', quantity: 2, status: 'available', originalPrice: 3.20 },
      { id: 'item11', name: 'Olive Oil 750ml', quantity: 1, status: 'available', originalPrice: 8.90 }
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

export const mockIssues: Issue[] = [];

export const mockCustomerResponses: CustomerResponse[] = [];

// get /orders -> to get all the ordders
// get /orders/:id -> to get specific order details

// put /orders/:id/:itemid -> to update order item data - not used

// post /orders/:id/:itemid/issue -> to create order item issue

// put /orders/:id/:itemid/issue -> to update order item issue


// get /service/:itemid/  -> to get alternatives for a specific item in an order from gemini api
