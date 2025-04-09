
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for chart
const mockData = [
  { date: 'Mar 10', value: 9800 },
  { date: 'Mar 15', value: 10200 },
  { date: 'Mar 20', value: 10600 },
  { date: 'Mar 25', value: 11200 },
  { date: 'Mar 30', value: 10800 },
  { date: 'Apr 01', value: 10400 },
  { date: 'Apr 05', value: 10900 },
  { date: 'Apr 10', value: 11500 },
];

const MockTradingChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={mockData}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis 
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={value => `$${value.toLocaleString()}`}
        />
        <Tooltip 
          formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ 
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#8B5CF6" 
          fillOpacity={1} 
          fill="url(#colorValue)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MockTradingChart;
