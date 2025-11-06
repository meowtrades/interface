"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/PawsProgram/InfoHero";
import HowItWorksSection from "@/components/PawsProgram/InfoHowItWorks";
import WhyEarnSection from "@/components/PawsProgram/InfoWhyEarn";
import FAQSection from "@/components/PawsProgram/InfoFaq";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PawsProgram = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        {/* <WhyEarnSection /> */}
        <HowItWorksSection />
        <FAQSection />

        {/* CTA Section */}
        <section className="relative py-32 px-6 bg-slate-900 overflow-hidden">
          {/* Subtle accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

          <div className="container mx-auto max-w-5xl relative">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 shadow-2xl shadow-blue-600/50 mb-10">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white tracking-tight">
                Ready to compete?
              </h2>

              <p className="text-2xl text-slate-300 mb-14 max-w-3xl mx-auto leading-relaxed">
                Check the leaderboard to see where you rank. Start trading to
                earn Paws and climb the rankings.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
                <Link href="/app/leaderboard">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 text-base font-semibold shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
                  >
                    View Leaderboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/app/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent hover:bg-slate-800 text-white border-2 border-slate-700 hover:border-slate-600 px-10 py-7 text-base font-semibold transition-all"
                  >
                    Start Trading
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PawsProgram;
