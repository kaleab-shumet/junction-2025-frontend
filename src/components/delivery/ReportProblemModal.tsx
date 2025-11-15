import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../shared/Modal";
import Button from "../shared/Button";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../shared/Navbar";

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
  itemId,
}: ReportProblemModalProps) {
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reportIssue } = useAppContext();
  const navigate = useNavigate();

  const issueTypes = [
    { value: "out-of-stock", label: "Out of Stock" },
    { value: "damaged", label: "Damaged" },
    { value: "expired", label: "Expired" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async () => {
    if (!issueType) return;

    setIsSubmitting(true);
    try {
      // Report the issue using context
      reportIssue({
        orderId,
        itemId,
        type: issueType as "out-of-stock" | "damaged" | "expired" | "other",
        message: message || `${itemName} is ${issueType.replace("-", " ")}`,
      });

      // Show success notification
      alert(
        `Issue reported successfully! Customer will be notified about the ${issueType.replace(
          "-",
          " "
        )} ${itemName}.`
      );

      // Reset form
      setIssueType("");
      setMessage("");
      onClose();

      // Optionally show a notification that customer can now see this
      setTimeout(() => {
        if (
          confirm(
            "Would you like to see how the customer will be notified? Click OK to switch to customer view."
          )
        ) {
          navigate(`/customer/notifications/${orderId}`);
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to report issue:", error);
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
          <Button onClick={handleSubmit} disabled={!issueType || isSubmitting}>
            {isSubmitting ? "Sending..." : "Send to Customer"}
          </Button>
          <Button onClick={onClose} variant="secondary" disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
