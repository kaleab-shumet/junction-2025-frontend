import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import OrderDetail from './components/delivery/OrderDetail';
import CustomerDashboard from './components/customer/CustomerDashboard';
import CustomerOrderDetail from './components/customer/CustomerOrderDetail';
import NotificationScreen from './components/customer/NotificationScreen';
import AlternativeSelection from './components/customer/AlternativeSelection';
import ConfirmationScreen from './components/customer/ConfirmationScreen';
import LoginForm from './components/auth/LoginForm';
import ViewSwitcher from './components/shared/ViewSwitcher';
import NotificationManager from './components/shared/NotificationManager';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <NotificationManager />
        <ViewSwitcher />
        <Routes>
          {/* Delivery Routes (No Authentication Required) */}
          <Route path="/delivery" element={<DeliveryDashboard />} />
          <Route path="/delivery/orders/:orderId" element={<OrderDetail />} />
          
          {/* Customer Routes (Authentication Required) */}
          <Route 
            path="/customer" 
            element={
              isAuthenticated ? <CustomerDashboard /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/customer/order-details/:orderId" 
            element={
              isAuthenticated ? <CustomerOrderDetail /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/customer/notifications/:orderId" 
            element={
              isAuthenticated ? <NotificationScreen /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/customer/alternatives/:orderId/:itemId" 
            element={
              isAuthenticated ? <AlternativeSelection /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/customer/confirmation/:orderId" 
            element={
              isAuthenticated ? <ConfirmationScreen /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Authentication */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <LoginForm onSuccess={() => window.location.href = '/customer'} />
              ) : (
                <Navigate to="/customer" replace />
              )
            } 
          />
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/delivery" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;