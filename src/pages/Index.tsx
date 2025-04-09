
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MousePointerClick, BarChart2, ShieldCheck } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import AppPreview from '@/components/landing/AppPreview';
import FeatureSection from '@/components/landing/FeatureSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CallToActionSection from '@/components/landing/CallToActionSection';
import MockTradingSection from '@/components/landing/MockTradingSection';

const Index = () => {
  const navigate = useNavigate();
  
  const handleStartStrategy = () => {
    // Store info in localStorage that we're coming from landing page
    localStorage.setItem('showStrategyPopup', 'true');
    // Navigate to dashboard
    navigate('/app/dashboard');
  };

  const strategyCards = [{
    name: "Whisker DCA",
    description: "Dollar-cost averaging with feline precision. Strategically invest when markets dip, like a cat stalking its prey.",
    performance: "+32.5%",
    timeframe: "1 Year",
    color: "from-meow-paw to-meow-tabby"
  }, {
    name: "Paw Grid Trading",
    description: "Automated trading across price ranges. Pounce on opportunities with calculated moves, just like a cat hunting.",
    performance: "+24.8%",
    timeframe: "1 Year",
    color: "from-meow-paw to-meow-tabby"
  }];

  const features = [{
    icon: <MousePointerClick className="w-6 h-6 text-meow-paw" />,
    title: "One-Click Trading",
    description: "Start trading with the precision of a cat's paw. No complex setup required."
  }, {
    icon: <BarChart2 className="w-6 h-6 text-meow-paw" />,
    title: "Performance Preview",
    description: "See how strategies would have performed, as calculated as a cat's hunting strategy."
  }, {
    icon: <ShieldCheck className="w-6 h-6 text-meow-paw" />,
    title: "Mock Trading",
    description: "Practice with virtual funds, just like a kitten learning to hunt."
  }];
  
  const howItWorksSteps = [{
    number: 1,
    title: "Choose a Strategy",
    description: "Browse our one-click trading strategies and select one that matches your goals."
  }, {
    number: 2,
    title: "View Performance",
    description: "See historical performance across different timeframes before committing."
  }, {
    number: 3,
    title: "Start Trading",
    description: "Click start, enter your deposit amount, and our bots handle the rest."
  }];

  return (
    <div className="min-h-screen flex flex-col bg-meow-cream">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection handleStartStrategy={handleStartStrategy} />
      
      {/* Mock App Preview */}
      <div className="container mx-auto px-6">
        <AppPreview 
          strategyCards={strategyCards} 
          handleStartStrategy={handleStartStrategy} 
        />
      </div>
      
      {/* Mock Trading Section */}
      <MockTradingSection handleStartStrategy={handleStartStrategy} />
      
      {/* Features Section */}
      <FeatureSection features={features} />
      
      {/* How It Works Section */}
      <HowItWorksSection steps={howItWorksSteps} />
      
      {/* CTA Section */}
      <CallToActionSection handleStartStrategy={handleStartStrategy} />
      
      <Footer />
    </div>
  );
};

export default Index;
