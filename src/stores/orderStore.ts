import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Order, Issue, CustomerResponse } from '../types';
import { mockOrders, mockIssues, mockCustomerResponses } from '../data/mockData';

interface PendingIssue {
  itemId: string;
  type: 'out-of-stock' | 'damaged' | 'expired' | 'other';
  message?: string;
}

interface OrderState {
  orders: Order[];
  issues: Issue[];
  customerResponses: CustomerResponse[];
  pendingIssues: Record<string, PendingIssue[]>; // orderId -> pending issues
  
  // Order management
  getOrdersByCustomer: (customerId: string) => Order[];
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  markOrderAsCompleted: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  
  // Issue management
  reportIssue: (issue: Omit<Issue, 'id' | 'createdAt'>) => void;
  addPendingIssue: (orderId: string, issue: PendingIssue) => void;
  removePendingIssue: (orderId: string, itemId: string) => void;
  getPendingIssues: (orderId: string) => PendingIssue[];
  submitPendingIssues: (orderId: string) => void;
  getIssuesByOrder: (orderId: string) => Issue[];
  
  // Customer response management
  submitCustomerResponse: (response: Omit<CustomerResponse, 'timestamp'>) => void;
  getResponsesByOrder: (orderId: string) => CustomerResponse[];
  
  // Real-time updates
  getLatestResponse: (orderId: string) => CustomerResponse | null;
}

export const useOrderStore = create<OrderState>()(
  subscribeWithSelector((set, get) => ({
    orders: mockOrders,
    issues: mockIssues,
    customerResponses: mockCustomerResponses,
    pendingIssues: {},
    
    getOrdersByCustomer: (customerId: string) => {
      return get().orders.filter(order => order.customerId === customerId);
    },
    
    updateOrder: (orderId: string, updates: Partial<Order>) => {
      set((state) => ({
        orders: state.orders.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      }));
    },
    
    markOrderAsCompleted: (orderId: string) => {
      get().updateOrder(orderId, { status: 'completed' });
    },
    
    cancelOrder: (orderId: string) => {
      get().updateOrder(orderId, { status: 'cancelled' });
    },
    
    addPendingIssue: (orderId: string, issue: PendingIssue) => {
      set((state) => ({
        pendingIssues: {
          ...state.pendingIssues,
          [orderId]: [...(state.pendingIssues[orderId] || []), issue]
        }
      }));
    },
    
    removePendingIssue: (orderId: string, itemId: string) => {
      set((state) => ({
        pendingIssues: {
          ...state.pendingIssues,
          [orderId]: (state.pendingIssues[orderId] || []).filter(issue => issue.itemId !== itemId)
        }
      }));
    },
    
    getPendingIssues: (orderId: string) => {
      return get().pendingIssues[orderId] || [];
    },
    
    submitPendingIssues: (orderId: string) => {
      const pendingIssues = get().getPendingIssues(orderId);
      
      // Convert pending issues to actual issues
      pendingIssues.forEach(pendingIssue => {
        const newIssue: Issue = {
          id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId,
          itemId: pendingIssue.itemId,
          type: pendingIssue.type,
          message: pendingIssue.message,
          createdAt: new Date().toISOString(),
        };
        
        // Add to issues
        set((state) => ({
          issues: [...state.issues, newIssue]
        }));
        
        // Mark item as unavailable
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  items: order.items.map(item =>
                    item.id === pendingIssue.itemId
                      ? { ...item, status: 'unavailable' }
                      : item
                  )
                }
              : order
          )
        }));
      });
      
      // Update order status to issues if there are any pending issues
      if (pendingIssues.length > 0) {
        get().updateOrder(orderId, { status: 'issues' });
      }
      
      // Clear pending issues
      set((state) => ({
        pendingIssues: {
          ...state.pendingIssues,
          [orderId]: []
        }
      }));
    },
    
    reportIssue: (issueData: Omit<Issue, 'id' | 'createdAt'>) => {
      const newIssue: Issue = {
        ...issueData,
        id: `issue_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      set((state) => ({
        issues: [...state.issues, newIssue]
      }));
      
      // Mark the item as unavailable immediately
      set((state) => ({
        orders: state.orders.map(order =>
          order.id === issueData.orderId
            ? {
                ...order,
                items: order.items.map(item =>
                  item.id === issueData.itemId
                    ? { ...item, status: 'unavailable' }
                    : item
                )
              }
            : order
        )
      }));
      
      // Update order status to indicate issues
      get().updateOrder(issueData.orderId, { status: 'issues' });
    },
    
    getIssuesByOrder: (orderId: string) => {
      return get().issues.filter(issue => issue.orderId === orderId);
    },
    
    submitCustomerResponse: (responseData: Omit<CustomerResponse, 'timestamp'>) => {
      const newResponse: CustomerResponse = {
        ...responseData,
        timestamp: new Date().toISOString(),
      };
      
      set((state) => ({
        customerResponses: [...state.customerResponses, newResponse]
      }));
      
      // Remove the resolved issue
      set((state) => ({
        issues: state.issues.filter(issue => 
          !(issue.orderId === responseData.orderId && issue.itemId === responseData.itemId)
        )
      }));
      
      // Update the item status based on customer response
      set((state) => ({
        orders: state.orders.map(order =>
          order.id === responseData.orderId
            ? {
                ...order,
                items: order.items.map(item =>
                  item.id === responseData.itemId
                    ? {
                        ...item,
                        status: responseData.action === 'replace' ? 'replaced' : 'removed',
                        replacementId: responseData.replacementId
                      }
                    : item
                )
              }
            : order
        )
      }));
      
      // Check if there are any remaining issues for this order
      const remainingIssues = get().getIssuesByOrder(responseData.orderId);
      if (remainingIssues.length === 0) {
        // No more issues, change status back to pending
        get().updateOrder(responseData.orderId, { status: 'pending' });
      }
    },
    
    getResponsesByOrder: (orderId: string) => {
      return get().customerResponses.filter(response => response.orderId === orderId);
    },
    
    getLatestResponse: (orderId: string) => {
      const responses = get().getResponsesByOrder(orderId);
      return responses.length > 0 
        ? responses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
        : null;
    },
  }))
);