/** @format */
"use client";

import React, { useEffect } from "react";
import { BadgeDollarSign, Trophy, Zap } from "lucide-react";

const benefits = [
  {
    icon: <BadgeDollarSign className="w-6 h-6 text-blue-600" />,
    title: "Lower Fees",
    description: "Higher Paws score means lower platform fees. Start at 1% discount and unlock up to 10% fee reduction as you climb the ranks.",
  },
  {
    icon: <Trophy className="w-6 h-6 text-blue-600" />,
    title: "Leaderboard Ranking",
    description: "Compete with other traders on the global leaderboard. Show off your trading skills and earn recognition in the community.",
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    title: "Future Rewards",
    description: "Early access to new features, exclusive trading strategies, and special perks reserved for top Paws holders.",
  },
];

const WhyEarnSection = () => {
  useEffect(() => {
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

    if (typeof document !== "undefined") {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Earn <span className="text-gradient">Paws?</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Every trading action earns you Paws. The more Paws you have, 
              the better rewards and benefits you unlock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="animate-on-scroll hover-lift"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
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

export default WhyEarnSection;
