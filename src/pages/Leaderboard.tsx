/** @format */

import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

// CSS for shining effect with pure CSS
const shineStyles = `
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 200%; }
  }

  .shine-effect {
    position: relative;
    overflow: hidden;
  }

  .shine-effect::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    pointer-events: none;
    z-index: 1;
  }

  .top-1.shine-effect::after {
    animation: shine 2s infinite 0.5s;
  }

  .top-2.shine-effect::after {
    animation: shine 2.5s infinite 1.2s;
  }

  .top-3.shine-effect::after {
    animation: shine 3s infinite 0.8s;
  }

  .shine-on-hover:hover::after {
    animation: shine 1s forwards;
  }
`;

export type Leaderboard = {
  avatarUrl?: string;
  userId: string;
  xp: number;
  username?: string;
}[];

const Leaderboard = () => {
  // Add CSS styles to the document
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = shineStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await api.xp.leaderboard();
      return response.data;
    },
    refetchInterval: 60000,
  });

  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 12 },
    },
  };

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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 max-w-4xl mx-auto">
          <motion.h1
            className="text-3xl font-bold mb-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
              duration: 0.5,
            }}
          >
            Leaderboard
          </motion.h1>
          <motion.div
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="h-16 bg-gray-200 rounded-lg"
                variants={item}
                layout
              />
            ))}
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  // For podium: center gold, left silver, right bronze
  let podiumUsers: Leaderboard = [];
  if (leaderboard.length === 1) {
    podiumUsers = [leaderboard[0]];
  } else if (leaderboard.length === 2) {
    podiumUsers = [leaderboard[0], leaderboard[1]];
  } else {
    podiumUsers = [leaderboard[0], leaderboard[1], leaderboard[2]];
  }

  return (
    <AppLayout>
      <div className="p-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-8"
        >
          <motion.h1
            className="text-3xl font-bold text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
          >
            Leaderboard
          </motion.h1>
        </motion.div>

        {/* Podium for Top 3 */}
        <motion.div
          className={clsx(
            "flex justify-center items-end gap-10 mb-10",
            leaderboard.length === 1 && "justify-center",
            leaderboard.length === 2 && "justify-center"
          )}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {podiumUsers.map((user, i) => {
            if (!user) return <div key={i} className="flex-1" />;
            // Adjust props for 1 or 2 users
            let prop;
            if (leaderboard.length === 1) {
              prop = {
                color:
                  "bg-gradient-to-t from-yellow-300 to-yellow-100 border-yellow-400",
                shine: "top-1",
                height: "h-72",
                badge: "bg-yellow-500",
                lift: "mt-0 z-20", // No negative margin
              };
            } else if (leaderboard.length === 2) {
              prop = [
                {
                  color:
                    "bg-gradient-to-t from-yellow-300 to-yellow-100 border-yellow-400",
                  shine: "top-1",
                  height: "h-72",
                  badge: "bg-yellow-500",
                  lift: "mt-0 z-20",
                },
                {
                  color:
                    "bg-gradient-to-t from-gray-300 to-gray-100 border-gray-400",
                  shine: "top-2",
                  height: "h-64",
                  badge: "bg-gray-400",
                  lift: "mt-4 z-10",
                },
              ][i];
            } else {
              prop = [
                {
                  color:
                    "bg-gradient-to-t from-yellow-300 to-yellow-100 border-yellow-400",
                  shine: "top-1",
                  height: "h-72",
                  badge: "bg-yellow-500",
                  lift: "-mt-16 z-20",
                },
                {
                  color:
                    "bg-gradient-to-t from-gray-300 to-gray-100 border-gray-400",
                  shine: "top-2",
                  height: "h-64",
                  badge: "bg-gray-400",
                  lift: "mt-4 z-10",
                },
                {
                  color:
                    "bg-gradient-to-t from-amber-400 to-amber-200 border-amber-600",
                  shine: "top-3",
                  height: "h-56",
                  badge: "bg-amber-600",
                  lift: "mt-10 z-0",
                },
              ][i];
            }
            const rank = i + 1;
            return (
              <motion.div
                key={user.userId}
                variants={item}
                className={clsx(
                  "flex flex-col items-center justify-end rounded-xl border-2 shadow-md shine-effect pt-8 pb-2",
                  prop.color,
                  prop.shine,
                  prop.height,
                  prop.lift,
                  "w-40 relative"
                )}
                style={{ minWidth: 120 }}
              >
                {/* Rank number badge on top left, absolute, not too big */}
                <span
                  className={clsx(
                    "absolute left-3 top-3 px-3 py-1 rounded-full font-bold text-white shadow text-base z-10",
                    prop.badge
                  )}
                  style={{ minWidth: 36, textAlign: "center" }}
                >
                  #{rank}
                </span>
                {/* User avatar sits on the card, not squished */}
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-2 mt-4 z-0"
                  style={{ objectFit: "cover" }}
                />
                <span className="font-bold text-lg">{user.username}</span>
                <span className="text-sm text-gray-600 mb-2">
                  XP: {user.xp.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Rest of leaderboard */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence>
            {leaderboard.slice(3).map((user, index) => (
              <motion.div
                key={user.userId}
                variants={item}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className={clsx(
                  "p-4 rounded-lg shadow-sm border shine-on-hover bg-white flex items-center gap-4"
                )}
                style={{ position: "relative" }}
              >
                <span className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 text-lg">
                  #{index + 4}
                </span>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl && (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <motion.span
                      className="font-semibold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {user.username}
                    </motion.span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">XP:</span>
                    <motion.span
                      className="font-bold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {user.xp.toLocaleString()}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
