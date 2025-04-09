
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Grid } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Mock strategy data
const mockStrategyData = {
  'plan1': {
    id: 'plan1',
    name: 'Smart DCA',
    token: 'BTC',
    icon: <RefreshCw size={18} />,
    iconBgColor: 'bg-blue-100',
    iconTextColor: 'text-crypto-blue',
    startDate: 'April 1, 2023',
    currentValue: 645.32,
    startingValue: 600.00,
    profit: 45.32,
    profitPercentage: 7.55,
    lastTransaction: '2 hours ago',
    status: 'active',
    priceHistory: [
      { date: '2023-04-01', value: 600, profit: 0 },
      { date: '2023-04-15', value: 605, profit: 5 },
      { date: '2023-05-01', value: 615, profit: 15 },
      { date: '2023-05-15', value: 590, profit: -10 },
      { date: '2023-06-01', value: 610, profit: 10 },
      { date: '2023-06-15', value: 625, profit: 25 },
      { date: '2023-07-01', value: 635, profit: 35 },
      { date: '2023-07-15', value: 630, profit: 30 },
      { date: '2023-08-01', value: 640, profit: 40 },
      { date: '2023-08-15', value: 645.32, profit: 45.32 }
    ],
    transactions: [
      { date: '2023-08-15', type: 'Buy', amount: '0.005 BTC', price: '$210.35', value: '$210.35' },
      { date: '2023-08-01', type: 'Buy', amount: '0.004 BTC', price: '$195.75', value: '$195.75' },
      { date: '2023-07-15', type: 'Buy', amount: '0.003 BTC', price: '$164.89', value: '$164.89' },
    ]
  },
  'plan2': {
    id: 'plan2',
    name: 'Grid Trading',
    token: 'ETH',
    icon: <Grid size={18} />,
    iconBgColor: 'bg-purple-100',
    iconTextColor: 'text-crypto-purple',
    startDate: 'March 15, 2023',
    currentValue: 600.50,
    startingValue: 400.00,
    profit: 200.50,
    profitPercentage: 50.13,
    lastTransaction: '5 hours ago',
    status: 'active',
    priceHistory: [
      { date: '2023-03-15', value: 400, profit: 0 },
      { date: '2023-03-30', value: 420, profit: 20 },
      { date: '2023-04-15', value: 435, profit: 35 },
      { date: '2023-04-30', value: 460, profit: 60 },
      { date: '2023-05-15', value: 480, profit: 80 },
      { date: '2023-05-30', value: 510, profit: 110 },
      { date: '2023-06-15', value: 535, profit: 135 },
      { date: '2023-06-30', value: 550, profit: 150 },
      { date: '2023-07-15', value: 580, profit: 180 },
      { date: '2023-07-30', value: 600.50, profit: 200.50 }
    ],
    transactions: [
      { date: '2023-07-30', type: 'Sell', amount: '0.12 ETH', price: '$185.21', value: '$185.21' },
      { date: '2023-07-15', type: 'Buy', amount: '0.15 ETH', price: '$172.45', value: '$172.45' },
      { date: '2023-06-30', type: 'Sell', amount: '0.10 ETH', price: '$155.33', value: '$155.33' },
      { date: '2023-06-15', type: 'Buy', amount: '0.18 ETH', price: '$182.75', value: '$182.75' },
    ]
  }
};

const StrategyDetail = () => {
  const { strategyId } = useParams();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    // In a real app, we would fetch the strategy data from an API
    // For now, we'll use our mock data
    if (strategyId && mockStrategyData[strategyId as keyof typeof mockStrategyData]) {
      setStrategy(mockStrategyData[strategyId as keyof typeof mockStrategyData]);
    } else {
      // If strategy doesn't exist, redirect to strategies page
      navigate('/app/strategies');
    }
  }, [strategyId, navigate]);

  if (!strategy) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading strategy data...</p>
        </div>
      </AppLayout>
    );
  }

  // Helper to format as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format dates for chart
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  // Filter data based on timeframe
  const getFilteredChartData = () => {
    const data = [...strategy.priceHistory];
    
    if (timeframe === 'week') {
      return data.slice(-2);
    } else if (timeframe === 'month') {
      return data.slice(-4);
    } else if (timeframe === '3month') {
      return data.slice(-6);
    }
    
    return data; // 'all' timeframe
  };
  
  const chartData = getFilteredChartData().map(item => ({
    ...item,
    date: formatDate(item.date)
  }));
  
  const isProfitable = strategy.profit > 0;

  return (
    <AppLayout>
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-slate-600 hover:text-slate-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${strategy.iconBgColor} ${strategy.iconTextColor} flex items-center justify-center`}>
              {strategy.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{strategy.name} - {strategy.token}</h1>
              <p className="text-slate-600">Started on {strategy.startDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full ${
              strategy.status === 'active' ? 'bg-green-100 text-crypto-green' : 'bg-amber-100 text-amber-600'
            } text-xs font-medium flex items-center gap-1`}>
              <div className={`w-2 h-2 ${
                strategy.status === 'active' ? 'bg-crypto-green' : 'bg-amber-600'
              } rounded-full`}></div>
              {strategy.status === 'active' ? 'Active' : 'Paused'}
            </div>
            
            <Button variant="destructive" size="sm">
              Stop Strategy
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Value</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(strategy.currentValue)}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Starting Value</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(strategy.startingValue)}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Profit/Loss</CardDescription>
            <CardTitle className={`text-2xl ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : '-'}{formatCurrency(Math.abs(strategy.profit))}
              <span className="text-sm ml-2">({strategy.profitPercentage.toFixed(2)}%)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className={`flex items-center gap-1 text-sm ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{strategy.profitPercentage.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Chart */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Performance History</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={timeframe === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('week')}
              >
                1W
              </Button>
              <Button 
                variant={timeframe === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('month')}
              >
                1M
              </Button>
              <Button 
                variant={timeframe === '3month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('3month')}
              >
                3M
              </Button>
              <Button 
                variant={timeframe === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('all')}
              >
                All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ChartContainer
              config={{
                value: {
                  label: "Portfolio Value",
                  theme: {
                    light: "#2563eb",
                    dark: "#3b82f6",
                  },
                },
                profit: {
                  label: "Profit/Loss",
                  theme: {
                    light: "#16a34a",
                    dark: "#22c55e",
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-value)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-value)", strokeWidth: 2 }}
                    name="value"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="profit" 
                    stroke="var(--color-profit)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-profit)", strokeWidth: 2 }}
                    name="profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>History of buys and sells for this strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-medium text-slate-500 py-3 px-4">Date</th>
                  <th className="text-left font-medium text-slate-500 py-3 px-4">Type</th>
                  <th className="text-left font-medium text-slate-500 py-3 px-4">Amount</th>
                  <th className="text-right font-medium text-slate-500 py-3 px-4">Price</th>
                  <th className="text-right font-medium text-slate-500 py-3 px-4">Value</th>
                </tr>
              </thead>
              <tbody>
                {strategy.transactions.map((transaction: any, index: number) => (
                  <tr key={index} className={index < strategy.transactions.length - 1 ? "border-b border-slate-100" : ""}>
                    <td className="py-3 px-4">{transaction.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'Buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type === 'Buy' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{transaction.amount}</td>
                    <td className="py-3 px-4 text-right">{transaction.price}</td>
                    <td className="py-3 px-4 text-right">{transaction.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default StrategyDetail;
