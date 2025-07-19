"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/PawsProgram/InfoHero";
import HowItWorksSection from "@/components/PawsProgram/InfoHowItWorks";
import WhyEarnSection from "@/components/PawsProgram/InfoWhyEarn";
import FAQSection from "@/components/PawsProgram/InfoFaq";

const PawsProgram = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <HeroSection />
                <WhyEarnSection />
                <HowItWorksSection />
                <FAQSection />
            </div>
            <Footer />
        </div>
    );
};

export default PawsProgram;
