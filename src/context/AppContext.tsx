import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Issue, CustomerResponse } from '../types';
import { mockIssues, mockCustomerResponses } from '../data/mockData';

interface AppState {
  reportedIssues: Issue[];
  customerResponses: CustomerResponse[];
  reportIssue: (issue: Omit<Issue, 'id' | 'createdAt'>) => void;
  submitCustomerResponse: (response: Omit<CustomerResponse, 'timestamp'>) => void;
  getOrderIssues: (orderId: string) => Issue[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [reportedIssues, setReportedIssues] = useState<Issue[]>(mockIssues);
  const [customerResponses, setCustomerResponses] = useState<CustomerResponse[]>(mockCustomerResponses);

  const reportIssue = (issueData: Omit<Issue, 'id' | 'createdAt'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: `issue${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setReportedIssues(prev => [...prev, newIssue]);
    
    // Show notification that customer will be notified
    console.log('Issue reported! Customer will be notified:', newIssue);
  };

  const submitCustomerResponse = (responseData: Omit<CustomerResponse, 'timestamp'>) => {
    const newResponse: CustomerResponse = {
      ...responseData,
      timestamp: new Date().toISOString(),
    };
    
    setCustomerResponses(prev => [...prev, newResponse]);
    
    // Show notification that delivery team will be notified
    console.log('Customer response submitted! Delivery team notified:', newResponse);
  };

  const getOrderIssues = (orderId: string): Issue[] => {
    return reportedIssues.filter(issue => issue.orderId === orderId);
  };

  return (
    <AppContext.Provider value={{
      reportedIssues,
      customerResponses,
      reportIssue,
      submitCustomerResponse,
      getOrderIssues,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}