/** @format */

"use client";

import React, { useEffect } from "react";
import { Rocket, FileText, Zap } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Trade",
    description: "Create and manage trading strategies",
  },
  {
    number: "2",
    title: "Earn",
    description: "Complete actions to earn Paws",
  },
  {
    number: "3",
    title: "Track",
    description: "Monitor your progress on the leaderboard",
  },
  {
    number: "4",
    title: "Compete",
    description: "Climb the ranks and earn recognition",
  },
];

const earnMethods = [
  {
    icon: <Rocket className="w-6 h-6 text-slate-700" />,
    title: "First Onchain Strategy",
    points: "+50 Paws",
    description:
      "Launch your first live onchain trading strategy and start earning rewards",
  },
  {
    icon: <FileText className="w-6 h-6 text-slate-700" />,
    title: "First Paper Trade",
    points: "+50 Paws",
    description:
      "Create your first paper trade strategy to practice without risk",
  },
  {
    icon: <Zap className="w-6 h-6 text-slate-700" />,
    title: "Each Transaction",
    points: "+5 Paws",
    description: "Earn Paws for every completed onchain transaction",
  },
];

const HowItWorksSection = () => {
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
    <section className="py-24 px-6 bg-white">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* How to Earn Paws */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-5 text-slate-900">
              How to Earn Paws
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-xl">
              Multiple ways to earn Paws and boost your score
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {earnMethods.map((method, index) => (
              <div
                key={index}
                className="group bg-slate-50 p-10 rounded-2xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-white group-hover:bg-blue-50 border-2 border-slate-100 group-hover:border-blue-100 flex items-center justify-center mb-6 transition-all">
                  {method.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {method.title}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-5">
                  {method.points}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
