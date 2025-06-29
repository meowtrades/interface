/** @format */
import React from "react";

const benefits = [
  {
    icon: "🧾",
    title: "Lower Platform Fees",
    description: "Earn more Paws → Pay less in fees. Simple and rewarding.",
  },
  {
    icon: "⚔️",
    title: "Climb the Leaderboard",
    description: "Your Paws score boosts your ranking on our leaderboard.",
  },
  {
    icon: "🎯",
    title: "Unlock Future Rewards",
    description: "We're building more perks around Paws – be an early adopter.",
  },
];

const WhyEarnSection = () => {
  return (
    <section className="py-16 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
          💡 Why Earn Paws?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white flex flex-col items-center rounded-md p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                {benefit.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyEarnSection;
