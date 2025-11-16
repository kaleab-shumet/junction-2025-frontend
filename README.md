# Junction 2025 - Order Management System

A comprehensive React-based order management system designed for delivery staff and customers to handle order issues, replacements, and cancellations seamlessly.

## 🎯 Challenge & Solution

### The Challenge
**Problem**: When delivery staff encounter issues with order items (out-of-stock, damaged, expired), there's no efficient way to:
- Communicate problems to customers in real-time
- Let customers choose replacements or remove items
- Coordinate between delivery staff and customers
- Maintain order accuracy and customer satisfaction

**Pain Points**:
- Manual phone calls create delays and miscommunication
- No centralized system for tracking order issues
- Customers have no self-service options for order modifications
- Delivery staff waste time on back-and-forth communication

### Our Solution
**Integrated Dual-Interface System** with AI-powered customer communication:

1. **Delivery Interface**: Staff report issues instantly through batch collection system
2. **AI Agent Integration**: Automated SMS and phone notifications to customers
3. **Customer Interface**: Self-service portal for choosing replacements or cancellations
4. **Real-time Synchronization**: Changes immediately visible across both interfaces

**Key Benefits**:
- ⚡ **Instant Communication**: AI agent contacts customers within seconds
- 🔄 **Self-Service Resolution**: Customers manage their own order modifications
- 📱 **Dual Notifications**: Both SMS and voice calls ensure customer awareness
- 🎯 **Batch Efficiency**: Multiple issues collected before customer notification
- 💰 **Accurate Pricing**: Dynamic totals with replacement item pricing
- 🔐 **Secure Access**: Role-based permissions for delivery vs customer functions

**Result**: Streamlined order management with reduced delivery time, improved customer satisfaction, and eliminated communication bottlenecks.

## 🚀 Overview

This application provides a dual-interface system:
- **Delivery Interface**: Public access for delivery staff to report order issues
- **Customer Interface**: Authenticated access for customers to manage their orders and resolve issues

## 📋 Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [User Flows](#user-flows)
4. [Technical Implementation](#technical-implementation)
5. [API Integration](#api-integration)
6. [Setup & Installation](#setup--installation)
7. [Usage Guide](#usage-guide)
8. [File Structure](#file-structure)
9. [State Management](#state-management)
10. [Authentication](#authentication)

## ✨ Features

### Delivery Interface (No Authentication Required)
- View all orders across all customers
- Report issues with specific order items (out-of-stock, damaged, expired, other)
- Batch issue reporting system
- AI agent integration for customer notification
- Real-time order status management
- Prevent order completion when issues exist

### Customer Interface (Authentication Required)
- Secure login with predefined user accounts
- View personal orders only
- Receive notifications about order issues
- Choose replacements for unavailable items
- Remove items from orders
- Cancel orders (when pending or have issues)
- Real-time order updates

### AI Agent Integration
- Automated customer notification via SMS and phone calls
- POST API integration with external webhook service
- Professional modal confirmation system
- Real customer data transmission

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS with gradient themes and glass morphism
- **Routing**: React Router v6 with protected routes
- **State Management**: Zustand with persistence
- **Build Tool**: Vite
- **Type Safety**: TypeScript throughout

### Design Patterns
- **Component Composition**: Reusable UI components
- **Custom Hooks**: Centralized state management
- **Protected Routes**: Role-based access control
- **Modal System**: Consistent user interactions
- **Notification System**: Professional toast notifications

## 🔄 Delivery vs Customer Mode

### Key Differences

| Aspect | Delivery Mode | Customer Mode |
|--------|---------------|---------------|
| **Authentication** | ❌ No login required | ✅ Secure login required |
| **Access Level** | 🌐 All orders (system-wide) | 🔒 Personal orders only |
| **Primary Actions** | Report issues, Complete orders | Resolve issues, Cancel orders |
| **Order Visibility** | All customers' orders | Own orders filtered by user ID |
| **Issue Management** | Create and send issues | Receive and resolve issues |
| **Status Control** | Mark orders completed/pending | Cannot change delivery status |
| **Item Actions** | Report problems with items | Choose replacements/remove items |
| **AI Integration** | Trigger AI notifications | Receive AI-generated notifications |
| **Navigation** | Public access routes | Protected routes with auth guard |
| **Data Scope** | Cross-customer operations | Single-customer operations |

### Delivery Mode Features
- **Public Access**: No authentication barrier for delivery staff
- **Order Management**: View and manage all orders across all customers
- **Issue Reporting**: Report problems with specific order items (out-of-stock, damaged, expired, other)
- **Batch Operations**: Collect multiple issues before notifying customer
- **AI Agent Control**: Initiate customer notifications via AI webhook
- **Status Management**: Complete orders when all issues resolved
- **Real-time Updates**: See customer responses immediately

### Customer Mode Features
- **Secure Access**: Authentication required with persistent sessions
- **Personal Dashboard**: View only orders belonging to logged-in customer
- **Issue Resolution**: Respond to delivery-reported issues
- **Item Management**: Choose replacements or remove problematic items
- **Order Control**: Cancel orders when needed
- **Price Visibility**: See updated totals with replacement pricing
- **Real-time Sync**: Changes immediately visible in delivery mode

### Interface Switching
- **Toggle Button**: Bottom-right ViewSwitcher for easy mode switching
- **Route Protection**: Customer routes redirect to login if not authenticated
- **State Persistence**: Customer sessions maintained across browser refreshes
- **Seamless UX**: No data loss when switching between modes

### Workflow Integration
```
Delivery Reports Issue → AI Notification → Customer Receives Alert → Customer Chooses Resolution → Delivery Sees Updates → Order Continues
```

The two modes work together in a synchronized workflow where delivery staff identify problems and customers provide solutions, all coordinated through the AI agent system.

## 🔄 User Flows

### Complete Delivery Flow
```
1. Delivery Staff Access
   ↓
2. View Orders Dashboard
   ↓
3. Select Order → Order Details
   ↓
4. Report Issues (Batch Collection)
   ├── Out of Stock
   ├── Damaged
   ├── Expired
   └── Other (with custom message)
   ↓
5. Send Issues to Customer
   ↓
6. AI Agent Confirmation Modal
   ├── Customer Details Display
   ├── Issue Count & Details
   └── API POST to Webhook
   ↓
7. Customer Receives AI Notification
   ↓
8. Order Status Updates to 'issues'
```

### Complete Customer Flow
```
1. Customer Login
   ├── Email: kaleabshumet@gmail.com / fahimorko4122@gmail.com / sarah.martinez@email.com
   ├── Password: admin123
   └── Phone: +358403640854 / +358415714761 / +358501234567
   ↓
2. Customer Dashboard
   ├── Personal Orders Only
   ├── Order Status Indicators
   └── Issue Notifications
   ↓
3. Issue Resolution
   ├── View Affected Items
   ├── Choose Replacements
   ├── Remove Items
   └── Cancel Order
   ↓
4. Confirmation & Updates
   ├── Real-time Status Updates
   ├── Price Recalculations
   └── Delivery Notification
```

## 💻 Technical Implementation

### Key Components

#### State Management (Zustand Stores)
```typescript
// Order Store - Central order management
- orders: Order[]
- addPendingIssue: (orderId, issue) => void
- submitPendingIssues: (orderId) => void
- markOrderAsCompleted: (orderId) => void
- replaceItem: (orderId, itemId, replacementId) => void

// Auth Store - User authentication with persistence
- user: User | null
- isAuthenticated: boolean
- login: (email, password) => Promise<boolean>
- logout: () => void

// Notification Store - Toast notification system
- notifications: Notification[]
- addNotification: (notification) => void
- removeNotification: (id) => void
```

#### Core Data Types
```typescript
interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'issues' | 'completed' | 'cancelled';
  createdAt: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  originalPrice: number;
  status: 'available' | 'unavailable' | 'replaced' | 'removed';
  replacementId?: string;
}

interface PendingIssue {
  itemId: string;
  type: 'out-of-stock' | 'damaged' | 'expired' | 'other';
  message?: string;
}
```

## 🔗 API Integration

### AI Agent Webhook Integration
When delivery staff confirms sending issues to customer:

**Endpoint**: `https://eodme8glxa1xlk8.m.pipedream.net`
**Method**: POST
**Content-Type**: application/json

**Payload Structure**:
```json
{
  "name": "Kaleab Kebede",
  "phone_number": "+358403640854",
  "missed_items_and_reasons": "Organic Almond Milk 1L: out of stock; Wholegrain Sourdough Bread: damaged; Free-range Eggs 12-pack: expired - package damaged during transport",
  "update_items_url": "http://localhost:5173/login"
}
```

**Process**:
1. Collect pending issues for the order
2. Format items and reasons as semicolon-separated string
3. Extract customer name and phone from order data
4. Generate dynamic update URL based on current host
5. Send POST request to webhook
6. Handle success/failure with user notifications
7. Update order status to 'issues' on success

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with ES2020+ support

### Installation Steps
```bash
# Clone the repository
git clone <repository-url>
cd junction-2025

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck
```

### Environment Setup
- Development: `http://localhost:5173`
- Production: Update webhook URLs accordingly

## 📖 Usage Guide

### For Delivery Staff

1. **Access Application**
   - Navigate to `http://localhost:5173`
   - Automatically redirects to delivery dashboard
   - No authentication required

2. **Report Issues**
   - Click on any order from the dashboard
   - Use "Report Problem" button for specific items
   - Fill out issue type and optional message
   - Issues are collected in pending state

3. **Send to Customer**
   - Click "Send to Customer" button when ready
   - Confirm in AI agent modal
   - System automatically notifies customer

4. **Complete Orders**
   - Only possible when no pending/active issues exist
   - Click "Mark as Completed" button
   - Order status updates across all views

### For Customers

1. **Login**
   - Navigate to `/customer` or click customer view toggle
   - Use predefined credentials:
     - **Kaleab Kebede**: kaleabshumet@gmail.com / admin123
     - **Fahim Orko**: fahimorko4122@gmail.com / admin123
     - **Sarah Martinez**: sarah.martinez@email.com / admin123

2. **Manage Orders**
   - View personal orders with real-time status
   - Click "Resolve Issues" for orders with problems
   - Choose replacements or remove items
   - Cancel orders when needed

3. **Issue Resolution**
   - Review highlighted problematic items
   - Select replacements from available alternatives
   - Confirm changes to update order
   - Changes reflect immediately in delivery view

## 📁 File Structure

```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx              # Customer authentication
│   ├── customer/
│   │   ├── AlternativeSelection.tsx   # Item replacement interface
│   │   ├── ConfirmationScreen.tsx     # Order update confirmation
│   │   ├── CustomerDashboard.tsx      # Personal orders overview
│   │   ├── CustomerOrderDetail.tsx    # Detailed order view
│   │   └── NotificationScreen.tsx     # Issue notification & resolution
│   ├── delivery/
│   │   ├── DeliveryDashboard.tsx      # All orders overview
│   │   ├── OrderDetail.tsx            # Order management & issue reporting
│   │   └── ReportProblemModal.tsx     # Issue reporting interface
│   └── shared/
│       ├── AINotificationModal.tsx    # AI agent confirmation
│       ├── Button.tsx                 # Reusable button component
│       ├── Header.tsx                 # Page headers
│       ├── Modal.tsx                  # Base modal component
│       ├── NotificationManager.tsx    # Toast notifications
│       └── ViewSwitcher.tsx           # Interface toggle
├── stores/
│   ├── authStore.ts                   # User authentication state
│   ├── notificationStore.ts           # Notification management
│   └── orderStore.ts                  # Central order management
├── data/
│   └── mockData.ts                    # Sample data & alternatives
├── types/
│   └── index.ts                       # TypeScript definitions
├── App.tsx                            # Main application & routing
└── main.tsx                           # Application entry point
```

## 🗄️ State Management

### Zustand Implementation
- **Persistence**: Auth state persists across sessions
- **Real-time Updates**: Changes sync across delivery/customer views
- **Type Safety**: Full TypeScript integration
- **Performance**: Minimal re-renders with targeted subscriptions

### Key State Patterns
- **Pending Issues**: Batch collection before submission
- **Order Status**: Automatic updates based on issue state
- **User Sessions**: Secure authentication with logout handling
- **Price Calculations**: Dynamic totals with replacement pricing

## 🔐 Authentication

### User System
- **No Backend**: Local authentication with predefined users
- **Secure Storage**: Zustand persistence with localStorage
- **Session Management**: Automatic logout and route protection
- **Role-Based Access**: Delivery (public) vs Customer (authenticated)

### Predefined Users
```typescript
const mockUsers = [
  {
    id: 'user_kaleab',
    name: 'Kaleab Kebede',
    email: 'kaleabshumet@gmail.com',
    phone: '+358403640854',
    password: 'admin123'
  },
  {
    id: 'user_fahim',
    name: 'Fahim orko',
    email: 'fahimorko4122@gmail.com',
    phone: '+358415714761',
    password: 'admin123'
  },
  {
    id: 'user_sarah',
    name: 'Sarah Martinez',
    email: 'sarah.martinez@email.com',
    phone: '+358501234567',
    password: 'admin123'
  }
];
```

## 🔧 Key Features Implementation

### Batch Issue Reporting
- Issues collected in pending state until "Send to Customer"
- Prevents spam notifications for multiple issues
- Clear visual indication of pending vs active issues
- Ability to remove issues before sending

### AI Agent Integration
- Professional modal with customer details
- Real-time API integration with error handling
- Dynamic URL generation for update links
- Formatted issue descriptions for AI processing

### Real-time State Sync
- Changes in customer view immediately reflect in delivery view
- Order status updates automatically across interfaces
- Price calculations update with replacements
- Issue resolution updates order status from 'issues' to 'pending'

### Professional UI/UX
- Glass morphism design with gradients
- Consistent notification system (no alerts)
- Responsive design for mobile/desktop
- Loading states and error handling
- Intuitive navigation and status indicators

## 🚨 Error Handling

### API Failures
- Network error notifications for webhook failures
- Graceful degradation when AI service unavailable
- Retry mechanisms for failed requests

### Validation
- Form validation with user feedback
- Prevention of invalid state transitions
- Type safety throughout application

### User Experience
- Loading states for async operations
- Clear error messages with actionable guidance
- Automatic logout on authentication errors

## 📊 Order Status Flow

```
pending → (issues reported) → issues → (customer resolves) → pending → (delivery completes) → completed
   ↓                                       ↓
cancelled ←────────────────────────────── cancelled
```

### Status Descriptions
- **pending**: Normal order, ready for delivery
- **issues**: Has unresolved problems requiring customer input
- **completed**: Successfully delivered with all issues resolved
- **cancelled**: Order cancelled by customer or system

## 🔮 Future Enhancements

### Potential Improvements
- Real backend integration with user management
- Push notifications for real-time updates
- Order history and analytics
- Advanced replacement algorithms
- Multi-language support
- Mobile app versions
- Integration with inventory systems

### Scalability Considerations
- Database integration for persistent storage
- User registration and profile management
- Order tracking with delivery updates
- Payment integration for price differences
- Admin dashboard for system management

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Ensure all TypeScript types are properly imported
2. **State Not Persisting**: Check localStorage permissions and quota
3. **API Failures**: Verify webhook endpoint accessibility
4. **Authentication Issues**: Clear localStorage and retry login

### Development Tips
- Use browser DevTools to inspect Zustand state
- Check Network tab for API request details
- Monitor console for TypeScript errors
- Test both delivery and customer flows thoroughly

---

## 👥 Contributors

This application was developed for Junction 2025 hackathon, demonstrating modern React patterns, professional UI design, and real-world API integration for order management systems.

For questions or support, please refer to the codebase comments and component documentation.