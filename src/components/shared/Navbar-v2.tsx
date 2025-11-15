import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full h-fit bg-zinc-950 backdrop-blur-2xl text-stone-300 p-res select-none">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-6">
          {/* Logo container */}
          <div className="p-res-lr relative w-28 h-16">
            <img
              src="/vailo-logo.svg"
              alt="logo"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          <div className=" flex md:gap-6 bg-zinc-300 text-black rounded-full">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `navlinks p-res-tb-small p-res-lr-small ${
                  isActive &&
                  "bg-zinc-800 text-zinc-300 border-2 border-zinc-400 rounded-full"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/delivery"
              className={({ isActive }) =>
                `navlinks p-res-tb-small p-res-lr-small ${
                  isActive &&
                  "bg-zinc-800 text-zinc-300 border-2 border-zinc-400 rounded-full"
                }`
              }
            >
              Drivers
            </NavLink>
          </div>
        </div>

        <div>
          <NavLink
            to="/delivery"
            className="navlinks p-res-tb-small p-res-lr text-stone-400 bg-stone-800 rounded-md border-2 border-stone-400"
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
