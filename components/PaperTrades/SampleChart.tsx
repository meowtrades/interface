import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const generateMockChartData = (timeframe: string) => {
  const currentDate = new Date();
  const data = [];
  let value = 1000;

  if (timeframe === "7d") {
    // 7 days data - daily points
    for (let i = 7; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Add some randomness to the value
      value = value * (1 + (Math.random() * 0.02 - 0.01));
      data.push({ date: formattedDate, value: Math.round(value) });
    }
  } else if (timeframe === "1m") {
    // 1 month data - daily points
    for (let i = 30; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Add some randomness to the value
      value = value * (1 + (Math.random() * 0.03 - 0.01));
      data.push({ date: formattedDate, value: Math.round(value) });
    }
  } else if (timeframe === "3m") {
    // 3 months data - every 3 days
    for (let i = 90; i >= 0; i -= 3) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      value = value * (1 + (Math.random() * 0.04 - 0.015));
      data.push({ date: formattedDate, value: Math.round(value) });
    }
  }

  // Make a new array that shows cumulative till that date
  // Try to decrease linearity of chart, start linear then move a little flat
  const output: { date: string; value: number }[] = [];

  let cumulativeValue = 0;
  data.forEach((point, index) => {
    cumulativeValue += (point.value * (1 + Math.random() * 2)) / (index + 1); // Add some randomness
    output.push({ date: point.date, value: cumulativeValue });
  });

  return output;
};

const SampleChart = () => {
  const [chartTimeframe, setChartTimeframe] = useState("1m");
  const [chartData, setChartData] = useState(generateMockChartData("1m"));

  const handleTimeframeChange = (timeframe: string) => {
    setChartTimeframe(timeframe);
    setChartData(generateMockChartData(timeframe));
  };

  return (
    <Card className="w-full lg:w-2/3 shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300">
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="text-xl font-bold text-contrast-high">
          Smart DCA Performance
        </CardTitle>
        <CardDescription className="text-contrast-medium">
          How $10 daily investment would have performed over time
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex justify-end space-x-2 mb-6">
          <Button
            variant={chartTimeframe === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange("7d")}
            className={
              chartTimeframe === "7d"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-sm"
                : "border-2 text-contrast-high font-medium hover:bg-purple-50 transition-colors"
            }
          >
            7D
          </Button>
          <Button
            variant={chartTimeframe === "1m" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange("1m")}
            className={
              chartTimeframe === "1m"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-sm"
                : "border-2 text-contrast-high font-medium hover:bg-purple-50 transition-colors"
            }
          >
            1M
          </Button>
          <Button
            variant={chartTimeframe === "3m" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange("3m")}
            className={
              chartTimeframe === "3m"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-sm"
                : "border-2 text-contrast-high font-medium hover:bg-purple-50 transition-colors"
            }
          >
            3M
          </Button>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="colorPerformance"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#9a71ff" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#9a71ff" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                domain={["dataMin - 200", "dataMax + 200"]}
              />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Value"]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#colorPerformance)"
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "#FFF",
                  strokeWidth: 2,
                  fill: "#8b5cf6",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SampleChart;
