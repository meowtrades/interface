/** @format */

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
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
  PawPrint,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MockTradingChart from "@/components/charts/MockTradingChart";

const Index = () => {
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
    if (typeof document !== "undefined") {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, []);

  const strategyCards = [
    {
      name: "Smart DCA",
      description:
        "Dollar-cost averaging with feline precision. Strategically invest when markets dip, like a cat stalking its prey.",
      timeframe: "1 Year",
      icon: <Activity className="w-9 h-9 text-blue-600" />,
    },
    {
      name: "Automated Grid Trading",
      description:
        "Automated trading across price ranges. Pounce on opportunities with calculated moves, just like a cat hunting.",
      timeframe: "1 Year",
      icon: <TrendingUp className="w-9 h-9 text-blue-600" />,
    },
  ];

  const features = [
    {
      icon: <MousePointerClick className="w-6 h-6 text-blue-600" />,
      title: "One-Click Trading",
      description:
        "Start trading with just one click. No complex setup, no technical knowledge required - it's that simple.",
    },
    {
      icon: <Package className="w-6 h-6 text-blue-600" />,
      title: "Multiple Strategies",
      description:
        "Access a diverse collection of automated trading strategies, each designed for different market conditions.",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
      title: "Performance Preview",
      description:
        "See how each strategy would have performed over different timeframes before you invest.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: "Risk-Free Mock Trading",
      description:
        "Practice with virtual funds before risking real money. Perfect your strategy in a safe environment.",
    },
  ];

  const steps = [
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
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-42 px-6 overflow-hidden min-h-screen"
      >
        {/* Clean Blue Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"></div>

        {/* Enhanced animated background elements */}
        {/* Large morphing shapes */}
        <div className="absolute top-1/4 right-[20%] w-32 h-32 bg-white/5 animate-morph"></div>
        <div
          className="absolute bottom-1/4 left-[15%] w-24 h-24 bg-white/5 animate-morph"
          style={{ animationDelay: "5s" }}
        ></div>

        {/* Floating circles with different animations */}
        <div className="absolute top-1/2 left-[10%] w-16 h-16 bg-white/10 rounded-full animate-float blur-lg"></div>
        <div
          className="absolute bottom-1/3 right-[15%] w-20 h-20 bg-white/10 rounded-full animate-float blur-lg"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-[60%] left-[25%] w-12 h-12 bg-white/8 rounded-full animate-drift blur-md"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-[20%] left-[70%] w-28 h-28 bg-white/6 rounded-full animate-float-alternate blur-lg"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Geometric shapes */}
        <div
          className="absolute top-[35%] right-[25%] w-8 h-8 bg-white/15 animate-rotate-slow"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            animationDelay: "1.5s",
          }}
        ></div>
        <div
          className="absolute bottom-[40%] left-[20%] w-6 h-6 bg-white/20 animate-rotate-slow"
          style={{
            animationDelay: "4s",
            animationDirection: "reverse",
          }}
        ></div>

        {/* Moving gradient lines */}
        <div
          className="absolute top-[15%] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-horizontal blur-sm"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-[25%] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-slide-horizontal blur-sm"
          style={{ animationDelay: "6s" }}
        ></div>

        {/* Additional floating particles */}
        <div
          className="absolute top-[25%] left-[5%] w-3 h-3 bg-white/25 rounded-full animate-drift"
          style={{ animationDelay: "7s" }}
        ></div>
        <div
          className="absolute bottom-[35%] right-[8%] w-4 h-4 bg-white/20 rounded-full animate-float-alternate"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute top-[40%] right-[5%] w-2 h-2 bg-white/30 rounded-full animate-pulse-slow"
          style={{ animationDelay: "8s" }}
        ></div>
        <div
          className="absolute bottom-[15%] left-[8%] w-5 h-5 bg-white/15 rounded-full animate-drift blur-sm"
          style={{ animationDelay: "4.5s" }}
        ></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <div className="inline-block mb-4 py-2 px-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <p className="text-white/90 font-semibold text-sm uppercase tracking-wide">
                AI TRADING STRATEGIES
              </p>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight">
              <span className="text-white">Meowtrades</span>
              <span className="block mt-1 text-white/95">
                One-Click Automated Trading Strategies
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 mb-8 max-w-3xl mx-auto leading-normal">
              Easily invest in multiple crypto strategies. No experience needed.
              Just choose one that fits you and let automation do the rest.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/app/dashboard">
                <Button className="group bg-white text-blue-600 hover:bg-white/95 px-6 py-4 text-base rounded-xl shadow-lg hover:shadow-xl hover-lift font-semibold transition-all duration-300">
                  <span className="flex items-center">
                    Trade with One Click
                    <Zap className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </span>
                </Button>
              </Link>

              <Link href="/paws-program">
                <Button
                  variant="outline"
                  className="group px-6 py-4 text-base rounded-xl text-white bg-white/10 hover:bg-white/20 shadow-lg hover:shadow-xl hover-lift border-2 border-white/30 backdrop-blur-sm transition-all duration-300 hover:border-white/50"
                >
                  <span className="flex items-center">
                    Earn Paws
                    <PawPrint className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Strategy Cards Preview */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-3d border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {strategyCards.map((strategy, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-8 shadow-3d-soft hover:shadow-3d-hover-soft hover-lift transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        {strategy.icon}
                        <h3 className="font-bold text-xl text-gray-900">
                          {strategy.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                        {strategy.description}
                      </p>
                      <Link href="/app/paper-trades" className="w-full">
                        <Button
                          size="sm"
                          className="w-full group gradient-bg-primary hover:opacity-90 text-white shadow-sm hover:shadow-md text-sm py-3"
                        >
                          Try Risk-Free Demo
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wavy Section Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-20"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="fill-white/50"
            ></path>
          </svg>
        </div>
      </section>

      {/* Strategies Showcase Section */}
      <section ref={strategiesRef} className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-on-scroll">
              <div className="inline-block mb-3 py-2 px-4 bg-blue-100 rounded-full">
                <p className="text-blue-600 font-semibold text-sm">
                  MULTIPLE STRATEGIES
                </p>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">
                A <span className="text-gradient">Collection</span> of Trading
                Strategies
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base leading-normal">
                Access multiple trading strategies with different risk profiles
                and market approaches. Each strategy shows historical
                performance so you can choose what fits your investment goals.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll">
                <div className="glassmorphism-card rounded-2xl p-6 shadow-3d hover-lift">
                  <div className="h-80 rounded-xl bg-gradient-to-br from-blue-50 to-meow-cream/50 flex items-center justify-center">
                    <MockTradingChart />
                  </div>
                </div>
              </div>

              <div className="space-y-6 animate-on-scroll">
                {[
                  {
                    icon: <BadgeDollarSign className="w-6 h-6 text-blue-600" />,
                    title: "Historical Performance",
                    description:
                      "See how each strategy would have performed with a $100 investment over different timeframes.",
                  },
                  {
                    icon: <LineChart className="w-6 h-6 text-blue-600" />,
                    title: "Strategy Diversity",
                    description:
                      "Choose from multiple strategies with different approaches to market volatility and risk profiles.",
                  },
                  {
                    icon: (
                      <MousePointerClick className="w-6 h-6 text-blue-600" />
                    ),
                    title: "One-Click Entry",
                    description:
                      "Start trading any strategy with just one click - no complex setup or technical knowledge required.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 hover-lift transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-3d-soft">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-normal text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <Link href="/app/paper-trades">
                    <Button className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white py-3 px-6 rounded-xl shadow-3d-blue hover:shadow-3d-hover-blue hover-lift text-sm">
                      Explore All Strategies
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-16 text-gray-900 animate-on-scroll">
            Trading Made <span className="text-gradient">Simple</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-on-scroll hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/80 p-6 rounded-2xl shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4 shadow-3d-soft">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-normal text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 text-gray-900 animate-on-scroll">
            How It <span className="text-gradient">Works</span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-20 left-[12%] right-[12%] h-1 bg-gradient-to-r from-blue-500/30 via-blue-400/30 to-blue-600/30 rounded-full"></div>

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative text-center animate-on-scroll hover-lift"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-3d border-2 border-blue-600 text-blue-600 flex items-center justify-center text-xl font-bold mx-auto mb-6 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-normal text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-primary"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

        <div className="container mx-auto text-center relative z-10 animate-on-scroll">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">
              Ready to Access Multiple Trading Strategies?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/90 text-base leading-normal">
              Get one-click access to a collection of automated trading
              strategies, each optimized for different market conditions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app/paper-trades">
                <Button className="group bg-white text-blue-600 hover:bg-white/95 px-6 py-4 text-base rounded-xl shadow-3d hover:shadow-3d-hover hover-lift">
                  Try Mock Trading
                  <TrendingUp className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/app/dashboard">
                <Button className="group bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 px-6 py-4 text-base rounded-xl shadow-3d hover:shadow-3d-hover hover-lift">
                  Access All Strategies
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
