/** @format */

import React from "react";

const faqs = [
  {
    question: "Do I lose Paws if I stop trading?",
    answer: "Nope! Your Paws are permanent once earned.",
  },
  {
    question: "How much fee discount do I get?",
    answer:
      "The more Paws you earn, the higher your tier. Discounts start at 1% and can go up to 10%.",
  },
  {
    question: "What are Trending Strategies?",
    answer:
      "Strategies with the highest number of active plans over the last 24 hours.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
          💬 Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-6 border-l-8 border-blue-500 bg-white"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {faq.question}
              </h3>
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
