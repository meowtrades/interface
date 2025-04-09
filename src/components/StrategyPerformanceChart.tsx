
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data for different time periods
const timeRangeData = {
  week: [
    { date: 'Mon', smartDca: 0.5, gridTrading: 0.3 },
    { date: 'Tue', smartDca: 0.9, gridTrading: 0.7 },
    { date: 'Wed', smartDca: 0.7, gridTrading: 0.8 },
    { date: 'Thu', smartDca: 1.2, gridTrading: 1.0 },
    { date: 'Fri', smartDca: 1.8, gridTrading: 1.3 },
    { date: 'Sat', smartDca: 2.1, gridTrading: 1.5 },
    { date: 'Sun', smartDca: 2.1, gridTrading: 1.5 },
  ],
  month: [
    { date: 'Week 1', smartDca: 1.4, gridTrading: 0.9 },
    { date: 'Week 2', smartDca: 2.3, gridTrading: 1.7 },
    { date: 'Week 3', smartDca: 3.5, gridTrading: 2.6 },
    { date: 'Week 4', smartDca: 4.2, gridTrading: 3.1 },
  ],
  quarter: [
    { date: 'Jan', smartDca: 2.1, gridTrading: 1.5 },
    { date: 'Feb', smartDca: 4.5, gridTrading: 3.2 },
    { date: 'Mar', smartDca: 8.9, gridTrading: 7.6 },
  ],
  year: [
    { date: 'Q1', smartDca: 8.9, gridTrading: 7.6 },
    { date: 'Q2', smartDca: 15.7, gridTrading: 13.2 },
    { date: 'Q3', smartDca: 20.2, gridTrading: 18.3 },
    { date: 'Q4', smartDca: 28.4, gridTrading: 24.8 },
  ],
};

interface StrategyPerformanceChartProps {
  title?: string;
  description?: string;
  height?: number;
  data?: any;
}

const StrategyPerformanceChart: React.FC<StrategyPerformanceChartProps> = ({ 
  title = "Strategy Performance Comparison",
  description = "Compare performance between different strategies",
  height = 300,
  data = timeRangeData,
}) => {
  const [timeRange, setTimeRange] = useState('month');
  
  const chartConfig = {
    smartDca: {
      label: "Smart DCA",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    },
    gridTrading: {
      label: "Grid Trading",
      theme: {
        light: "#8b5cf6",
        dark: "#a78bfa"
      }
    },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <Tabs 
          defaultValue={timeRange}
          onValueChange={setTimeRange}
          className="pt-2"
        >
          <TabsList>
            <TabsTrigger value="week">1W</TabsTrigger>
            <TabsTrigger value="month">1M</TabsTrigger>
            <TabsTrigger value="quarter">3M</TabsTrigger>
            <TabsTrigger value="year">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div style={{ height: height }}>
          <ChartContainer config={chartConfig}>
            <LineChart data={data[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="smartDca" 
                name="Smart DCA" 
                stroke="var(--color-smartDca)" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="gridTrading" 
                name="Grid Trading" 
                stroke="var(--color-gridTrading)" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyPerformanceChart;
