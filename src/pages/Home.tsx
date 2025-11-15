import React from "react";
import Navbar from "../components/shared/Navbar";
import Hero from "../components/Home/Hero";
import Services from "../components/Home/Services";

const Home = () => {
  return (
    <main className="min-h-screen w-full">
      <div className="relative bg-zinc-300">
        <Navbar />;
        <Hero />
        <Services />
      </div>
    </main>
  );
};

export default Home;
