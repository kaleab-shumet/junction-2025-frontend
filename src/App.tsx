import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import OrderDetail from './components/delivery/OrderDetail';
import CustomerResponseViewer from './components/delivery/CustomerResponseViewer';
import NotificationScreen from './components/customer/NotificationScreen';
import AlternativeSelection from './components/customer/AlternativeSelection';
import ConfirmationScreen from './components/customer/ConfirmationScreen';
import ViewSwitcher from './components/shared/ViewSwitcher';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
          <ViewSwitcher />
          <Routes>
            {/* Delivery Routes */}
            <Route path="/delivery" element={<DeliveryDashboard />} />
            <Route path="/delivery/orders/:orderId" element={<OrderDetail />} />
            <Route path="/delivery/response/:orderId" element={<CustomerResponseViewer />} />
            
            {/* Customer Routes */}
            <Route path="/customer/notifications/:orderId" element={<NotificationScreen />} />
            <Route path="/customer/alternatives/:orderId/:itemId" element={<AlternativeSelection />} />
            <Route path="/customer/confirmation/:orderId" element={<ConfirmationScreen />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/delivery" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;