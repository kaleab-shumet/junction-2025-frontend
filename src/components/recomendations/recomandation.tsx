import React, { useState } from "react";
import SpotlightCard from "../shared/SpotlightCard";
import HeaderCard from "../shared/HeaderCard";

interface Recommendation {
  original_product_id: number;
  recommended_ids: number[];
  reason: string;
  replacement_message: string;
}

interface Item {
  id: number;
  name: string;
  quantity: number;
  status: "available" | "unavailable";
  price: number;
}

const fake_order: { order_id: number; customer_id: number; items: Item[] } = {
  order_id: 1,
  customer_id: 101,
  items: [
    {
      id: 1,
      name: "Whole Milk",
      quantity: 1,
      status: "unavailable",
      price: 3.5,
    },
    {
      id: 2,
      name: "Eggs 12-pack",
      quantity: 1,
      status: "unavailable",
      price: 2.9,
    },
    {
      id: 3,
      name: "Low-Fat Milk",
      quantity: 1,
      status: "available",
      price: 3.0,
    },
  ],
};

const presetData: { recommendations: Recommendation[] } = {
  recommendations: [
    {
      original_product_id: 1,
      recommended_ids: [3, 4],
      reason:
        "Low-Fat Milk (ID 3) is a direct dairy substitute for whole milk, making it suitable for most traditional Italian recipes. Oat Milk (ID 4) offers a high-quality, creamy plant-based alternative to cater to customers with dietary restrictions (lactose intolerance, vegan preferences), which is valuable for a modern restaurant kitchen.",
      replacement_message:
        "Whole Milk is unavailable. We recommend Low-Fat Milk and Oat Milk as suitable replacements.",
    },
    {
      original_product_id: 2,
      recommended_ids: [6],
      reason:
        "Free-range Eggs 12-pack is the only available replacement in the 'Eggs' category. It offers the same pack size (12-pack), ensuring consistent portioning for a professional kitchen, and provides a quality upgrade which is generally acceptable.",
      replacement_message:
        "Eggs 12-pack (ID 2) is out of stock. We are replacing it with Free-range Eggs 12-pack (ID 6).",
    },
  ],
};

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://junction2025.onrender.com/recommendations/demo"
      );
      if (!response.ok) throw new Error("Network response not ok");
      const data = await response.json();
      setRecommendations(data.recommendations || presetData.recommendations);
    } catch (error) {
      console.error("Failed to fetch, using preset data:", error);
      setRecommendations(presetData.recommendations);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-fit py-[10dvh] p-res-tb text-zinc-200 flex flex-col items-center gap-6 md:gap-24">
      <HeaderCard
        title="Recommendations"
        baseColor="#060010"
        hoverColor="#fff"
        baseTextColor="#fff"
        hoverTextColor="#060010"
      />

      {/* Order Items */}
      <div className="flex flex-col md:flex-row gap-4">
        {fake_order.items.map((item) => (
          <SpotlightCard
            key={item.id}
            className="custom-spotlight-card w-4/5 md:w-1/3 p-res-tb"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div className="flex flex-col gap-2">
              <h2 className="card-heading-v2">{item.name}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Status: {item.status}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={handleGetRecommendations}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {loading ? "Loading..." : "Get Recommendations"}
      </button>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4 mt-6 w-full justify-center">
          {recommendations.map((rec) => (
            <SpotlightCard
              key={rec.original_product_id}
              className="custom-spotlight-card w-4/5 md:w-1/3 p-res-tb"
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <div className="flex flex-col gap-2">
                <h2 className="card-heading-v2">
                  Product ID: {rec.original_product_id}
                </h2>
                <p>{rec.replacement_message}</p>
                <p>
                  <strong>Recommended IDs:</strong>{" "}
                  {rec.recommended_ids.join(", ")}
                </p>
                <p>
                  <strong>Reason:</strong> {rec.reason}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
