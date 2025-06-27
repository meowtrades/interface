/** @format */

import React from "react";
import AppLayout from "@/components/AppLayout";
import { Clock3, Medal, TrendingUp } from "lucide-react";

interface XPReward {
  icon?: React.ReactNode;
  title: string;
  description: string;
  xp: number;
}

const xpRewards: XPReward[] = [
  {
    icon: <Medal className="text-green-500" size={32} />,
    title: "Start first strategy",
    description: "Start your first strategy",
    xp: 50,
  },
  {
    icon: <TrendingUp className="text-green-500" size={32} />,
    title: "Join a trending strategy",
    description: "For every plan created in a trending strategy",
    xp: 20,
  },
  {
    icon: <Clock3 className="text-green-500" size={32} />,
    title: "Keep a live strategy for 3 days",
    description: "Every strategy that remains live for 3 days or more ",
    xp: 20,
  },
];

const LeaderboardInfo = () => {
  return (
    <div>
      <AppLayout>
        <main className="flex flex-col items-center justify-start min-h-screen">
          <h1 className="text-6xl font-bold bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-neutral-900 via-cyan-500 to-stone-400 bg-clip-text text-transparent mb-6">
            EARN PAW SCORE
          </h1>

          {/* Glass Morphism effect */}
          <div className="w-full p-5 bg-gradient-to-br from-meow-paw/10 via-transparent to-rose-500/10 rounded-lg shadow-md mt-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-neutral-900 via-cyan-500 to-stone-400 bg-clip-text text-transparent mb-4">
              How to Earn PawScore
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              PawScore is your way to earn XP and unlock rewards in MeowTrades.
              Here's how you can earn it:
            </p>
          </div>

          <ul className="gap-6 grid grid-cols-3">
            {xpRewards.map((reward) => (
              <li
                key={reward.title}
                className="p-5 flex flex-col items-start justify-start space-y-2 bg-gradient-to-br from-meow-paw/10 via-transparent to-rose-500/10 rounded-lg shadow-md mt-8 max-w-3xl backdrop-blur-md "
              >
                {reward.icon}
                <span className="font-bold">{reward.title}</span>

                <div>{reward.description} </div>
                <hr />
                <span className="font-semibold text-rose-500">
                  {reward.xp} PAWS
                </span>
              </li>
            ))}
          </ul>
        </main>
      </AppLayout>
    </div>
  );
};

export default LeaderboardInfo;
