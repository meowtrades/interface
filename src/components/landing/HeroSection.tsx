
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PawPrint, Cat } from 'lucide-react';

interface HeroSectionProps {
  handleStartStrategy: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ handleStartStrategy }) => {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-meow-whisker to-meow-cream">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">MeowTrade</span>: <br />
            <span className="text-meow-midnight bg-slate-200 hover:bg-slate-100">Trading as Smooth as a Cat's Purr</span>
          </h1>
          <p className="text-lg text-meow-charcoal/80 mb-10 max-w-2xl mx-auto">
            Tap into crypto strategies with the calculated precision of a feline. See historical performance, simulate trades, and grow your wealth effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleStartStrategy} className="bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all">
              Launch App
              <PawPrint className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/strategies">
              <Button 
                variant="outline" 
                className="px-8 py-6 text-lg rounded-xl border-meow-paw/30 text-meow-midnight hover:bg-meow-paw/10 hover:border-meow-paw/50 transition-colors group"
              >
                Explore Strategies
                <Cat className="ml-2 h-5 w-5 text-meow-paw group-hover:text-meow-tabby transition-colors" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
