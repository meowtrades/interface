import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { ChartData } from "./types";

interface StrategyChartProps {
  data: ChartData;
  isLoading: boolean;
  error: any;
  validRanges: { label: string; value: string }[];
  currentRange: string;
  onRangeChange: (range: string) => void;
}

export const StrategyChart = ({
  data,
  isLoading,
  error,
  validRanges,
  currentRange,
  onRangeChange,
}: StrategyChartProps) => {
  // Format dates for chart
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Performance</h3>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
          {validRanges.map((rangeOption) => (
            <Button
              key={rangeOption.value}
              variant={currentRange === rangeOption.value ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => onRangeChange(rangeOption.value)}
            >
              {rangeOption.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            Error loading chart data: {error.message}
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : data?.waiting ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-600">
              Data is still being processed. Please check back later.
            </p>
          </div>
        ) : data?.data ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.data.slice(-parseInt(currentRange.split("d")[0]))}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                dataKey="value"
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                width={60}
              />
              <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">No chart data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 