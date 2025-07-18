/** @format */

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { PawPrint, Trophy, Zap } from "lucide-react";

const HeroSection = () => {
  useEffect(() => {
    // Add intersection observer for scroll animations
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, options);

    // Select all sections to animate
    if (typeof document !== "undefined") {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Subtle geometric background elements */}
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-tr from-orange-50 to-pink-50 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-green-50 to-blue-50 rounded-full opacity-50 blur-2xl"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-on-scroll">
          <div className="inline-flex items-center gap-2 mb-8 py-3 px-6 bg-white rounded-full shadow-lg border border-gray-100">
            <PawPrint className="w-5 h-5 text-orange-500" />
            <span className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
              Rewards Program
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight text-gray-900">
            Paws Program
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-gray-600 mb-8 max-w-3xl mx-auto leading-normal font-medium">
            Earn rewards while trading, unlock fee discounts
          </h2>

          <p className="text-xl text-gray-500 mb-12 max-w-4xl mx-auto leading-relaxed">
            Trade strategies, earn Paws, and climb the leaderboard to unlock lower fees.
            The more you trade, the more you earn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/app/dashboard">
              <Button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover-lift font-semibold transition-all duration-300">
                <span className="flex items-center">
                  Start Earning Paws
                  <PawPrint className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </span>
              </Button>
            </Link>

            <Link href="/app/leaderboard">
              <Button
                variant="outline"
                className="group px-8 py-4 text-lg rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl hover-lift border-2 border-gray-200 hover:border-gray-300 font-semibold transition-all duration-300"
              >
                <span className="flex items-center">
                  View Leaderboard
                  <Trophy className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Feature cards with better spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <PawPrint className="w-7 h-7 text-orange-600" />,
                title: "Earn Paws",
                description: "Get rewarded for every trading action",
                gradient: "from-orange-50 to-red-50"
              },
              {
                icon: <Trophy className="w-7 h-7 text-yellow-600" />,
                title: "Climb Ranks",
                description: "Compete with traders globally",
                gradient: "from-yellow-50 to-orange-50"
              },
              {
                icon: <Zap className="w-7 h-7 text-blue-600" />,
                title: "Save on Fees",
                description: "Up to 10% fee discount available",
                gradient: "from-blue-50 to-purple-50"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl hover-lift transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-sm mx-auto`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
