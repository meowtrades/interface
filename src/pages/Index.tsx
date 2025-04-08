import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointerClick, BarChart2, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Cat, PawPrint } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  const handleStartStrategy = () => {
    // Store info in localStorage that we're coming from landing page
    localStorage.setItem('showStrategyPopup', 'true');
    // Navigate to dashboard
    navigate('/app/dashboard');
  };

  const strategyCards = [
    {
      name: "Whisker DCA",
      description: "Dollar-cost averaging with feline precision. Strategically invest when markets dip, like a cat stalking its prey.",
      performance: "+32.5%",
      timeframe: "1 Year",
      color: "from-meow-paw to-meow-tabby"
    },
    {
      name: "Paw Grid Trading",
      description: "Automated trading across price ranges. Pounce on opportunities with calculated moves, just like a cat hunting.",
      performance: "+24.8%",
      timeframe: "1 Year",
      color: "from-meow-paw to-meow-tabby"
    }
  ];

  const features = [
    {
      icon: <MousePointerClick className="w-6 h-6 text-meow-paw" />,
      title: "One-Click Trading",
      description: "Start trading with the precision of a cat's paw. No complex setup required."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-meow-paw" />,
      title: "Performance Preview",
      description: "See how strategies would have performed, as calculated as a cat's hunting strategy."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-meow-paw" />,
      title: "Mock Trading",
      description: "Practice with virtual funds, just like a kitten learning to hunt."
    }
  ];

  const testimonials = [
    {
      quote: "Trading used to be as confusing as a ball of yarn. Meowtrade made it as simple as a cat's nap.",
      name: "Sarah L.",
      role: "Crypto Novice"
    },
    {
      quote: "The mock trading feature helped me understand strategies without risking my actual catnip fund.",
      name: "Michael T.",
      role: "Cautious Investor"
    },
    {
      quote: "Grid trading felt complicated, but Meowtrade made it as smooth as a cat's whisker.",
      name: "Aisha K.",
      role: "Passive Investor"
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
              <span className="gradient-text">Meowtrade</span>: <br />
              <span className="text-meow-midnight">Trading as Smooth as a Cat's Purr</span>
            </h1>
            <p className="text-lg text-meow-charcoal/80 mb-10 max-w-2xl mx-auto">
              Tap into crypto strategies with the calculated precision of a feline. See historical performance, simulate trades, and grow your wealth effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleStartStrategy}
                className="bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Launch App
                <PawPrint className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/strategies">
                <Button variant="outline" className="px-8 py-6 text-lg rounded-xl border-meow-paw/30 text-meow-midnight hover:bg-meow-whisker/50 transition-colors">
                  Explore Strategies
                  <Cat className="ml-2 h-5 w-5" />
                </Button>
              </Link>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategyCards.map((strategy, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg p-6 glass-card hover:shadow-lg transition-all"
                  >
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
                    <Button 
                      size="sm" 
                      onClick={handleStartStrategy}
                      className="w-full bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white"
                    >
                      Start Strategy
                    </Button>
                  </div>
                ))}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                { number: 1, title: "Choose a Strategy", description: "Browse our one-click trading strategies and select one that matches your goals." },
                { number: 2, title: "View Performance", description: "See historical performance across different timeframes before committing." },
                { number: 3, title: "Start Trading", description: "Click start, enter your deposit amount, and our bots handle the rest." }
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
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-meow-whisker">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-meow-midnight">
            What Our Users <span className="gradient-text">Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <p className="text-meow-charcoal/80 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-meow-midnight">{testimonial.name}</p>
                  <p className="text-sm text-meow-charcoal/60">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-meow-paw to-meow-tabby text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Crypto Journey?</h2>
          <p className="max-w-2xl mx-auto mb-10 text-white/90">
            Join thousands of investors who are growing their crypto wealth with one-click strategies.
          </p>
          <Button 
            onClick={handleStartStrategy}
            className="bg-white text-meow-paw hover:bg-white/90 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Launch App Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
