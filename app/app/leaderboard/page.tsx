"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import AppLayout from "@/components/AppLayout";
import LeaderboardTable, { LeaderboardUser } from "@/components/LeaderboardTable";

const Leaderboard = () => {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      // const response = await api.xp.leaderboard();
      // console.log(response.data);
      // return response.data;
      return [
        {
          _id: "1",
          avatarUrl: "",
          name: "Roger Korsgaard",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 12,
          xp: 497,
        },
        {
          _id: "2",
          avatarUrl: "",
          name: "Charlie Herwitz",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 8,
          xp: 359,
        },
        {
          _id: "3",
          avatarUrl: "",
          name: "Ahmad Mango",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 5,
          xp: 248,
        },
        {
          _id: "4",
          avatarUrl: "",
          name: "Cristofer George",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 3,
          xp: 129,
        },
        {
          _id: "5",
          avatarUrl: "",
          name: "Roger K.",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 2,
          xp: 37,
        },
        {
          _id: "6",
          avatarUrl: "",
          name: "Charlie H.",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 2,
          xp: 12,
        },
        {
          _id: "7",
          avatarUrl: "",
          name: "New Player",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 2,
          xp: 10,
        },
        {
          _id: "8",
          avatarUrl: "",
          name: "Another Player",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 1,
          xp: 5,
        },
      ];
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div
          className="min-h-screen relative flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #F0F8FF 0%, #E1ECFF 100%)",
          }}
        >
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-300 rounded w-64 mx-auto"></div>
            <div className="flex justify-center gap-4">
              <div className="h-80 w-64 bg-slate-300 rounded-3xl"></div>
              <div className="h-96 w-64 bg-slate-300 rounded-3xl"></div>
              <div className="h-72 w-64 bg-slate-300 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const topThree = (leaderboard || []).slice(0, 3);
  const allPlayers = (leaderboard || []).map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

  return (
    <AppLayout>
      <div
        className="min-h-screen relative"
        style={{
          background: "linear-gradient(135deg, #F0F8FF 0%, #E1ECFF 100%)",
        }}
      >
        {/* Enhanced blue grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            mask: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)",
            WebkitMask:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)",
          }}
        />

        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8" style={{ color: "#F59E0B" }} />
              <div
                className="text-5xl font-bold flex items-center space-x-2 "
                style={{ color: "#F59E0B" }}
              >
                <h1>Leaderboard</h1>
              </div>
            </div>
            <p className="text-lg" style={{ color: "#6B7280" }}>
              Compete with other traders and earn PawScore for your strategy executions
            </p>
          </div>

          {/* Top 3 Players Podium */}
          <div className="mb-16">
            <div className="flex items-end justify-center gap-8 mb-12">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: "#6B7280" }}
                >
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
                  {topThree[1]?.name}
                </h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  #2
                </p>
                <p className="font-semibold" style={{ color: "#2563EB" }}>
                  {topThree[1]?.xp.toLocaleString()} XP
                </p>
              </div>

              {/* 1st Place with blue shadow */}
              <div className="text-center relative">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center shadow-xl"
                  style={{ backgroundColor: "#F59E0B" }}
                >
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl" style={{ color: "#1E293B" }}>
                  {topThree[0]?.name}
                </h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  #1
                </p>
                <p className="font-bold text-lg" style={{ color: "#2563EB" }}>
                  {topThree[0]?.xp.toLocaleString()} XP
                </p>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: "#CD7C2F" }}
                >
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
                  {topThree[2]?.name}
                </h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  #3
                </p>
                <p className="font-semibold" style={{ color: "#2563EB" }}>
                  {topThree[2]?.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <LeaderboardTable players={allPlayers} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
