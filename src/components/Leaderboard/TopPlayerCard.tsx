/** @format */

import { Crown, Medal, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

export type LeaderboardUser = {
  _id: string;
  avatarUrl: string;
  name: string;
  address: string;
  executions: number;
  xp: number;
};

interface TopPlayerCardProps {
  player: LeaderboardUser & { rank: number };
}

const TopPlayerCard = ({ player }: TopPlayerCardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    const badges = {
      1: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      2: "bg-gradient-to-r from-slate-300 to-slate-500",
      3: "bg-gradient-to-r from-amber-500 to-amber-700",
    };
    return badges[rank as keyof typeof badges] || "bg-slate-600";
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Rank Badge */}
      <div
        className={`absolute top-4 left-4 w-12 h-12 rounded-full ${getRankBadge(
          player.rank
        )} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
      >
        {player.rank}
      </div>

      <div className="p-6 pt-20">
        {/* Avatar and Name */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={`${player.name}'s avatar`}
                className="w-16 h-16 object-cover rounded-full mx-auto"
              />
            ) : (
              "😺"
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">
            {player.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
            {getRankIcon(player.rank)}
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Paws (XP)</span>
            <span className="text-slate-800 font-bold">
              {formatNumber(player.xp)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Executions</span>
            <span className="text-slate-800 font-bold">
              {formatNumber(player.executions)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TopPlayerCard;
