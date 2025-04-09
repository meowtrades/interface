
import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  steps: Step[];
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ steps }) => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-meow-cream to-meow-whisker">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-meow-midnight">
          How It <span className="gradient-text">Works</span>
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* The horizontal line that connects the steps */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-1 bg-meow-paw/20 z-0 w-[80%]"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-md border-2 border-meow-paw text-meow-paw flex items-center justify-center text-lg font-bold mx-auto">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-medium text-meow-midnight">{step.title}</h3>
                <p className="mt-2 text-meow-charcoal/80 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
