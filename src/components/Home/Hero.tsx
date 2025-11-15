import React from "react";
import LinkPillButton from "../shared/LinkPillButton";

const Hero = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center z-20 flex-col">
      <h1 className="heading p-res-lr p-res-tb text-center">
        Real-Time Order Updates No More Last-Minute Surprises
      </h1>
      <h2 className="project-body-text p-res-lr p-res-tb text-center w-3/4">
        Stay connected from purchase to delivery. Vailo Amio’s notification
        system bridges the gap between drivers and customers ensuring everyone
        knows what’s happening, exactly when it happens.
      </h2>
      <div className="flex gap-2 md:gap-6 text-center items-center">
        <h4 className="body-text-v2 text-center text-bold  w-fit rounded-full font-semibold text-zinc-500">
          Simple
        </h4>
        <h4 className="body-text-v2 text-center text-bold  w-fit rounded-full font-semibold text-zinc-500 ">
          Direct
        </h4>
        <h4 className="body-text-v2 text-center text-bold  w-fit rounded-full font-semibold text-zinc-500 ">
          Transparent
        </h4>
      </div>

      <div className="p-res-lr p-res-tb">
        <LinkPillButton label="Get Started" href="/delivery" />
      </div>
    </div>
  );
};

export default Hero;
