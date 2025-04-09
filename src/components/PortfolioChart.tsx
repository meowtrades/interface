
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data for the portfolio chart
const portfolioData = [
  { date: 'Jan', value: 1000, profit: 0 },
  { date: 'Feb', value: 1050, profit: 50 },
  { date: 'Mar', value: 1130, profit: 80 },
  { date: 'Apr', value: 1080, profit: -50 },
  { date: 'May', value: 1180, profit: 100 },
  { date: 'Jun', value: 1270, profit: 90 },
  { date: 'Jul', value: 1300, profit: 30 },
  { date: 'Aug', value: 1390, profit: 90 },
  { date: 'Sep', value: 1320, profit: -70 },
  { date: 'Oct', value: 1450, profit: 130 }
];

interface PortfolioChartProps {
  title?: string;
  description?: string;
  data?: any[];
  type?: 'line' | 'area' | 'bar';
  height?: number;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  title = "Portfolio Performance", 
  description = "Your portfolio value over time",
  data = portfolioData,
  type = 'area',
  height = 250
}) => {
  const chartConfig = {
    value: {
      label: "Value",
      theme: {
        light: "#22c55e",
        dark: "#22c55e"
      }
    },
    profit: {
      label: "Profit/Loss",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: height }}>
          <ChartContainer config={chartConfig}>
            {type === 'line' && (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="value" name="Value" stroke="var(--color-value)" />
                <Line type="monotone" dataKey="profit" name="Profit/Loss" stroke="var(--color-profit)" />
              </LineChart>
            )}
            {type === 'area' && (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area type="monotone" dataKey="value" name="Value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.2} />
              </AreaChart>
            )}
            {type === 'bar' && (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" name="Value" fill="var(--color-value)" />
                <Bar dataKey="profit" name="Profit/Loss" fill="var(--color-profit)" />
              </BarChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioChart;
