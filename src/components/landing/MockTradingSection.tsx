
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Smartphone, TrendingUp, LineChart, Star } from "lucide-react";

interface MockTradingSectionProps {
  handleStartStrategy: () => void;
}

const MockTradingSection: React.FC<MockTradingSectionProps> = ({ handleStartStrategy }) => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-meow-whisker to-meow-cream">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-meow-midnight">
              Try Before You <span className="gradient-text">Invest</span>
            </h2>
            <p className="text-meow-charcoal/80 mb-8">
              Practice trading risk-free with our mock trading feature. Test our strategies, 
              hone your skills, and build confidence before putting real money on the line.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-meow-paw/10 flex items-center justify-center shrink-0 mt-1">
                  <Smartphone className="h-5 w-5 text-meow-paw" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-meow-midnight">Virtual $10,000 Portfolio</h3>
                  <p className="text-meow-charcoal/70">Start with a virtual $10,000 to experiment with different strategies</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-meow-paw/10 flex items-center justify-center shrink-0 mt-1">
                  <TrendingUp className="h-5 w-5 text-meow-paw" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-meow-midnight">Real Market Data</h3>
                  <p className="text-meow-charcoal/70">Trade with real-time market conditions without the financial risk</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-meow-paw/10 flex items-center justify-center shrink-0 mt-1">
                  <LineChart className="h-5 w-5 text-meow-paw" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-meow-midnight">Performance Analytics</h3>
                  <p className="text-meow-charcoal/70">Track your mock trading results and refine your approach</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleStartStrategy}
              className="mt-8 bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white px-6 py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Try Risk-Free Demo
              <Star className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-xl border border-meow-paw/10 bg-white">
            <div className="h-10 bg-meow-whisker flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-meow-midnight mb-2">Mock Portfolio</h4>
                <div className="flex justify-between items-center p-3 bg-meow-whisker/20 rounded-lg">
                  <span className="font-medium">Balance:</span>
                  <span className="font-bold text-lg">$10,000</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-meow-paw/10 rounded-lg hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-meow-midnight">Bitcoin (BTC)</span>
                    <span className="text-green-500 font-medium">+2.4%</span>
                  </div>
                  <div className="h-20 bg-meow-whisker/30 rounded-md mb-2"></div>
                  <Button size="sm" className="w-full bg-meow-paw/90 hover:bg-meow-paw text-white">Trade Now</Button>
                </div>
                
                <div className="p-4 border border-meow-paw/10 rounded-lg hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-meow-midnight">Ethereum (ETH)</span>
                    <span className="text-red-500 font-medium">-1.2%</span>
                  </div>
                  <div className="h-20 bg-meow-whisker/30 rounded-md mb-2"></div>
                  <Button size="sm" className="w-full bg-meow-paw/90 hover:bg-meow-paw text-white">Trade Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MockTradingSection;
