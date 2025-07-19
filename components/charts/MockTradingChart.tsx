import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for chart - matching values from the image
const mockData = [
  { date: 'Mar 10', value: 8773 },
  { date: 'Mar 15', value: 9400 },
  { date: 'Mar 20', value: 10300 },
  { date: 'Mar 25', value: 10800 },
  { date: 'Mar 30', value: 10600 },
  { date: 'Apr 01', value: 10400 },
  { date: 'Apr 05', value: 10800 },
  { date: 'Apr 10', value: 11500 },
];

const MockTradingChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={mockData}
        margin={{
          top: 10,
          right: 15,
          left: 0,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a687ff" stopOpacity={0.55}/>
            <stop offset="95%" stopColor="#a687ff" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={value => `$${value.toLocaleString()}`}
          domain={['dataMin - 1000', 'dataMax + 1000']}
          ticks={[0, 3000, 6000, 9000, 12000]}
        />
        <Tooltip 
          formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
          contentStyle={{ 
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#9a71ff" 
          strokeWidth={2}
          fill="url(#colorValue)" 
          dot={false}
          activeDot={{ r: 6, stroke: "#FFF", strokeWidth: 2, fill: "#9a71ff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MockTradingChart;
