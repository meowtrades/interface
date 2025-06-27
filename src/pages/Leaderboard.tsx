/** @format */

import { api } from "@/api/client";
import AppLayout from "@/components/AppLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Crown, Medal, TrendingUp, Trophy } from "lucide-react";

export type LeaderboardUser = {
  id: string;
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
          id: "1",
          avatarUrl: "",
          name: "Roger Korsgaard",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 12,
          xp: 497,
        },
        {
          id: "2",
          avatarUrl: "",
          name: "Charlie Herwitz",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 8,
          xp: 359,
        },
        {
          id: "3",
          avatarUrl: "",
          name: "Ahmad Mango",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 5,
          xp: 248,
        },
        {
          id: "4",
          avatarUrl: "",
          name: "Cristofer George",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 3,
          xp: 129,
        },
        {
          id: "5",
          avatarUrl: "",
          name: "Roger K.",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          executions: 2,
          xp: 37,
        },
      ];
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
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

  const topThree = leaderboard?.slice(0, 3) || [];

  const remainingUsers =
    leaderboard?.slice(3).map((user, index) => ({
      ...user,
      rank: index + 4,
    })) || [];

  return (
    <AppLayout>
      <div className="min-h-screen p-6">
        {/* Champions Section */}
        <div className="text-center mb-8 flex flex-col space-y-10">
          <h1 className="text-6xl font-bold bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-neutral-900 via-cyan-500 to-stone-400 bg-clip-text text-transparent mb-6">
            Paws Leaderboard
          </h1>
          <TopThree users={topThree} />
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-6xl mx-auto mt-16">
          <LeaderboardTable leaderboard={remainingUsers} />
        </div>
      </div>
    </AppLayout>
  );
};

const MonadCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "hover:border-meow-ginger hover:bg-meow-ginger hover:after:bg-meow-ginger hover:-translate-x-0.5 hover:-translate-y-0.5 ease-in-out duration-300 transform transition-all hover:after:translate-x-1 hover:after:translate-y-1 after:ease-in-out after:duration-300 bg-accent border-accent border-4 relative after:content-[''] after:absolute after:bg-accent after:w-full after:h-full after:-right-3 after:-bottom-3",
        className
      )}
    >
      {children}
    </div>
  );
};

const TopThree = ({ users }: { users: LeaderboardUser[] }) => {
  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-[#e9b308]";
      case 1:
        return "bg-[#9ca3ae]";
      case 2:
        return "bg-[#f49e0b]";
    }
  };

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="text-yellow-800" size={24} />;
      case 1:
        return <Trophy className="text-gray-800" size={24} />;
      case 2:
        return <Medal className="text-orange-800" size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
      {users.map((user, index) => (
        <MonadCard
          className="flex flex-col items-center w-full md:w-1/3 h-80"
          key={user.id}
        >
          <div
            className={`h-1/5 ${getRankColor(
              index
            )} w-full z-20 px-4 items-center flex`}
          >
            <div className="items-center font-bold text-lg flex space-x-2">
              {getIcon(index)}
              <span>Rank #{index + 1}</span>
            </div>
          </div>
          <div className="h-4/5 w-full z-20 bg-neutral-100 flex flex-col pt-4">
            <div className="flex justify-center flex-col items-center gap-2">
              <img
                src={user.avatarUrl}
                alt={`${user.name}'s avatar`}
                className="w-20 h-20 object-cover rounded-full border-2 border-accent"
              />
              <div className="flex flex-col items-center">
                <h3 className="font-bold text-lg">{user.name}</h3>
              </div>
            </div>
            <div className="flex space-x-2 items-center justify-evenly mt-4">
              <MonadCard className="w-2/5 h-16 after:-z-10">
                <div className="h-full flex items-center justify-center bg-white flex-col">
                  <h3 className="font-black text-xl z-50 text-rose-500">
                    {user.xp}
                  </h3>
                  <span className="text-xs text-gray-500 font-semibold uppercase">
                    Paws
                  </span>
                </div>
              </MonadCard>
              <MonadCard className="w-2/5 h-16 after:-z-10">
                <div className="h-full flex items-center justify-center bg-white flex-col">
                  <h3 className="font-black text-xl z-50 text-accent">
                    {user.executions}
                  </h3>
                  <span className="text-xs text-gray-500 font-semibold uppercase">
                    Executions
                  </span>
                </div>
              </MonadCard>
            </div>
          </div>
        </MonadCard>
      ))}
    </div>
  );
};

const LeaderboardTable = ({
  leaderboard,
}: {
  leaderboard: (LeaderboardUser & { rank: number })[];
}) => {
  const columns = [
    { accessorKey: "rank", header: "Rank" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "xp", header: "XP" },
    { accessorKey: "executions", header: "Executions" },
  ];

  const table = useReactTable({
    data: leaderboard.map((user, index) => ({
      ...user,
      rank: "#" + (index + 4),
    })),

    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full border-2 border-accent">
      <Table>
        <TableHeader className="bg-accent text-white">
          <TableRow className="bg-gray-100 rounded-t-lg bg-accent text-white">
            <TableHead className="text-white uppercase">Rank</TableHead>
            <TableHead className="text-white uppercase">Name</TableHead>
            <TableHead className="text-white uppercase">Paws</TableHead>
            <TableHead className="text-white uppercase">Executions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-bold">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`${
                      cell.column.id === "xp" ? "text-rose-500" : ""
                    }`}
                  >
                    <p>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </p>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;
