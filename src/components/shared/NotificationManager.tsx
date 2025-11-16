import { useNotificationStore, type Notification } from '../../stores/notificationStore';

function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotificationStore();

  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`${getNotificationStyles(notification.type)} rounded-2xl shadow-xl border border-white/20 p-4 mb-3 transform transition-all duration-300 hover:scale-105`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{notification.title}</h4>
          <p className="text-white/90 text-sm mt-1">{notification.message}</p>
        </div>
        <button
          onClick={() => removeNotification(notification.id)}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function NotificationManager() {
  const { notifications } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}