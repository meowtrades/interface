/** @format */

"use client";

import React, { useEffect } from "react";
import { BadgeDollarSign, Trophy, Zap } from "lucide-react";

const benefits = [
  {
    icon: <Trophy className="w-6 h-6 text-slate-700" />,
    title: "Leaderboard Ranking",
    description: "Compete with other traders on the global leaderboard. Show off your trading skills and earn recognition in the community.",
  },
  {
    icon: <Zap className="w-6 h-6 text-slate-700" />,
    title: "Future Rewards",
    description: "Early access to new features, exclusive trading strategies, and special perks reserved for top Paws holders.",
  },
  {
    icon: <BadgeDollarSign className="w-6 h-6 text-slate-700" />,
    title: "Track Progress",
    description: "Monitor your Paws accumulation and see your trading activity reflected in real-time on your profile.",
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
    <section className="py-24 px-6 bg-slate-50">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-5 text-slate-900">
              Why Earn Paws?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-xl">
              Every trading action earns you Paws. The more you accumulate, the more recognition you gain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-white p-10 rounded-2xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-blue-50 border-2 border-slate-100 group-hover:border-blue-100 flex items-center justify-center mb-6 transition-all">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyEarnSection;
