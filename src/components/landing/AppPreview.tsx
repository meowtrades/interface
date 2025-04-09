
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface StrategyCard {
  name: string;
  description: string;
  performance: string;
  timeframe: string;
  color: string;
}

interface AppPreviewProps {
  strategyCards: StrategyCard[];
  handleStartStrategy: () => void;
}

const AppPreview: React.FC<AppPreviewProps> = ({ strategyCards, handleStartStrategy }) => {
  return (
    <div className="mt-20 rounded-xl overflow-hidden shadow-2xl border border-meow-paw/10 mx-auto max-w-4xl animate-float">
      <div className="h-10 bg-meow-whisker flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <div className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strategyCards.map((strategy, index) => (
            <div key={index} className="rounded-lg p-6 glass-card hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-meow-midnight">{strategy.name}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${strategy.color}`}>
                  {strategy.performance} ({strategy.timeframe})
                </div>
              </div>
              <p className="text-meow-charcoal/80 mb-4 text-sm">
                {strategy.description}
              </p>
              <div className="h-32 bg-meow-whisker/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-meow-whisker/30 to-white flex items-center justify-center">
                  <span className="text-meow-charcoal/50 text-sm">Performance Chart</span>
                </div>
              </div>
              <Button size="sm" onClick={handleStartStrategy} className="w-full bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white">
                Start Strategy
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppPreview;
