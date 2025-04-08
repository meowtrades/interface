
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, MousePointerClick, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  const strategyCards = [
    {
      name: "Smart DCA",
      description: "Dollar-cost averaging enhanced by market timing algorithms. Buy more when prices dip, less when prices rise.",
      performance: "+32.5%",
      timeframe: "1 Year",
      color: "from-blue-500 to-indigo-600"
    },
    {
      name: "Grid Trading",
      description: "Automated buy-low, sell-high across a price range. Profit from market volatility with pre-set buy and sell orders.",
      performance: "+24.8%",
      timeframe: "1 Year",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const features = [
    {
      icon: <MousePointerClick className="w-6 h-6 text-crypto-blue" />,
      title: "One-Click Trading",
      description: "Start trading with just one click. No complex setup required."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-crypto-purple" />,
      title: "Performance Preview",
      description: "See how strategies would have performed before you invest."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-crypto-green" />,
      title: "Mock Trading",
      description: "Practice with virtual funds before risking your own money."
    }
  ];

  const testimonials = [
    {
      quote: "I never understood crypto trading until I found CryptoClick. Now I'm investing confidently with one click.",
      name: "Sarah L.",
      role: "Retail Investor"
    },
    {
      quote: "The mock trading feature helped me understand different strategies before I put my real money in.",
      name: "Michael T.",
      role: "New Crypto Trader"
    },
    {
      quote: "Grid trading used to be way too complex for me. CryptoClick made it accessible and profitable.",
      name: "Aisha K.",
      role: "Passive Investor"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">One-Click</span> Trading <br />
              <span className="text-crypto-gray">Without the Complexity</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Tap into proven trading strategies with a single click. See historical performance, simulate trades, and grow your crypto wealth effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app">
                <Button className="bg-gradient-to-r from-crypto-blue to-crypto-purple hover:opacity-90 text-white button-glow px-8 py-6 text-lg rounded-xl">
                  Launch App
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/strategies">
                <Button variant="outline" className="px-8 py-6 text-lg rounded-xl border-slate-300">
                  Explore Strategies
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mock App Preview */}
          <div className="mt-20 rounded-xl overflow-hidden shadow-2xl border border-slate-200/50 mx-auto max-w-4xl">
            <div className="h-10 bg-slate-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategyCards.map((strategy, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg p-6 glass-card hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl">{strategy.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${strategy.color}`}>
                        {strategy.performance} ({strategy.timeframe})
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4 text-sm">
                      {strategy.description}
                    </p>
                    <div className="h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-slate-400 text-sm">Performance Chart</span>
                    </div>
                    <Button size="sm" className="w-full bg-crypto-blue hover:bg-crypto-blue/90">Start Strategy</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Trading Made <span className="gradient-text">Simple</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-white shadow-sm border border-slate-200/50">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            How It <span className="gradient-text">Works</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-1/2 left-[calc(16.67%-16px)] right-[calc(16.67%-16px)] h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
              
              {[
                { number: 1, title: "Choose a Strategy", description: "Browse our one-click trading strategies and select one that matches your goals." },
                { number: 2, title: "View Performance", description: "See historical performance across different timeframes before committing." },
                { number: 3, title: "Start Trading", description: "Click start, enter your deposit amount, and our bots handle the rest." }
              ].map((step, index) => (
                <div key={index} className="relative z-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-crypto-blue text-crypto-blue flex items-center justify-center text-lg font-bold mx-auto">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
                  <p className="mt-2 text-slate-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What Our Users <span className="gradient-text">Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 rounded-xl bg-white shadow-sm border border-slate-200/50">
                <p className="text-slate-600 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-slate-800">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-crypto-blue to-crypto-purple text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Crypto Journey?</h2>
          <p className="max-w-2xl mx-auto mb-10 text-white/90">
            Join thousands of investors who are growing their crypto wealth with one-click strategies.
          </p>
          <Link to="/app">
            <Button className="bg-white text-crypto-blue hover:bg-white/90 px-8 py-6 text-lg rounded-xl">
              Launch App Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
