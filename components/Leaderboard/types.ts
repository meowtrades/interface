/** @format */

export type LeaderboardUser = {
  _id: string;
  avatarUrl: string;
  name: string;
  address: string;
  executions: number;
  xp: number;
};

export type Leaderboard = LeaderboardUser[];

export type RankedLeaderboardUser = LeaderboardUser & { rank: number }; 