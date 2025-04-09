
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface CallToActionSectionProps {
  handleStartStrategy: () => void;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ handleStartStrategy }) => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-meow-paw to-meow-tabby text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Crypto Journey?</h2>
        <p className="max-w-2xl mx-auto mb-10 text-white/90">
          Join thousands of investors who are growing their crypto wealth with one-click strategies.
        </p>
        <Button onClick={handleStartStrategy} className="bg-white text-meow-paw hover:bg-white/90 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
          Launch App Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default CallToActionSection;
