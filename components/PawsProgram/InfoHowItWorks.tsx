/** @format */

"use client";

import React, { useEffect } from "react";
import { MousePointerClick, TrendingUp, Calendar, Award } from "lucide-react";

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
    title: "Save",
    description: "Unlock lower fees with higher scores",
  },
];

const earnMethods = [
  {
    icon: <MousePointerClick className="w-6 h-6 text-blue-600" />,
    title: "First Strategy",
    points: "+50 Paws",
    description: "Launch your first trading strategy and start earning rewards immediately",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
    title: "Join Trending",
    points: "+20 Paws",
    description: "Create plans in trending strategies with the most active traders",
  },
  {
    icon: <Calendar className="w-6 h-6 text-blue-600" />,
    title: "Stay Active",
    points: "+20 Paws",
    description: "Keep strategies live for 3+ days to earn consistency bonuses",
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
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* How It Works */}
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Start earning in 4 simple steps
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto mb-24">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-full"></div>

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative text-center animate-on-scroll hover-lift"
                  style={{
                    animationDelay: `${index * 200}ms`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold mx-auto mb-6 relative z-10 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How to Earn Paws */}
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              How to <span className="text-gradient">Earn Paws</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Multiple ways to earn Paws and boost your score
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {earnMethods.map((method, index) => (
              <div
                key={index}
                className="animate-on-scroll hover-lift"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300 h-full border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6 shadow-sm">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <div className="text-2xl font-bold text-gradient mb-4">
                    {method.points}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {method.description}
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

export default HowItWorksSection;
