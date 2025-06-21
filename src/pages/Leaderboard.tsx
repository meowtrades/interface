import React from 'react';
import {api} from "@/api";
import AppLayout from '@/components/AppLayout';
import {useQuery} from "@tanstack/react-query";
import {Trophy, Medal} from 'lucide-react';
import clsx from 'clsx';

export type Leaderboard = {
  avatarUrl?: string;
  userId: string;
  xp: number;
  username?: string;
}[];

const Leaderboard = () => {
  const {data: leaderboard, isLoading} = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const response = await api.xp.leaderboard();
      return response.data;
    },
    refetchInterval: 60000,
  });

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400";
      case 1:
        return "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400";
      case 2:
        return "bg-gradient-to-r from-amber-100 to-amber-200 border-amber-400";
      default:
        return "bg-white hover:bg-gray-50";
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">#{index + 1}</span>;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"/>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
        {leaderboard ? (
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={user.userId}
                className={clsx(
                  "p-4 rounded-lg shadow-sm border transition-all duration-200",
                  "hover:shadow-md flex items-center gap-4",
                  getRankStyle(index)
                )}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl && (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="font-semibold text-lg">{user.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">XP:</span>
                    <span className="font-bold text-lg">{user.xp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>
    </AppLayout>
  );
};

export default Leaderboard;