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
import { TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TrendingUp } from "lucide-react";

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
      const response = await api.xp.leaderboard();
      console.log(response.data);
      return response.data;
      // return [
      //   {
      //     id: "1",
      //     avatarUrl: "",
      //     name: "Roger Korsgaard",
      //     address: "0x1234567890abcdef1234567890abcdef12345678",
      //     executions: 12,
      //     xp: 497,
      //   },
      //   {
      //     id: "2",
      //     avatarUrl: "",
      //     name: "Charlie Herwitz",
      //     address: "0x1234567890abcdef1234567890abcdef12345678",
      //     executions: 8,
      //     xp: 359,
      //   },
      //   {
      //     id: "3",
      //     avatarUrl: "",
      //     name: "Ahmad Mango",
      //     address: "0x1234567890abcdef1234567890abcdef12345678",
      //     executions: 5,
      //     xp: 248,
      //   },
      //   {
      //     id: "4",
      //     avatarUrl: "",
      //     name: "Cristofer George",
      //     address: "0x1234567890abcdef1234567890abcdef12345678",
      //     executions: 3,
      //     xp: 129,
      //   },
      //   {
      //     id: "5",
      //     avatarUrl: "",
      //     name: "Roger K.",
      //     address: "0x1234567890abcdef1234567890abcdef12345678",
      //     executions: 2,
      //     xp: 37,
      //   },
      // ];
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

  const getFirstInCenter = (data: Leaderboard) => {
    if (data.length === 0) return [];
    if (data.length === 1) return [data[0]];
    if (data.length === 2) return [data[0], data[1]];

    return [data[1], data[0], data[2]];
  };

  const topThree = getFirstInCenter(leaderboard?.slice(0, 3) || []);

  const remainingUsers =
    leaderboard?.slice(3).map((user, index) => ({
      ...user,
      rank: index + 4,
    })) || [];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-meow-ginger/20 via-[#f9fafc] to-[#f9fafc] p-6">
        {/* Champions Section */}
        <div className="text-center mb-8 flex flex-col space-y-10">
          <h1 className="text-6xl font-bold text-gray-300 mb-6">
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

const TopThree = ({ users }: { users: LeaderboardUser[] }) => {
  const getRankGradient = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-tr from-emerald-50 via-yellow-200 to-green-50 to-white";
      case 1:
        return "bg-gradient-to-tr from-violet-100 via-blue-200 via-cyan-200 to-white";
      case 2:
        return "bg-gradient-to-tr from-violet-100 via-[#ffd2a5] to-white";
      default:
        return "";
    }
  };

  const getRankSuffx = (index: number) => {
    switch (index) {
      case 0:
        return "st";
      case 1:
        return "nd";
      case 2:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <div className="flex gap-10 items-center justify-center">
      {users.map((user, index) => (
        <div className="flex flex-col w-72 h-72 border rounded-2xl overflow-clip shadow-lg bg-neutral-50">
          <div
            className={`rank-gradient h-2/5 ${getRankGradient(index)} relative`}
          >
            <i className="text-7xl text-black font-bold font-league-gothic flex items-start justify-end mr-10 mt-5 h-full gap-2 opacity-20">
              {index + 1}
              <span className="text-4xl">{getRankSuffx(index)}</span>
            </i>
          </div>
          <div className="details h-3/5 relative">
            <div className="absolute left-5 -top-7 flex items-center">
              <img
                src={user.avatarUrl}
                className="min-w-24 min-h-24 bg-slate-700 rounded-full border-8 border-neutral-50"
              />
              <span className="text-lg font-bold text-gray-900 pl-4 text-start">
                {user.name}
              </span>
            </div>
            <div className="flex flex-col justify-center items-start h-full pl-5 mt-4">
              <div className="divide-x-2 flex w-full">
                <div className="flex flex-col w-full justify-start items-start pl-4">
                  <span className="font-semibold">{user.executions}</span>
                  <span className="font-bold opacity-50 text-sm">Trades</span>
                </div>
                <div className="flex flex-col w-full justify-start items-start pl-4">
                  <span className="font-semibold">{user.xp}</span>
                  <span className="font-bold opacity-50 text-sm">Paws</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      rank: index + 4,
    })),

    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full rounded-lg overflow-clip border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 rounded-t-lg">
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Paws</TableHead>
            <TableHead>Executions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
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
