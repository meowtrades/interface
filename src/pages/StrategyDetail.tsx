import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Grid, Info, RefreshCcw } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  AreaChart, Area, Tooltip, Legend, BarChart, Bar 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import StrategyChart from '@/components/StrategyChart';

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

// Mock historical data for $1000 investment visualization
const mockHistoricalInvestmentData = {
  'plan1': [
    { date: '2022-09-01', value: 1000 },
    { date: '2022-10-01', value: 950 },
    { date: '2022-11-01', value: 1050 },
    { date: '2022-12-01', value: 1120 },
    { date: '2023-01-01', value: 1080 },
    { date: '2023-02-01', value: 1150 },
    { date: '2023-03-01', value: 1230 },
    { date: '2023-04-01', value: 1320 },
    { date: '2023-05-01', value: 1250 },
    { date: '2023-06-01', value: 1400 },
    { date: '2023-07-01', value: 1480 },
    { date: '2023-08-01', value: 1520 },
  ],
  'plan2': [
    { date: '2022-09-01', value: 1000 },
    { date: '2022-10-01', value: 1080 },
    { date: '2022-11-01', value: 1150 },
    { date: '2022-12-01', value: 1250 },
    { date: '2023-01-01', value: 1180 },
    { date: '2023-02-01', value: 1320 },
    { date: '2023-03-01', value: 1450 },
    { date: '2023-04-01', value: 1560 },
    { date: '2023-05-01', value: 1490 },
    { date: '2023-06-01', value: 1620 },
    { date: '2023-07-01', value: 1710 },
    { date: '2023-08-01', value: 1850 },
  ]
};

// Define types for our data
interface Transaction {
  date: string;
  type: string;
  amount: string;
  price: string;
  value: string;
}

interface PriceHistoryItem {
  date: string;
  value: number;
  profit: number;
}

interface Strategy {
  id: string;
  name: string;
  token: string;
  icon: JSX.Element;
  iconBgColor: string;
  iconTextColor: string;
  startDate: string;
  currentValue: number;
  startingValue: number;
  profit: number;
  profitPercentage: number;
  lastTransaction: string;
  status: string;
  priceHistory: PriceHistoryItem[];
  transactions: Transaction[];
}

const StrategyDetail = () => {
  const { strategyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [timeframe, setTimeframe] = useState('all');
  
  // Determine the source (dashboard or strategies page)
  const source = location.state?.source || 'strategies';
  const isPersonalView = source === 'dashboard';

  useEffect(() => {
    // In a real app, we would fetch the strategy data from an API
    // For now, we'll use our mock data
    if (strategyId && mockStrategyData[strategyId as keyof typeof mockStrategyData]) {
      setStrategy(mockStrategyData[strategyId as keyof typeof mockStrategyData] as Strategy);
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
  const getFilteredChartData = (selectedTimeframe: string) => {
    const data = [...strategy.priceHistory];
    
    if (selectedTimeframe === '7D' || selectedTimeframe === 'week') {
      return data.slice(-2);
    } else if (selectedTimeframe === '1M' || selectedTimeframe === 'month') {
      return data.slice(-4);
    } else if (selectedTimeframe === '3M' || selectedTimeframe === '3month') {
      return data.slice(-6);
    } else if (selectedTimeframe === '6M' || selectedTimeframe === '6month') {
      return data.slice(-8);
    }
    
    return data; // '1Y' or 'all' timeframe
  };
  
  const chartData = getFilteredChartData(timeframe).map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  // Handle timeframe changes from the chart component
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe === '7D' ? 'week' :
                newTimeframe === '1M' ? 'month' :
                newTimeframe === '3M' ? '3month' :
                newTimeframe === '6M' ? '6month' : 'all');
  };

  // Format historical investment data
  const historicalInvestmentData = mockHistoricalInvestmentData[strategyId as keyof typeof mockHistoricalInvestmentData]
    ?.map(item => ({
      ...item,
      date: new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(new Date(item.date))
    }));
  
  const isProfitable = strategy.profit > 0;
  const initialInvestment = 1000; // For the historical investment visualization
  const finalInvestment = historicalInvestmentData?.[historicalInvestmentData.length - 1]?.value || initialInvestment;
  const investmentReturn = ((finalInvestment - initialInvestment) / initialInvestment * 100).toFixed(2);

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
              <p className="text-slate-600">
                {isPersonalView 
                  ? `Started on ${strategy.startDate}` 
                  : `Performance overview of ${strategy.name} strategy for ${strategy.token}`
                }
              </p>
            </div>
          </div>
          
          {isPersonalView && (
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
          )}
        </div>
      </div>
      
      {isPersonalView ? (
        // Personal investment view (from Dashboard)
        <>
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
                  {isProfitable ? '+' : '-'}{formatCurrency(Math.abs(strategy.profit))} ({strategy.profitPercentage.toFixed(2)}%)
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className={`flex items-center gap-1 text-sm ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                  {isProfitable ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>Last transaction: {strategy.lastTransaction}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <StrategyChart
              title={strategy.name}
              value={strategy.currentValue}
              percentChange={strategy.profitPercentage}
              period="1m"
              data={chartData}
              riskLevel="Medium"
              tags={['Automated', 'Long-term', 'Beginner-friendly']}
              onTimeframeChange={handleTimeframeChange}
            />
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {strategy.transactions.map((tx: Transaction, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">{tx.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          tx.type === 'Buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{tx.amount}</td>
                      <td className="px-4 py-3">{tx.price}</td>
                      <td className="px-4 py-3 text-right">{tx.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // General strategy view (from Strategies page)
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardDescription>Strategy Type</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${strategy.iconBgColor} ${strategy.iconTextColor} flex items-center justify-center`}>
                    {strategy.icon}
                  </div>
                  {strategy.name}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Asset</CardDescription>
                <CardTitle>{strategy.token}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Trading Frequency</CardDescription>
                <CardTitle>{strategy.name === 'Smart DCA' ? 'Weekly intervals' : 'Continuous'}</CardTitle>
              </CardHeader>
            </Card>
          </div>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>If You Had Invested $1,000 One Year Ago</CardTitle>
                <CardDescription>How $1000 invested a year ago in this strategy would have performed</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ value: { color: '#4f46e5' } }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={historicalInvestmentData}>
                      <defs>
                        <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        domain={[
                          Math.floor(Math.min(...historicalInvestmentData.map(d => d.value)) * 0.95), 
                          Math.ceil(Math.max(...historicalInvestmentData.map(d => d.value)) * 1.05)
                        ]}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Value']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#4f46e5" 
                        fillOpacity={1} 
                        fill="url(#colorHistorical)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-slate-500">Initial Investment</div>
                    <div className="text-lg font-medium">${initialInvestment.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-[2px] bg-slate-200"></div>
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                      <TrendingUp size={16} />
                    </div>
                    <div className="w-16 h-[2px] bg-slate-200"></div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Current Value</div>
                    <div className="text-lg font-medium">${finalInvestment.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info size={18} />
                  Strategy Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategy.name === 'Smart DCA' ? (
                    <>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-crypto-blue flex items-center justify-center mt-1">
                          <RefreshCw size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Automated Investments</h3>
                          <p className="text-slate-600 text-sm">System automatically invests at regular intervals, removing emotion from decisions.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-crypto-blue flex items-center justify-center mt-1">
                          <TrendingDown size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Market Timing Optimization</h3>
                          <p className="text-slate-600 text-sm">AI algorithms analyze market conditions to optimize entry points.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-crypto-blue flex items-center justify-center mt-1">
                          <RefreshCcw size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Dynamic Allocation</h3>
                          <p className="text-slate-600 text-sm">Buys more when prices dip, less when they surge, improving average entry price.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-crypto-purple flex items-center justify-center mt-1">
                          <Grid size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Price Range Trading</h3>
                          <p className="text-slate-600 text-sm">Places automated buy and sell orders at preset price levels across a range.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-crypto-purple flex items-center justify-center mt-1">
                          <TrendingUp size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Profit from Volatility</h3>
                          <p className="text-slate-600 text-sm">Strategy performs best during sideways and volatile markets by repeatedly buying low and selling high.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-crypto-purple flex items-center justify-center mt-1">
                          <RefreshCcw size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Continuous Rebalancing</h3>
                          <p className="text-slate-600 text-sm">Automatically resets positions after completing buy-sell cycles for ongoing returns.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mb-8">
            <Button className="w-full max-w-md bg-crypto-blue hover:bg-crypto-blue/90">
              Start This Strategy
            </Button>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default StrategyDetail;
