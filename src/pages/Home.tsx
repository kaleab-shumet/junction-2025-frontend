import React from "react";
import Navbar from "../components/shared/Navbar";
import Hero from "../components/Home/Hero";

const Home = () => {
  return (
    <main className="min-h-screen w-full">
      <div className="relative bg-zinc-300">
        <Navbar />;
        <Hero />
      </div>
    </main>
  );
};

export default Home;
