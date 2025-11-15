import React from "react";
import SpotlightCard from "../shared/SpotlightCard";
import HeaderCard from "../shared/HeaderCard";

const Services = () => {
  return (
    <div className="w-full min-h-fit py-[10dvh] md:h-[8dvh] p-res-tb bg-zinc-400 text-zinc-800 flex items-center justify-center flex-col gap-6 md:gap-24">
      <div className="flex flex-col items-center justify-center gap-4 md:gap-8">
        <HeaderCard
          title="Our Services"
          baseColor="#060010"
          hoverColor="#fff"
          baseTextColor="#fff"
          hoverTextColor="#060010"
        />

        <h2 className="project-body-text p-res-lr p-res-tb text-center w-3/4 font-medium">
          We streamline communication between drivers and customers, ensuring
          every order moves with clarity. No delays. No uncertainty. Just
          direct, real-time updates that keep both sides in sync.
        </h2>
      </div>

      <div className="flex items-center justify-center gap-4 md:gap-6 flex-col md:flex-row">
        <SpotlightCard
          className="custom-spotlight-card w-4/5 md:w-2/5 p-res-tb"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="card-heading-v2 text-zinc-400">
              📍 Real Time Driver Pings
            </h1>
            <p className="body-text text-zinc-400">
              Drivers can instantly notify customers at each critical stage of
              their order. Whether it’s pickup, arrival, or a delivery update,
              the driver’s message reaches the customer without delay—keeping
              the entire process transparent and predictable.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard
          className="custom-spotlight-card w-4/5 md:w-2/5 p-res-tb"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="card-heading-v2 text-zinc-400">
              📖 Customer Quick-Select Replies
            </h1>
            <p className="body-text text-zinc-400">
              Customers choose from clear, pre-defined responses tailored to the
              driver’s update. No typing. No confusion. One tap sends the needed
              information back to the driver, ensuring both sides stay aligned
              throughout the delivery.
            </p>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Services;
