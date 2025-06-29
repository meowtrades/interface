/** @format */

import React from "react";
import { api } from "@/api/client";
import AppLayout from "@/components/AppLayout";
import { default as LeaderboardComponent } from "@/components/Leaderboard";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

export type LeaderboardUser = {
  _id: string;
  avatarUrl: string;
  name: string;
  address: string;
  executions: number;
  xp: number;
};

export type Leaderboard = LeaderboardUser[];

const Leaderboard = () => {
  const { data: leaderboard, isLoading } = useQuery<Leaderboard>({
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

  return (
    <AppLayout>
      <div className="relative">
        {/* Header with Info Link */}

        {/* Use the new Leaderboard Component */}
        <LeaderboardComponent leaderboard={leaderboard} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
