import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointerClick, BarChart2, ShieldCheck, TrendingUp, LineChart, BadgeDollarSign, Activity, Zap, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Cat, PawPrint } from 'lucide-react';
import MockTradingChart from '@/components/charts/MockTradingChart';

const Index = () => {
  const navigate = useNavigate();
  
  const handleStartStrategy = () => {
    // Navigate directly to dashboard without showing strategy popup
    navigate('/app/dashboard');
  };

  const handleExploreDemo = () => {
    // Navigate directly to mock trades
    navigate('/app/mock-trades');
  };

  // Mock chart data for strategy cards
  const strategyChartData = {
    whiskerDca: [
      { value: 100 },
      { value: 110 },
      { value: 105 },
      { value: 120 },
      { value: 115 },
      { value: 130 },
      { value: 125 },
      { value: 140 }
    ],
    pawGrid: [
      { value: 100 },
      { value: 115 },
      { value: 110 },
      { value: 118 },
      { value: 125 },
      { value: 120 },
      { value: 130 },
      { value: 125 }
    ]
  };

  const strategyCards = [
    {
      name: "Whisker DCA",
      description: "Dollar-cost averaging with feline precision. Strategically invest when markets dip, like a cat stalking its prey.",
      performance: "+32.5%",
      timeframe: "1 Year",
      color: "from-meow-paw to-meow-tabby",
      icon: <Activity className="w-16 h-16 text-meow-paw opacity-70" />,
      chartColor: "#9b87f5"
    },
    {
      name: "Paw Grid Trading",
      description: "Automated trading across price ranges. Pounce on opportunities with calculated moves, just like a cat hunting.",
      performance: "+24.8%",
      timeframe: "1 Year",
      color: "from-meow-paw to-meow-tabby",
      icon: <TrendingUp className="w-16 h-16 text-meow-paw opacity-70" />,
      chartColor: "#7E69AB"
    }
  ];

  const features = [
    {
      icon: <MousePointerClick className="w-6 h-6 text-meow-paw" />,
      title: "One-Click Trading",
      description: "Start trading with just one click. No complex setup, no technical knowledge required - it's that simple."
    },
    {
      icon: <Package className="w-6 h-6 text-meow-paw" />,
      title: "Multiple Strategies",
      description: "Access a diverse collection of automated trading strategies, each designed for different market conditions."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-meow-paw" />,
      title: "Performance Preview",
      description: "See how each strategy would have performed over different timeframes before you invest."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-meow-paw" />,
      title: "Risk-Free Mock Trading",
      description: "Practice with virtual funds before risking real money. Perfect your strategy in a safe environment."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-meow-cream">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-meow-whisker to-meow-cream">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Meowtrade</span><br />
              <span className="text-meow-midnight">One-Click Access to <br/>Automated Trading Strategies</span>
            </h1>
            <p className="text-lg text-meow-charcoal/80 mb-10 max-w-2xl mx-auto">
              Invest in multiple crypto trading strategies with a single click. No trading experience needed - just view historical performance, select your strategy, and let automation do the work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleStartStrategy}
                className="bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-80 text-white px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Trade with One Click
                <Zap className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleExploreDemo}
                variant="outline" 
                className="px-8 py-6 text-lg rounded-xl border-meow-paw/30 text-meow-midnight hover:bg-meow-whisker/50 hover:text-meow-midnight hover:shadow-md transition-all"
              >
                Try Risk-Free Demo
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Mock App Preview */}
          <div className="mt-20 rounded-xl overflow-hidden shadow-2xl border border-meow-paw/10 mx-auto max-w-4xl animate-float">
            <div className="h-10 bg-meow-whisker flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {strategyCards.map((strategy, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg p-6 glass-card hover:shadow-lg transition-all grid grid-rows-[auto_1fr_auto] h-full"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-meow-midnight">{strategy.name}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${strategy.color}`}>
                          {strategy.performance} ({strategy.timeframe})
                        </div>
                      </div>
                      <p className="text-meow-charcoal/80 mb-4 text-sm">
                        {strategy.description}
                      </p>
                    </div>
                    
                    <div className="h-32 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-slate-50 self-end">
                      <div className="w-full h-full flex items-center justify-center">
                        {strategy.icon}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={handleStartStrategy}
                      className="w-full bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white"
                    >
                      Start With One Click
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Strategies Showcase Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-blue-600 font-medium text-lg mb-2">MULTIPLE STRATEGIES</p>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-6">
                A <span className="text-blue-600">Collection</span> of Trading Strategies
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Access multiple trading strategies with different risk profiles and market approaches. Each strategy shows historical performance so you can choose what fits your investment goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="h-8 bg-gray-50 flex items-center px-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="px-4 pt-2 pb-4 bg-white">
                  <div className="h-[300px] bg-white flex items-center justify-center">
                    <MockTradingChart />
                  </div>
                </div>
              </div>
              
              <div className="space-y-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <BadgeDollarSign className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Historical Performance</h3>
                    <p className="text-gray-600 text-base">
                      See how each strategy would have performed with a $100 investment over different timeframes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <LineChart className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Strategy Diversity</h3>
                    <p className="text-gray-600 text-base">
                      Choose from multiple strategies with different approaches to market volatility and risk profiles.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MousePointerClick className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">One-Click Entry</h3>
                    <p className="text-gray-600 text-base">
                      Start trading any strategy with just one click - no complex setup or technical knowledge required.
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button 
                    onClick={handleExploreDemo}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-base font-medium hover:shadow-lg transition-all flex items-center"
                  >
                    Explore All Strategies
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-meow-whisker">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Trading Made <span className="gradient-text">Simple</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <div className="w-12 h-12 rounded-full bg-meow-cream flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-meow-midnight">{feature.title}</h3>
                <p className="text-meow-charcoal/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-meow-cream to-meow-whisker">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-meow-midnight">
            How It <span className="gradient-text">Works</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* The horizontal line that connects the steps */}
              <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-1 bg-meow-paw/20 z-0 w-[80%]"></div>
              
              {[
                { number: 1, title: "Browse Strategies", description: "Explore multiple automated trading strategies and their historical performance." },
                { number: 2, title: "One-Click Entry", description: "Enter any strategy with a single click. No complex setup required." },
                { number: 3, title: "Automated Trading", description: "Let our strategies work for you. Monitor performance from your unified dashboard." }
              ].map((step, index) => (
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
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-meow-paw to-meow-tabby text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Access Multiple Trading Strategies?</h2>
          <p className="max-w-2xl mx-auto mb-10 text-white/90">
            Get one-click access to a collection of automated trading strategies, each optimized for different market conditions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleExploreDemo}
              className="bg-white text-meow-paw hover:bg-meow-whisker/50 hover:text-meow-midnight hover:shadow-xl px-8 py-6 text-lg rounded-xl transition-all"
            >
              Try Mock Trading
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={handleStartStrategy}
              className="bg-meow-midnight text-white hover:bg-meow-midnight/90 hover:shadow-xl px-8 py-6 text-lg rounded-xl transition-all"
            >
              Access All Strategies
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
