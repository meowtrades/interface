import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface DataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

interface StrategyChartProps {
  title: string;
  value: number;
  percentChange: number;
  period: string;
  data: DataPoint[];
  riskLevel?: 'Low' | 'Medium' | 'High';
  tags?: string[];
  onTimeframeChange?: (timeframe: string) => void;
}

const StrategyChart = ({
  title,
  value,
  percentChange,
  period,
  data,
  riskLevel = 'Medium',
  tags = ['Automated', 'Long-term', 'Beginner-friendly'],
  onTimeframeChange
}: StrategyChartProps) => {
  const [timeframe, setTimeframe] = useState('1M');
  const [filteredData, setFilteredData] = useState<DataPoint[]>(data);
  const isProfitable = percentChange >= 0;
  
  // Format values for display
  const formattedValue = value.toFixed(2);
  const formattedPercentChange = Math.abs(percentChange).toFixed(2);
  
  // Handle timeframe changes
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    } else {
      // Default filtering if no external handler provided
      filterDataByTimeframe(newTimeframe);
    }
  };
  
  // Filter data based on timeframe
  const filterDataByTimeframe = (frame: string) => {
    if (!data || data.length === 0) return;
    
    let filtered;
    switch (frame) {
      case '7D':
        filtered = data.slice(-7);
        break;
      case '1M':
        filtered = data.slice(-30);
        break;
      case '3M':
        filtered = data.slice(-90);
        break;
      case '6M':
        filtered = data.slice(-180);
        break;
      case '1Y':
      default:
        filtered = data;
        break;
    }
    
    setFilteredData(filtered);
  };
  
  // Initialize filtered data
  useEffect(() => {
    if (data) {
      filterDataByTimeframe(timeframe);
    }
  }, [data]);
  
  if (!data || data.length === 0) {
    return <Card className="w-full p-6 text-center">No data available</Card>;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">${formattedValue}</CardTitle>
            <CardDescription className={`flex items-center ${isProfitable ? 'text-green-500' : 'text-red-500'} font-medium`}>
              {isProfitable ? "+" : "-"}{formattedPercentChange}% 
              <span className="text-slate-500 font-normal ml-1">({period})</span>
            </CardDescription>
          </div>
          <div className="px-4 py-2 rounded-full bg-slate-100 text-slate-800 text-sm font-medium">
            {riskLevel} Risk
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-end mb-4 -mt-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <Button 
              onClick={() => handleTimeframeChange('7D')}
              variant="ghost" 
              size="sm"
              className={`rounded-md px-3 py-1 h-auto ${timeframe === '7D' ? 'bg-white shadow-sm' : ''}`}
            >
              7D
            </Button>
            <Button 
              onClick={() => handleTimeframeChange('1M')} 
              variant="ghost" 
              size="sm"
              className={`rounded-md px-3 py-1 h-auto ${timeframe === '1M' ? 'bg-white shadow-sm' : ''}`}
            >
              1M
            </Button>
            <Button 
              onClick={() => handleTimeframeChange('3M')} 
              variant="ghost" 
              size="sm"
              className={`rounded-md px-3 py-1 h-auto ${timeframe === '3M' ? 'bg-white shadow-sm' : ''}`}
            >
              3M
            </Button>
            <Button 
              onClick={() => handleTimeframeChange('6M')} 
              variant="ghost" 
              size="sm"
              className={`rounded-md px-3 py-1 h-auto ${timeframe === '6M' ? 'bg-white shadow-sm' : ''}`}
            >
              6M
            </Button>
            <Button 
              onClick={() => handleTimeframeChange('1Y')} 
              variant="ghost" 
              size="sm"
              className={`rounded-md px-3 py-1 h-auto ${timeframe === '1Y' ? 'bg-white shadow-sm' : ''}`}
            >
              1Y
            </Button>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Value']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: 'none',
                  padding: '8px 12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#22c55e" 
                strokeWidth={2}
                fill="url(#colorValue)"
                dot={false}
                activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-2 mt-4">
          {tags.map((tag, index) => (
            <div key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
              {tag}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyChart; 