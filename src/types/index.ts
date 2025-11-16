export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: 'pending' | 'issues' | 'completed' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  status: 'available' | 'unavailable' | 'replaced' | 'removed';
  originalPrice: number;
  replacementId?: string;
}

export interface Issue {
  id: string;
  orderId: string;
  itemId: string;
  type: 'out-of-stock' | 'damaged' | 'expired' | 'other';
  message?: string;
  createdAt: string;
}

export interface Alternative {
  id: string;
  name: string;
  price: number;
  image?: string;
  similarity: number;
}

export interface CustomerResponse {
  orderId: string;
  itemId: string;
  action: 'replace' | 'remove';
  replacementId?: string;
  timestamp: string;
}