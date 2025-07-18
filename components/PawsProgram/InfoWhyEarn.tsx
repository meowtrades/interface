/** @format */
import React from "react";

const benefits = [
  {
    title: "Lower Fees",
    description: "Higher Paws score means lower platform fees",
  },
  {
    title: "Leaderboard Ranking",
    description: "Compete with other traders on the leaderboard",
  },
  {
    title: "Future Rewards",
    description: "Early access to new features and perks",
  },
];

const WhyEarnSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Why Earn Paws?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-card-hover transition-shadow"
            >
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
