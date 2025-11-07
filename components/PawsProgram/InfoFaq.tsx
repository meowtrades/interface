/** @format */

"use client";

import React, { useEffect } from "react";

const faqs = [
  {
    question: "Do I lose Paws if I stop trading?",
    answer:
      "No, your Paws are permanent once earned. They stay in your account forever, so you can take breaks from trading without losing your accumulated rewards.",
  },
  {
    question: "Are there any trading fees?",
    answer:
      "No, there are no platform fees. You can focus on your trading strategies without worrying about any costs from us.",
  },
  {
    question: "Can I transfer my Paws to another account?",
    answer:
      "No, Paws are non-transferable and tied to your specific trading account. This ensures the rewards system remains fair and reflects your personal trading activity.",
  },
  {
    question: "How often are Paws calculated?",
    answer:
      "Paws are awarded in real-time as you complete qualifying actions. Your leaderboard position is updated daily to reflect your current Paws balance.",
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
    <section className="py-24 px-6 bg-slate-50">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-5 text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-xl">
              Everything you need to know about the Paws Program
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white p-10 rounded-2xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
