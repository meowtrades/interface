/** @format */

import React from "react";

const HeroSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">
          🎉{" "}
          <span className="text-transparent bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text">
            JOIN THE PAWS PROGRAM
          </span>
        </h1>
        <p className="text-xl mb-6 opacity-90">
          Trade, Earn, Save – It's That Simple 🐾
        </p>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Unlock fee discounts just by using the platform. Earn Paws as you
          trade and climb the leaderboard.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
