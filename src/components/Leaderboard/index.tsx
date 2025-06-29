/** @format */

import { useState } from "react";
import { Info, Trophy } from "lucide-react";
import TopPlayerCard from "./TopPlayerCard";
import LeaderboardTable from "./LeaderboardTable";
import { Link } from "react-router-dom";

export type LeaderboardUser = {
  _id: string;
  avatarUrl: string;
  name: string;
  address: string;
  executions: number;
  xp: number;
};

interface LeaderboardProps {
  leaderboard: LeaderboardUser[];
  isLoading?: boolean;
}

const Leaderboard = ({ leaderboard, isLoading }: LeaderboardProps) => {
  if (isLoading) {
    return (
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
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remainingPlayers = leaderboard.slice(3).map((user, index) => ({
    ...user,
    rank: index + 4,
  }));

  return (
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
              <h1>#Leaderboard </h1>
              <div>
                <Link
                  to="/app/leaderboard/info"
                  className="text-blue-600"
                  title="How to earn PawScore"
                >
                  <Info size={24} />
                </Link>
              </div>
            </div>
          </div>
          <p className="text-lg" style={{ color: "#6B7280" }}></p>
        </div>

        {/* Top 3 Players Podium */}

        <div className="mb-16">
          <div className="flex items-end justify-center gap-8 mb-12">
            {/* 2nd Place */}
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: "#C7D2FE" }}
              >
                {topThree[1]?.avatarUrl ? (
                  <img
                    src={topThree[1].avatarUrl}
                    alt={`${topThree[1].name}'s avatar`}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                ) : (
                  "😺"
                )}
              </div>
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
                className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-xl"
                style={{
                  backgroundColor: "#FFFFFF",
                }}
              >
                {topThree[0]?.avatarUrl ? (
                  <img
                    src={topThree[0].avatarUrl}
                    alt={`${topThree[0].name}'s avatar`}
                    className="w-32 h-32 object-cover rounded-full border-[#F59E0B] border-4"
                  />
                ) : (
                  "😺"
                )}
              </div>
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
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: "#C7D2FE" }}
              >
                {topThree[2]?.avatarUrl ? (
                  <img
                    src={topThree[2].avatarUrl}
                    alt={`${topThree[2].name}'s avatar`}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                ) : (
                  "😺"
                )}
              </div>
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
        <LeaderboardTable players={remainingPlayers} />
      </div>
    </div>
  );
};

export default Leaderboard;
