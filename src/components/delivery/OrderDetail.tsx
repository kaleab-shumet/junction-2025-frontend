import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import Button from "../shared/Button";
import ReportProblemModal from "./ReportProblemModal";
import type { Order } from "../../types";
import { mockOrders } from "../../data/mockData";
import Navbar from "../shared/Navbar";

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    // Placeholder API call
    const fetchOrder = async () => {
      try {
        // await fetch(`/api/orders/${orderId}`);
        const foundOrder = mockOrders.find((o) => o.id === orderId);
        setOrder(foundOrder || null);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      case "replaced":
        return "bg-blue-100 text-blue-800";
      case "removed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReportProblem = (itemId: string, itemName: string) => {
    setSelectedItem({ id: itemId, name: itemName });
    setModalOpen(true);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Order Detail"
          showBack
          onBack={() => navigate("/delivery")}
        />
        <div className="p-4">
          <div className="text-center text-gray-500">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-200">
      <Navbar />

      <Header
        title={`Order #${order.id}`}
        showBack
        onBack={() => navigate("/delivery")}
      />

      <div className="p-4 space-y-4">
        <div className="bg-zinc-100 rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Customer Information
          </h3>
          <p className="text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-500">
            Order placed: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-zinc-100 rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getItemStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
                {item.status === "available" && (
                  <Button
                    onClick={() => handleReportProblem(item.id, item.name)}
                    variant="secondary"
                    size="sm"
                  >
                    Report Problem
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {order.status === "issues" && (
          <div className="bg-zinc-100 rounded-lg shadow-sm border border-gray-200 p-4">
            <Button
              onClick={() => navigate(`/delivery/response/${order.id}`)}
              className="w-full"
            >
              View Customer Response
            </Button>
          </div>
        )}
      </div>

      {selectedItem && (
        <ReportProblemModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedItem(null);
          }}
          itemName={selectedItem.name}
          orderId={order.id}
          itemId={selectedItem.id}
        />
      )}
    </div>
  );
}
