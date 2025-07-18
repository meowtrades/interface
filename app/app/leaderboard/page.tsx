"use client";

import React from "react";
import AppLayout from "@/components/AppLayout";
import { default as LeaderboardComponent } from "@/components/Leaderboard";

const Leaderboard = () => {
  return (
    <AppLayout>
      <LeaderboardComponent />
    </AppLayout>
  );
};

export default Leaderboard;
