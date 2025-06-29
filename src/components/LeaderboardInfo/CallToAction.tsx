/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const CallToActionSection = () => {
  return (
    <section className="py-16 px-6 text-black relative">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Earning Paws?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of traders already earning rewards and saving on fees
        </p>
        <Button asChild>
          <Link
            to={"/app"}
            className="text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            🚀 Start Trading Now
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToActionSection;
