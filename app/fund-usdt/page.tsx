"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ExternalLink, Coins, Swap, Wallet } from "lucide-react";
import Link from "next/link";

const FundUsdtPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
                    <div className="max-w-6xl mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            Fund Your USDT
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Get started with live trading strategies by funding your wallet with USDT. 
                            Follow these simple steps to get your trading journey started.
                        </p>
                    </div>
                </section>

                {/* Instructions Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                            How to Fund Your USDT
                        </h2>
                        
                        <div className="space-y-8">
                            {/* Step 1: Injective Faucet */}
                            <Card className="border-2 border-blue-200 bg-blue-50/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-blue-800">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">1</span>
                                        </div>
                                        Injective Faucet
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 mb-4">
                                        First, get some INJ tokens from the Injective testnet faucet to cover transaction fees.
                                    </p>
                                    <Link 
                                        href="https://faucet.injective.network/" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                            <ExternalLink size={16} className="mr-2" />
                                            Go to Injective Faucet
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Step 2: Helix DEX */}
                            <Card className="border-2 border-green-200 bg-green-50/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-green-800">
                                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">2</span>
                                        </div>
                                        Go to Helix DEX
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 mb-4">
                                        Visit Helix DEX to swap your INJ tokens for USDT.
                                    </p>
                                    <Link 
                                        href="https://app.helix.xyz/" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                                            <ExternalLink size={16} className="mr-2" />
                                            Open Helix DEX
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Step 3: Swap INJ to USDT */}
                            <Card className="border-2 border-purple-200 bg-purple-50/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-purple-800">
                                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">3</span>
                                        </div>
                                        Swap INJ to USDT
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 mb-4">
                                        Use the swap interface to exchange your INJ tokens for USDT. 
                                        Make sure to keep some INJ for transaction fees.
                                    </p>
                                    <div className="bg-purple-100 p-4 rounded-lg">
                                        <h4 className="font-semibold text-purple-800 mb-2">Pro Tips:</h4>
                                        <ul className="text-sm text-purple-700 space-y-1">
                                            <li>• Keep at least 0.1 INJ for transaction fees</li>
                                            <li>• Set slippage to 1-2% for better execution</li>
                                            <li>• Double-check the swap details before confirming</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-16 text-center">
                            <Card className="border-2 border-orange-200 bg-orange-50/50">
                                <CardContent className="py-8">
                                    <h3 className="text-2xl font-bold text-orange-800 mb-4">
                                        Ready to Start Trading?
                                    </h3>
                                    <p className="text-gray-700 mb-6">
                                        Once you have USDT in your wallet, you can start using our live trading strategies!
                                    </p>
                                    <Link href="/app/strategies">
                                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                                            <ArrowRight size={20} className="mr-2" />
                                            Go to Live Strategies
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default FundUsdtPage;
