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
    <section className="relative pt-32 pb-24 px-6 bg-white overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="container mx-auto relative">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
              <PawPrint className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-semibold text-sm">
                Rewards Program
              </span>
            </div>
          </div>

          {/* Hero content */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-slate-900 tracking-tight">
              Paws Program
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Earn Paws for every trade and climb the leaderboard. Get rewarded
              for creating strategies and executing trades.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all"
                >
                  Start Earning Paws
                  <PawPrint className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/app/leaderboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300 px-8 py-6 text-base font-semibold shadow-sm hover:shadow transition-all"
                >
                  View Leaderboard
                  <Trophy className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <PawPrint className="w-7 h-7 text-blue-600" />,
                title: "Earn Paws",
                description: "Get rewarded for every trading action",
              },
              {
                icon: <Trophy className="w-7 h-7 text-blue-600" />,
                title: "Climb Ranks",
                description: "Compete with traders globally",
              },
              {
                icon: <Zap className="w-7 h-7 text-blue-600" />,
                title: "Exclusive Perks",
                description: "Be Eligible for Exclusive Perks",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl p-8 border-2 border-slate-100 hover:border-blue-100 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-5 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
