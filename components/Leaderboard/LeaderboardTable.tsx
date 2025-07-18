/** @format */

import { Card } from "@/components/ui/card";
import { RankedLeaderboardUser } from "./types";

interface LeaderboardTableProps {
  players: RankedLeaderboardUser[];
}

const LeaderboardTable = ({ players }: LeaderboardTableProps) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-[#FFFFFF]/30 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9FAFB]/30">
            <tr>
              <th
                className="text-left py-6 px-8 text-sm font-semibold w-24"
                style={{ color: "#1E293B" }}
              >
                Rank
              </th>
              <th
                className="text-left py-6 px-8 text-sm font-semibold"
                style={{ color: "#1E293B" }}
              >
                Username
              </th>
              <th
                className="text-right py-6 px-8 text-sm font-semibold w-32"
                style={{ color: "#1E293B" }}
              >
                Paws
              </th>
              <th
                className="text-right py-6 px-8 text-sm font-semibold w-32"
                style={{ color: "#1E293B" }}
              >
                Executions
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={player._id}
                className="border-b transition-colors hover:bg-gray-50"
                style={{
                  borderColor: "#E5E7EB",
                }}
              >
                <td className="py-6 px-8 w-24">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: "#334155" }}
                    >
                      {player.rank}
                    </div>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <span
                      className="font-medium text-lg"
                      style={{ color: "#1E293B" }}
                    >
                      {player.name}
                    </span>
                  </div>
                </td>
                <td
                  className="py-6 px-8 text-right font-bold text-lg w-32"
                  style={{ color: "#2563EB" }}
                >
                  {formatNumber(player.xp)}
                </td>
                <td
                  className="py-6 px-8 text-right font-semibold text-lg w-32"
                  style={{ color: "#1E293B" }}
                >
                  {formatNumber(player.executions)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LeaderboardTable;
