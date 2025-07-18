/** @format */

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
          Paws Program
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Earn rewards while trading, unlock fee discounts
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trade strategies, earn Paws, and climb the leaderboard to unlock lower fees
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
