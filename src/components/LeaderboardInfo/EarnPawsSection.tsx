/** @format */

import React from "react";

const earnMethods = [
  {
    icon: "🥇",
    title: "Start Your First Strategy",
    points: "+50 Paws",
    description:
      "Kickstart your trading journey by launching your first strategy.",
  },
  {
    icon: "📈",
    title: "Join a Trending Strategy",
    points: "+20 Paws",
    description:
      "Every time you create a plan in a trending strategy, earn rewards for staying ahead of the market.",
  },
  {
    icon: "⏳",
    title: "Keep a Strategy Live for 3+ Days",
    points: "+20 Paws",
    description:
      "Patience pays off. Keep any strategy active for 3+ days and earn bonus Paws.",
  },
];

const EarnPawsSection = () => {
  return (
    <section className="py-16 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
          🏆 How to Earn Paws
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {earnMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white rounded-md p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div className="text-4xl mb-4 text-center">{method.icon}</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                {method.title}
              </h3>
              <div className="text-2xl font-bold text-blue-600 mb-4 text-center">
                {method.points}
              </div>
              <p className="text-slate-600 text-center leading-relaxed">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EarnPawsSection;
