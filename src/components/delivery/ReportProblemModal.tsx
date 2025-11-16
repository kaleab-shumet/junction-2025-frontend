import { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { useOrderStore } from '../../stores/orderStore';
import { useNotificationStore } from '../../stores/notificationStore';

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  orderId: string;
  itemId: string;
}

export default function ReportProblemModal({ 
  isOpen, 
  onClose, 
  itemName, 
  orderId, 
  itemId 
}: ReportProblemModalProps) {
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPendingIssue } = useOrderStore();
  const { addNotification } = useNotificationStore();

  const issueTypes = [
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'expired', label: 'Expired' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async () => {
    if (!issueType) return;
    
    setIsSubmitting(true);
    try {
      // Add to pending issues (don't send to customer yet)
      addPendingIssue(orderId, {
        itemId,
        type: issueType as 'out-of-stock' | 'damaged' | 'expired' | 'other',
        message: message || `${itemName} is ${issueType.replace('-', ' ')}`
      });

      // Show notification that issue was added to pending
      addNotification({
        title: 'Issue Added',
        message: `${issueType.replace('-', ' ')} issue with ${itemName} added to pending issues.`,
        type: 'success'
      });
      
      // Reset form
      setIssueType('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Failed to add pending issue:', error);
      addNotification({
        title: 'Error Adding Issue',
        message: 'Failed to add the issue. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Problem">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Item: {itemName}</h4>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Type
          </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an issue type</option>
            {issueTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide additional details..."
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!issueType || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Issue'}
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}