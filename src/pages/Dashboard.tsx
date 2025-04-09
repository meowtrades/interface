
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowRight, BarChart2, Zap } from 'lucide-react';
import StrategyPopup from '@/components/StrategyPopup';

const Dashboard = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [activeStrategies, setActiveStrategies] = useState(0);
  const [mockTrades, setMockTrades] = useState(0);
  const [showStrategyPopup, setShowStrategyPopup] = useState(false);
  
  useEffect(() => {
    // Mock data
    setTotalValue(1245.82);
    setTotalInvested(1000);
    setTotalProfit(245.82);
    setActiveStrategies(2);
    setMockTrades(3);
    
    // Check if we should show strategy popup
    const shouldShowPopup = localStorage.getItem('showStrategyPopup') === 'true';
    if (shouldShowPopup) {
      setShowStrategyPopup(true);
      // Clear the flag
      localStorage.removeItem('showStrategyPopup');
    }
  }, []);

  const profitPercentage = ((totalProfit / totalInvested) * 100).toFixed(2);
  const isProfitable = totalProfit > 0;

  const mockActivePlans = [
    {
      id: 'plan1',
      type: 'Smart DCA',
      token: 'BTC',
      value: 645.32,
      profit: 45.32,
      profitPercentage: 7.55,
      starting: 600,
    },
    {
      id: 'plan2',
      type: 'Grid Trading',
      token: 'ETH',
      value: 600.50,
      profit: 200.50,
      profitPercentage: 50.13,
      starting: 400,
    }
  ];
  
  const mockRecentActivities = [
    {
      id: 'act1',
      type: 'Buy',
      token: 'BTC',
      amount: '0.005 BTC',
      value: '$210.35',
      time: '2 hours ago',
    },
    {
      id: 'act2',
      type: 'Sell',
      token: 'ETH',
      amount: '0.12 ETH',
      value: '$185.21',
      time: '5 hours ago',
    },
    {
      id: 'act3',
      type: 'Buy',
      token: 'BTC',
      amount: '0.008 BTC',
      value: '$336.56',
      time: '1 day ago',
    }
  ];

  const handleStrategyStart = (strategyData: { amount: number; token: string }) => {
    console.log('Starting strategy with:', strategyData);
    // In a real app, you'd make an API call to start the strategy
    // For now, we'll just update the state to simulate adding a new strategy
    setActiveStrategies(prev => prev + 1);
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your trading overview.</p>
      </div>
      
      {/* Strategy Popup */}
      <StrategyPopup
        open={showStrategyPopup}
        onOpenChange={setShowStrategyPopup}
        onConfirm={handleStrategyStart}
      />
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Portfolio Value</CardDescription>
            <CardTitle className="text-2xl">${totalValue.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className={`flex items-center gap-1 text-sm ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{profitPercentage}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Invested</CardDescription>
            <CardTitle className="text-2xl">${totalInvested.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-sm text-slate-500">Across all strategies</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Profit/Loss</CardDescription>
            <CardTitle className={`text-2xl ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : '-'}${Math.abs(totalProfit).toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className={`flex items-center gap-1 text-sm ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{profitPercentage}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Strategies</CardDescription>
            <CardTitle className="text-2xl">{activeStrategies}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-sm text-slate-500">{mockTrades} mock trades</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Plans */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Plans</h2>
          <Link to="/app/strategies" className="text-blue-600 text-sm flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockActivePlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardDescription>{plan.type}</CardDescription>
                    <CardTitle className="text-xl">{plan.token}</CardTitle>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                    plan.type === 'Smart DCA' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {plan.type}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Current Value</span>
                    <span className="font-medium">${plan.value.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Starting Value</span>
                    <span className="font-medium">${plan.starting.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Profit/Loss</span>
                    <span className={`font-medium ${plan.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {plan.profit >= 0 ? '+' : '-'}${Math.abs(plan.profit).toFixed(2)} ({plan.profitPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/app/strategies/${plan.id}`} className="w-full">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Start a New Strategy</h3>
              <p className="text-slate-500 text-sm text-center mb-4">
                Choose from our one-click trading strategies to grow your portfolio
              </p>
              <Button 
                onClick={() => setShowStrategyPopup(true)}
                className="bg-gradient-to-r from-meow-paw to-meow-tabby text-white hover:opacity-90"
              >
                Start New Strategy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Link to="/app/activity" className="text-crypto-blue text-sm flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {mockRecentActivities.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'Buy' ? 'bg-green-100 text-crypto-green' : 'bg-red-100 text-crypto-red'
                    }`}>
                      {activity.type === 'Buy' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <div className="font-medium">
                        {activity.type} {activity.token}
                      </div>
                      <div className="text-sm text-slate-500">
                        {activity.amount} • {activity.time}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">
                    {activity.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
