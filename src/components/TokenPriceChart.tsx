
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Mock price data for different tokens
const tokenPriceData = {
  ethereum: {
    day: [
      { time: '00:00', price: 3300 },
      { time: '02:00', price: 3280 },
      { time: '04:00', price: 3310 },
      { time: '06:00', price: 3350 },
      { time: '08:00', price: 3370 },
      { time: '10:00', price: 3320 },
      { time: '12:00', price: 3330 },
      { time: '14:00', price: 3350 },
      { time: '16:00', price: 3360 },
      { time: '18:00', price: 3380 },
      { time: '20:00', price: 3410 },
      { time: '22:00', price: 3400 },
    ],
    week: [
      { time: 'Mon', price: 3300 },
      { time: 'Tue', price: 3280 },
      { time: 'Wed', price: 3320 },
      { time: 'Thu', price: 3350 },
      { time: 'Fri', price: 3380 },
      { time: 'Sat', price: 3410 },
      { time: 'Sun', price: 3400 },
    ],
    month: [
      { time: 'Week 1', price: 3200 },
      { time: 'Week 2', price: 3280 },
      { time: 'Week 3', price: 3350 },
      { time: 'Week 4', price: 3400 },
    ],
  },
  bitcoin: {
    day: [
      { time: '00:00', price: 62000 },
      { time: '02:00', price: 61800 },
      { time: '04:00', price: 62200 },
      { time: '06:00', price: 62500 },
      { time: '08:00', price: 63000 },
      { time: '10:00', price: 62800 },
      { time: '12:00', price: 62600 },
      { time: '14:00', price: 62700 },
      { time: '16:00', price: 63200 },
      { time: '18:00', price: 63500 },
      { time: '20:00', price: 63800 },
      { time: '22:00', price: 64000 },
    ],
    week: [
      { time: 'Mon', price: 62000 },
      { time: 'Tue', price: 62500 },
      { time: 'Wed', price: 63000 },
      { time: 'Thu', price: 63500 },
      { time: 'Fri', price: 63800 },
      { time: 'Sat', price: 64200 },
      { time: 'Sun', price: 64000 },
    ],
    month: [
      { time: 'Week 1', price: 60000 },
      { time: 'Week 2', price: 61500 },
      { time: 'Week 3', price: 63000 },
      { time: 'Week 4', price: 64000 },
    ],
  },
  solana: {
    day: [
      { time: '00:00', price: 70 },
      { time: '02:00', price: 69 },
      { time: '04:00', price: 71 },
      { time: '06:00', price: 72 },
      { time: '08:00', price: 73 },
      { time: '10:00', price: 71.5 },
      { time: '12:00', price: 72 },
      { time: '14:00', price: 73 },
      { time: '16:00', price: 73.5 },
      { time: '18:00', price: 74 },
      { time: '20:00', price: 74.5 },
      { time: '22:00', price: 74 },
    ],
    week: [
      { time: 'Mon', price: 70 },
      { time: 'Tue', price: 71 },
      { time: 'Wed', price: 72 },
      { time: 'Thu', price: 73 },
      { time: 'Fri', price: 74 },
      { time: 'Sat', price: 74.5 },
      { time: 'Sun', price: 74 },
    ],
    month: [
      { time: 'Week 1', price: 68 },
      { time: 'Week 2', price: 70 },
      { time: 'Week 3', price: 72 },
      { time: 'Week 4', price: 74 },
    ],
  },
};

interface TokenPriceChartProps {
  token: 'ethereum' | 'bitcoin' | 'solana';
  height?: number;
}

const TokenPriceChart: React.FC<TokenPriceChartProps> = ({ 
  token = 'ethereum',
  height = 200,
}) => {
  const [timeRange, setTimeRange] = useState('day');
  
  const tokenColors = {
    ethereum: {
      primary: "#627eea",
      secondary: "#d6e4ff"
    },
    bitcoin: {
      primary: "#f7931a",
      secondary: "#fff6e9"
    },
    solana: {
      primary: "#00ffbd",
      secondary: "#e6fff9"
    }
  };

  const chartConfig = {
    price: {
      label: `${token.charAt(0).toUpperCase() + token.slice(1)} Price (USD)`,
      theme: {
        light: tokenColors[token].primary,
        dark: tokenColors[token].primary
      }
    }
  };

  const tokenSymbols = {
    ethereum: 'ETH',
    bitcoin: 'BTC',
    solana: 'SOL'
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{tokenSymbols[token]} Price</CardTitle>
            <CardDescription>Historical price data</CardDescription>
          </div>
          <Tabs 
            defaultValue={timeRange}
            onValueChange={setTimeRange}
            className="pt-0"
          >
            <TabsList>
              <TabsTrigger value="day">24h</TabsTrigger>
              <TabsTrigger value="week">1W</TabsTrigger>
              <TabsTrigger value="month">1M</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: height }}>
          <ChartContainer config={chartConfig}>
            <AreaChart data={tokenPriceData[token][timeRange as keyof typeof tokenPriceData.ethereum]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                name="Price" 
                stroke={`var(--color-price)`} 
                fill={tokenColors[token].secondary}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenPriceChart;
