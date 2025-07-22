/** @format */

"use client";

import AppLayout from "@/components/AppLayout";
import React from "react";
import PaperTradeInputForm from "@/components/PaperTrades/PaperTradeInputForm";
import SampleChart from "@/components/PaperTrades/SampleChart";
import ActivePaperTrades from "@/components/PaperTrades/ActivePaperTrades";

const MockTrades = () => {
  return (
    <AppLayout>
      <div className="mb-8 px-1">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Paper Trades
        </h1>
        <p className="text-muted-foreground">
          Test strategies with virtual funds before investing real money.
        </p>
      </div>

      <div
        className="flex flex-col lg:flex-row gap-8 mb-8"
        data-start-trade-section
      >
        <PaperTradeInputForm />
        <SampleChart />
      </div>

      <h2 className="text-xl font-semibold">Your Paper Trades</h2>
      <ActivePaperTrades />
    </AppLayout>
  );
};

export default MockTrades;
