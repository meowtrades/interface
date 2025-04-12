import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MousePointerClick,
  BarChart2,
  ShieldCheck,
  TrendingUp,
  LineChart,
  BadgeDollarSign,
  Activity,
  Zap,
  Package,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cat, PawPrint } from "lucide-react";
import MockTradingChart from "@/components/charts/MockTradingChart";

// Define the global styles as a constant
const globalStyles = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .glassmorphism-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
  
  .shadow-3d {
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05),
      0 0 0 1px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
  }
  
  .shadow-3d-hover {
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
  }
  
  .shadow-3d-soft {
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -1px rgba(0, 0, 0, 0.03),
      0 0 0 1px rgba(0, 0, 0, 0.03),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
  }
  
  .shadow-3d-hover-soft {
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.08),
      0 4px 6px -2px rgba(0, 0, 0, 0.03),
      0 0 0 1px rgba(0, 0, 0, 0.03),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
  }
  
  .shadow-3d-blue {
    box-shadow: 
      0 10px 15px -3px rgba(37, 99, 235, 0.2),
      0 4px 6px -2px rgba(37, 99, 235, 0.1),
      0 0 0 1px rgba(37, 99, 235, 0.1),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
  }
  
  .shadow-3d-hover-blue {
    box-shadow: 
      0 20px 25px -5px rgba(37, 99, 235, 0.2),
      0 10px 10px -5px rgba(37, 99, 235, 0.1),
      0 0 0 1px rgba(37, 99, 235, 0.1),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
  }
  
  .light-3d-text {
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  }
  
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .rotate-y-2:hover {
    transform: rotateY(2deg);
  }
  
  .rotate-x-2:hover {
    transform: rotateX(2deg);
  }
  
  .animate-float-slow {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse 5s ease-in-out infinite;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const Index = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const strategiesRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);

  useEffect(() => {
    // Add intersection observer for scroll animations
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, options);

    // Select all sections to animate
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleStartStrategy = () => {
    // Navigate directly to dashboard without showing strategy popup
    navigate("/app/dashboard");
  };

  const handleExploreDemo = () => {
    // Navigate directly to mock trades
    navigate("/app/mock-trades");
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
      { value: 140 },
    ],
    pawGrid: [
      { value: 100 },
      { value: 115 },
      { value: 110 },
      { value: 118 },
      { value: 125 },
      { value: 120 },
      { value: 130 },
      { value: 125 },
    ],
  };

  const strategyCards = [
    {
      name: "Whisker DCA",
      description:
        "Dollar-cost averaging with feline precision. Strategically invest when markets dip, like a cat stalking its prey.",
      performance: "+32.5%",
      timeframe: "1 Year",
      color: "from-meow-paw to-meow-tabby",
      icon: <Activity className="w-16 h-16 text-meow-paw opacity-70" />,
      chartColor: "#9b87f5",
    },
    {
      name: "Paw Grid Trading",
      description:
        "Automated trading across price ranges. Pounce on opportunities with calculated moves, just like a cat hunting.",
      performance: "+24.8%",
      timeframe: "1 Year",
      color: "from-meow-paw to-meow-tabby",
      icon: <TrendingUp className="w-16 h-16 text-meow-paw opacity-70" />,
      chartColor: "#7E69AB",
    },
  ];

  const features = [
    {
      icon: <MousePointerClick className="w-6 h-6 text-meow-paw" />,
      title: "One-Click Trading",
      description:
        "Start trading with just one click. No complex setup, no technical knowledge required - it's that simple.",
    },
    {
      icon: <Package className="w-6 h-6 text-meow-paw" />,
      title: "Multiple Strategies",
      description:
        "Access a diverse collection of automated trading strategies, each designed for different market conditions.",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-meow-paw" />,
      title: "Performance Preview",
      description:
        "See how each strategy would have performed over different timeframes before you invest.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-meow-paw" />,
      title: "Risk-Free Mock Trading",
      description:
        "Practice with virtual funds before risking real money. Perfect your strategy in a safe environment.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="fixed inset-0 bg-[#f9fafc] -z-10"></div>
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] -z-10"></div>

      {/* Gradient orbs */}
      <div className="fixed -top-[30%] -right-[20%] w-[70%] h-[70%] bg-gradient-to-b from-blue-400/10 to-transparent rounded-full blur-[120px] -z-10 animate-float-slow"></div>
      <div
        className="fixed -bottom-[30%] -left-[20%] w-[70%] h-[70%] bg-gradient-to-t from-meow-paw/10 to-transparent rounded-full blur-[120px] -z-10 animate-float-slow"
        style={{ animationDelay: "2s" }}
      ></div>

      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-40 pb-28 px-6 relative overflow-hidden"
      >
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <div className="mb-10 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse-slow bg-meow-paw/20 blur-xl rounded-full"></div>
                <div className="relative bg-white backdrop-blur-sm bg-opacity-70 p-4 rounded-full shadow-3d">
                  <Cat className="w-10 h-10 text-meow-paw" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight text-balance">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-meow-paw via-blue-500 to-meow-tabby">
                Meowtrade
              </span>
              <span className="block mt-2 text-gray-900 light-3d-text">
                One-Click Automated Trading Strategies
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Invest in multiple crypto trading strategies with a single click.
              No trading experience needed — just pick your strategy and let
              automation work for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                onClick={handleStartStrategy}
                className="group bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl shadow-3d transition-all duration-300 hover:shadow-3d-hover"
              >
                <span className="relative z-10 flex items-center">
                  Trade with One Click
                  <Zap className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                </span>
              </Button>

              <Button
                onClick={handleExploreDemo}
                variant="outline"
                className="group px-8 py-6 text-lg rounded-xl text-gray-700 bg-white hover:bg-white shadow-3d-soft transition-all duration-300 hover:shadow-3d-hover-soft border-none"
              >
                <span className="relative z-10 flex items-center">
                  Try Risk-Free Demo
                  <TrendingUp className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
                </span>
              </Button>
            </div>
          </div>

          {/* 3D App Preview */}
          <div className="mt-24 mx-auto max-w-5xl animate-on-scroll">
            <div className="relative">
              <div className="absolute inset-0 -m-6 bg-gradient-to-r from-meow-paw/30 to-meow-tabby/30 rounded-2xl blur-2xl opacity-30 animate-pulse-slow"></div>
              <div className="relative glassmorphism-card rounded-2xl overflow-hidden shadow-3d transform perspective-1000 transition-all duration-500 hover:rotate-x-2 hover:rotate-y-1 hover:scale-[1.01]">
                <div className="h-10 bg-white bg-opacity-70 backdrop-blur-sm flex items-center px-4 gap-2 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-8 bg-white bg-opacity-50 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {strategyCards.map((strategy, index) => (
                      <div
                        key={index}
                        className="rounded-2xl p-6 glassmorphism-card shadow-3d-soft transition-all duration-300 hover:shadow-3d-hover grid grid-rows-[auto_1fr_auto] h-full transform perspective-1000 hover:rotate-y-2 hover:scale-[1.02]"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-xl text-gray-900">
                              {strategy.name}
                            </h3>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${strategy.color} shadow-sm`}
                            >
                              {strategy.performance} ({strategy.timeframe})
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6 text-sm">
                            {strategy.description}
                          </p>
                        </div>

                        <div className="h-32 rounded-lg mb-5 flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-50 to-meow-cream/70 self-end transform perspective-1000">
                          <div className="w-full h-full flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent)] animate-pulse-slow"></div>
                            {strategy.icon}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={handleStartStrategy}
                          className="w-full group bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white shadow-sm hover:shadow-md transition-all duration-300 py-2.5"
                        >
                          <span className="flex items-center">
                            Start With One Click
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategies Showcase Section */}
      <section ref={strategiesRef} className="py-28 px-6">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <div className="inline-block mb-3 py-1 px-3 bg-blue-100 rounded-full">
                <p className="text-blue-600 font-medium text-sm">
                  MULTIPLE STRATEGIES
                </p>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-6 light-3d-text tracking-tight">
                A{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-meow-paw to-blue-600">
                  Collection
                </span>{" "}
                of Trading Strategies
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Access multiple trading strategies with different risk profiles
                and market approaches. Each strategy shows historical
                performance so you can choose what fits your investment goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="animate-on-scroll">
                <div className="relative">
                  <div className="absolute inset-0 -m-4 bg-gradient-to-br from-blue-400/10 to-meow-paw/10 rounded-2xl blur-2xl opacity-50"></div>
                  <div className="relative glassmorphism-card rounded-2xl overflow-hidden shadow-3d perspective-1000 transition-all duration-500 hover:rotate-y-2 hover:scale-[1.02]">
                    <div className="h-8 bg-white bg-opacity-70 backdrop-blur-sm flex items-center px-3 border-b border-gray-100">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                    <div className="px-4 pt-2 pb-4 bg-white bg-opacity-50 backdrop-blur-sm">
                      <div className="h-[300px] flex items-center justify-center">
                        <MockTradingChart />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12 animate-on-scroll">
                {[
                  {
                    icon: <BadgeDollarSign className="w-7 h-7 text-blue-600" />,
                    title: "Historical Performance",
                    description:
                      "See how each strategy would have performed with a $100 investment over different timeframes.",
                  },
                  {
                    icon: <LineChart className="w-7 h-7 text-blue-600" />,
                    title: "Strategy Diversity",
                    description:
                      "Choose from multiple strategies with different approaches to market volatility and risk profiles.",
                  },
                  {
                    icon: (
                      <MousePointerClick className="w-7 h-7 text-blue-600" />
                    ),
                    title: "One-Click Entry",
                    description:
                      "Start trading any strategy with just one click - no complex setup or technical knowledge required.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-5 group hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0 shadow-3d-soft transition-all duration-300 group-hover:shadow-3d-hover-soft">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}

                <div>
                  <Button
                    onClick={handleExploreDemo}
                    className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white py-3 px-6 rounded-xl shadow-3d-blue transition-all duration-300 hover:shadow-3d-hover-blue flex items-center"
                  >
                    <span className="flex items-center">
                      Explore All Strategies
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-28 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_70%)]"></div>

        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 light-3d-text tracking-tight animate-on-scroll">
            Trading Made{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-meow-paw to-meow-tabby">
              Simple
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="group p-8 rounded-2xl glassmorphism-card shadow-3d-soft transition-all duration-300 hover:shadow-3d-hover-soft transform perspective-1000 hover:rotate-y-2 hover:scale-[1.05] h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-meow-cream to-white flex items-center justify-center mb-6 shadow-3d-soft transition-all duration-300 group-hover:shadow-3d-hover-soft">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} className="py-28 px-6 relative overflow-hidden">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 light-3d-text tracking-tight animate-on-scroll">
            How It{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-meow-paw to-blue-600">
              Works
            </span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              {/* The horizontal line that connects the steps */}
              <div className="hidden md:block absolute top-16 left-[10%] right-[10%] h-2 bg-gradient-to-r from-meow-paw/20 via-blue-400/20 to-meow-tabby/20 rounded-full z-0 w-[80%]"></div>

              {[
                {
                  number: 1,
                  title: "Browse Strategies",
                  description:
                    "Explore multiple automated trading strategies and their historical performance.",
                },
                {
                  number: 2,
                  title: "One-Click Entry",
                  description:
                    "Enter any strategy with a single click. No complex setup required.",
                },
                {
                  number: 3,
                  title: "Automated Trading",
                  description:
                    "Let our strategies work for you. Monitor performance from your unified dashboard.",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative z-10 text-center animate-on-scroll"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-3d-soft border-2 border-meow-paw text-meow-paw flex items-center justify-center text-xl font-bold mx-auto transform transition-all duration-300 hover:shadow-3d-hover-soft hover:scale-110">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-800">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-meow-paw/80 to-meow-tabby/80 -z-10"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_40%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_40%)]"></div>
        </div>

        <div className="container mx-auto text-center relative z-10 animate-on-scroll">
          <div className="max-w-3xl mx-auto bg-white bg-opacity-10 backdrop-blur-md p-12 rounded-3xl shadow-3d">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Access Multiple Trading Strategies?
            </h2>
            <p className="max-w-2xl mx-auto mb-10 text-white/90">
              Get one-click access to a collection of automated trading
              strategies, each optimized for different market conditions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Button
                onClick={handleExploreDemo}
                className="group bg-white text-meow-paw hover:bg-opacity-95 hover:shadow-xl px-8 py-6 text-lg rounded-xl shadow-3d-soft transition-all duration-300 hover:shadow-3d-hover-soft"
              >
                <span className="flex items-center">
                  Try Mock Trading
                  <TrendingUp className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
                </span>
              </Button>
              <Button
                onClick={handleStartStrategy}
                className="group bg-meow-midnight text-white hover:bg-meow-midnight/90 hover:shadow-xl px-8 py-6 text-lg rounded-xl shadow-3d transition-all duration-300 hover:shadow-3d-hover"
              >
                <span className="flex items-center">
                  Access All Strategies
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Add global styles using regular style element */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
    </div>
  );
};

export default Index;
