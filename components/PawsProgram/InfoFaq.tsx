/** @format */

"use client";

import React, { useEffect } from "react";

const faqs = [
  {
    question: "Do I lose Paws if I stop trading?",
    answer: "No, your Paws are permanent once earned. They stay in your account forever, so you can take breaks from trading without losing your accumulated rewards.",
  },
  {
    question: "How much fee discount do I get?",
    answer: "Fee discounts start at 1% and can go up to 10% based on your Paws score. The more Paws you earn, the higher your discount level becomes.",
  },
  {
    question: "What are Trending Strategies?",
    answer: "Strategies with the most active plans in the last 24 hours. These are typically the most popular and successful strategies that other traders are actively using.",
  },
  {
    question: "Can I transfer my Paws to another account?",
    answer: "No, Paws are non-transferable and tied to your specific trading account. This ensures the rewards system remains fair and reflects your personal trading activity.",
  },
  {
    question: "How often are Paws calculated?",
    answer: "Paws are awarded in real-time as you complete qualifying actions. Your leaderboard position and fee discounts are updated daily to reflect your current Paws balance.",
  },
];

const FAQSection = () => {
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Frequently <span className="text-gradient">Asked Questions</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Everything you need to know about the Paws Program
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="animate-on-scroll hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
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

export default FAQSection;
