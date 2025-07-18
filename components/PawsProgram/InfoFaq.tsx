/** @format */

import React from "react";

const faqs = [
  {
    question: "Do I lose Paws if I stop trading?",
    answer: "No, your Paws are permanent once earned.",
  },
  {
    question: "How much fee discount do I get?",
    answer: "Fee discounts start at 1% and can go up to 10% based on your Paws score.",
  },
  {
    question: "What are Trending Strategies?",
    answer: "Strategies with the most active plans in the last 24 hours.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-card-hover transition-shadow"
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {faq.question}
              </h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
