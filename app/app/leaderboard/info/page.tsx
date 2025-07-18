/** @format */

import React from "react";
import AppLayout from "@/components/AppLayout";
import HeroSection from "@/components/Leaderboard/Info/InfoHero";
import HowItWorksSection from "@/components/Leaderboard/InfoHowItWorks";
import WhyEarnSection from "@/components/Leaderboard/InfoWhyEarn";
import FAQSection from "@/components/Leaderboard/Info/InfoFaq";

const LeaderboardInfo = () => {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(135deg, #F0F8FF 0%, #E1ECFF 100%)",
      }}
    >
      <div
        className="inset-0 opacity-40 absolute h-[360vh]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          mask: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)",
          WebkitMask:
            "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)",
        }}
      />
      <AppLayout>
        <HeroSection />
        <WhyEarnSection />
        <HowItWorksSection />
        <FAQSection />
      </AppLayout>
    </div>
  );
};

export default LeaderboardInfo;
