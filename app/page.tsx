/** @format */

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import MockTradingChart from "@/components/charts/MockTradingChart";

const Index = () => {
    const router = useRouter();
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

    const handleStartStrategy = () => {
        router.push("/app/dashboard");
    };

    const handleExploreDemo = () => {
        router.push("/app/paper-trades");
    };

      const strategyCards = [
    {
      name: "Whisker DCA",
      description:
        "Dollar-cost averaging with feline precision. Strategically invest when markets dip, like a cat stalking its prey.",
      timeframe: "1 Year",
      icon: <Activity className="w-8 h-8 text-blue-600" />,
    },
    {
      name: "Paw Grid Trading",
      description:
        "Automated trading across price ranges. Pounce on opportunities with calculated moves, just like a cat hunting.",
      timeframe: "1 Year",
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
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
        className="relative pt-28 pb-16 px-6 overflow-hidden"
      >
                {/* Clean Blue Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"></div>

                {/* Subtle decorative elements */}
                <div className="absolute top-1/4 right-[20%] w-32 h-32 bg-white/5 rounded-full animate-pulse-slow"></div>
                <div
                    className="absolute bottom-1/4 left-[15%] w-24 h-24 bg-white/5 rounded-full animate-pulse-slow"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div className="absolute top-1/2 left-[10%] w-16 h-16 bg-white/10 rounded-full animate-float blur-lg"></div>
                <div
                    className="absolute bottom-1/3 right-[15%] w-20 h-20 bg-white/10 rounded-full animate-float blur-lg"
                    style={{ animationDelay: "1s" }}
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
                            Easily invest in multiple crypto strategies. No
                            experience needed. Just choose one that fits you and
                            let automation do the rest.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button
                                onClick={handleStartStrategy}
                                className="group bg-white text-blue-600 hover:bg-white/95 px-6 py-4 text-base rounded-xl shadow-lg hover:shadow-xl hover-lift font-semibold transition-all duration-300"
                            >
                                <span className="flex items-center">
                                    Trade with One Click
                                    <Zap className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                                </span>
                            </Button>

                            <Button
                                onClick={handleExploreDemo}
                                variant="outline"
                                className="group px-6 py-4 text-base rounded-xl text-white bg-white/10 hover:bg-white/20 shadow-lg hover:shadow-xl hover-lift border-2 border-white/30 backdrop-blur-sm transition-all duration-300 hover:border-white/50"
                            >
                                <span className="flex items-center">
                                    Try Risk-Free Demo
                                    <TrendingUp className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            </Button>
                        </div>

                        {/* Strategy Cards Preview */}
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-3d border border-white/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {strategyCards.map((strategy, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl p-6 shadow-3d-soft hover:shadow-3d-hover-soft hover-lift transition-all duration-300"
                                        >
                                                                                    <div className="flex items-center gap-3 mb-4">
                                            {strategy.icon}
                                            <h3 className="font-bold text-lg text-gray-900">
                                                {strategy.name}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-xs leading-relaxed">
                                            {strategy.description}
                                        </p>
                                                                                    <Button
                                            size="sm"
                                            onClick={handleStartStrategy}
                                            className="w-full group gradient-bg-primary hover:opacity-90 text-white shadow-sm hover:shadow-md text-xs"
                                        >
                                            Start With One Click
                                            <ArrowRight className="ml-2 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                                        </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
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
                                A{" "}
                                <span className="text-gradient">
                                    Collection
                                </span>{" "}
                                of Trading Strategies
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-base leading-normal">
                                Access multiple trading strategies with
                                different risk profiles and market approaches.
                                Each strategy shows historical performance so
                                you can choose what fits your investment goals.
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
                                            icon: (
                                                <BadgeDollarSign className="w-6 h-6 text-blue-600" />
                                            ),
                                            title: "Historical Performance",
                                            description:
                                                "See how each strategy would have performed with a $100 investment over different timeframes.",
                                        },
                                        {
                                            icon: (
                                                <LineChart className="w-6 h-6 text-blue-600" />
                                            ),
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
                                    <Button
                                        onClick={handleExploreDemo}
                                        className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white py-3 px-6 rounded-xl shadow-3d-blue hover:shadow-3d-hover-blue hover-lift text-sm"
                                    >
                                        Explore All Strategies
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
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
                        Trading Made{" "}
                        <span className="text-gradient">Simple</span>
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
                            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-1 bg-gradient-to-r from-blue-500/30 via-blue-400/30 to-blue-600/30 rounded-full"></div>

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
                            Get one-click access to a collection of automated
                            trading strategies, each optimized for different
                            market conditions.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                onClick={handleExploreDemo}
                                className="group bg-white text-blue-600 hover:bg-white/95 px-6 py-4 text-base rounded-xl shadow-3d-soft hover:shadow-3d-hover-soft hover-lift"
                            >
                                Try Mock Trading
                                <TrendingUp className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                            <Button
                                onClick={handleStartStrategy}
                                className="group bg-meow-midnight text-white hover:bg-meow-midnight/90 px-6 py-4 text-base rounded-xl shadow-3d hover:shadow-3d-hover hover-lift"
                            >
                                Access All Strategies
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Index;
