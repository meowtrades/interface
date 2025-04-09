
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StrategyCardChartProps {
  data: { value: number }[];
  color: string;
}

const StrategyCardChart: React.FC<StrategyCardChartProps> = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2} 
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StrategyCardChart;
