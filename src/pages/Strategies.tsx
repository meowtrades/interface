import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { BarChart2, ArrowRight, Info, RefreshCw, Grid, TrendingUp, Clock, RefreshCcw } from 'lucide-react';
import StrategyPerformanceChart from '@/components/StrategyPerformanceChart';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from 'recharts';

// Mock historical performance data
const performanceData = {
  "smartDca": {
    "btc": {
      "year": 32.5,
      "sixMonths": 18.3,
      "threeMonths": 12.1,
      "month": 5.4,
      "week": 2.1
    },
    "eth": {
      "year": 28.4,
      "sixMonths": 15.7,
      "threeMonths": 9.8,
      "month": 4.2,
      "week": 1.8
    }
  },
  "gridTrading": {
    "btc": {
      "year": 24.8,
      "sixMonths": 14.5,
      "threeMonths": 8.9,
      "month": 3.7,
      "week": 1.5
    },
    "eth": {
      "year": 22.6,
      "sixMonths": 13.2,
      "threeMonths": 7.6,
      "month": 3.1,
      "week": 1.3
    }
  }
};

const Strategies = () => {
  const [token, setToken] = useState("btc");
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trading Strategies</h1>
        <p className="text-slate-600">Explore and launch one-click trading strategies.</p>
      </div>
      
      {/* Strategy Performance Chart */}
      <div className="mb-8">
        <StrategyPerformanceChart />
      </div>
      
      <Tabs defaultValue="available" className="mb-8">
        <TabsList>
          <TabsTrigger value="available">Available Strategies</TabsTrigger>
          <TabsTrigger value="active">Active Strategies (2)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="pt-6">
          {/* Strategy Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Smart DCA Strategy */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-crypto-blue flex items-center justify-center">
                        <RefreshCw size={20} />
                      </div>
                      <CardTitle>Smart DCA Strategy</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      Dollar-cost averaging enhanced by market timing algorithms
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-2">Strategy Features</div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-crypto-blue flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span>Automated investments at regular intervals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-crypto-blue flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span>AI-driven market timing optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-crypto-blue flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span>Buy more when prices dip, less when they rise</span>
                    </li>
                  </ul>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>Historical Performance</span>
                      <Info size={14} className="text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setToken("btc")}
                        className={`px-2 py-1 text-xs rounded ${token === "btc" ? 'bg-blue-100 text-crypto-blue' : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        BTC
                      </button>
                      <button 
                        onClick={() => setToken("eth")}
                        className={`px-2 py-1 text-xs rounded ${token === "eth" ? 'bg-blue-100 text-crypto-blue' : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        ETH
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { label: '1 Year', data: performanceData.smartDca[token as keyof typeof performanceData.smartDca].year },
                      { label: '6 Months', data: performanceData.smartDca[token as keyof typeof performanceData.smartDca].sixMonths },
                      { label: '3 Months', data: performanceData.smartDca[token as keyof typeof performanceData.smartDca].threeMonths },
                      { label: '1 Month', data: performanceData.smartDca[token as keyof typeof performanceData.smartDca].month },
                      { label: '7 Days', data: performanceData.smartDca[token as keyof typeof performanceData.smartDca].week }
                    ].map((period, index) => (
                      <div key={index} className="bg-slate-50 p-3 rounded-lg text-center">
                        <div className="text-crypto-green font-medium text-lg">{`+${period.data}%`}</div>
                        <div className="text-xs text-slate-500">{period.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 sm:flex-row">
                <Link to="/app/strategies/smart-dca/start" className="w-full">
                  <Button className="w-full bg-crypto-blue hover:bg-crypto-blue/90">
                    Start Strategy
                  </Button>
                </Link>
                <Link to="/app/strategies/smart-dca/details" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Grid Trading Strategy */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-crypto-purple flex items-center justify-center">
                        <Grid size={20} />
                      </div>
                      <CardTitle>Grid Trading Strategy</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      Automated buy-low, sell-high across a price range
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-2">Strategy Features</div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 text-crypto-purple flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span>Profit from market volatility</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 text-crypto-purple flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span>Automated buy and sell orders at preset levels</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 text-crypto-purple flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span>Works well in sideways and ranging markets</span>
                    </li>
                  </ul>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>Historical Performance</span>
                      <Info size={14} className="text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setToken("btc")}
                        className={`px-2 py-1 text-xs rounded ${token === "btc" ? 'bg-purple-100 text-crypto-purple' : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        BTC
                      </button>
                      <button 
                        onClick={() => setToken("eth")}
                        className={`px-2 py-1 text-xs rounded ${token === "eth" ? 'bg-purple-100 text-crypto-purple' : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        ETH
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { label: '1 Year', data: performanceData.gridTrading[token as keyof typeof performanceData.gridTrading].year },
                      { label: '6 Months', data: performanceData.gridTrading[token as keyof typeof performanceData.gridTrading].sixMonths },
                      { label: '3 Months', data: performanceData.gridTrading[token as keyof typeof performanceData.gridTrading].threeMonths },
                      { label: '1 Month', data: performanceData.gridTrading[token as keyof typeof performanceData.gridTrading].month },
                      { label: '7 Days', data: performanceData.gridTrading[token as keyof typeof performanceData.gridTrading].week }
                    ].map((period, index) => (
                      <div key={index} className="bg-slate-50 p-3 rounded-lg text-center">
                        <div className="text-crypto-green font-medium text-lg">{`+${period.data}%`}</div>
                        <div className="text-xs text-slate-500">{period.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 sm:flex-row">
                <Link to="/app/strategies/grid-trading/start" className="w-full">
                  <Button className="w-full bg-crypto-purple hover:bg-crypto-purple/90">
                    Start Strategy
                  </Button>
                </Link>
                <Link to="/app/strategies/grid-trading/details" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Smart DCA Strategy */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-crypto-blue flex items-center justify-center">
                        <RefreshCw size={20} />
                      </div>
                      <CardTitle>Smart DCA - BTC</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      Started on April 1, 2023
                    </CardDescription>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-crypto-green text-xs font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-crypto-green rounded-full"></div>
                    Active
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Current Value</div>
                    <div className="font-medium">$645.32</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Starting Value</div>
                    <div className="font-medium">$600.00</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Total Profit</div>
                    <div className="font-medium text-crypto-green">+$45.32 (7.55%)</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Last Transaction</div>
                    <div className="font-medium">2 hours ago</div>
                  </div>
                </div>
                
                {/* Replace placeholder with actual chart */}
                <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  {/* Small performance chart for strategy */}
                  <div className="w-full h-full">
                    <ChartContainer config={{
                      value: {
                        label: "BTC Strategy Value",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6"
                        }
                      }
                    }}>
                      <AreaChart data={[
                        { day: '1', value: 600 },
                        { day: '2', value: 605 },
                        { day: '3', value: 598 },
                        { day: '4', value: 610 },
                        { day: '5', value: 620 },
                        { day: '6', value: 635 },
                        { day: '7', value: 645 },
                      ]}>
                        <XAxis dataKey="day" />
                        <YAxis hide />
                        <Area type="monotone" dataKey="value" fill="#dbeafe" fillOpacity={0.8} stroke="var(--color-value)" />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 sm:flex-row">
                <Button variant="destructive" className="w-full">
                  Stop Strategy
                </Button>
                <Link to="/app/strategies/smart-dca/details/plan1" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Active Grid Trading Strategy */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-crypto-purple flex items-center justify-center">
                        <Grid size={20} />
                      </div>
                      <CardTitle>Grid Trading - ETH</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      Started on March 15, 2023
                    </CardDescription>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-crypto-green text-xs font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-crypto-green rounded-full"></div>
                    Active
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Current Value</div>
                    <div className="font-medium">$600.50</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Starting Value</div>
                    <div className="font-medium">$400.00</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Total Profit</div>
                    <div className="font-medium text-crypto-green">+$200.50 (50.13%)</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Last Transaction</div>
                    <div className="font-medium">5 hours ago</div>
                  </div>
                </div>
                
                {/* Replace placeholder with actual chart */}
                <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  {/* Small performance chart for strategy */}
                  <div className="w-full h-full">
                    <ChartContainer config={{
                      value: {
                        label: "ETH Strategy Value",
                        theme: {
                          light: "#a855f7",
                          dark: "#a855f7"
                        }
                      }
                    }}>
                      <AreaChart data={[
                        { day: '1', value: 400 },
                        { day: '2', value: 420 },
                        { day: '3', value: 450 },
                        { day: '4', value: 480 },
                        { day: '5', value: 520 },
                        { day: '6', value: 580 },
                        { day: '7', value: 600 },
                      ]}>
                        <XAxis dataKey="day" />
                        <YAxis hide />
                        <Area type="monotone" dataKey="value" fill="#f3e8ff" fillOpacity={0.8} stroke="var(--color-value)" />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 sm:flex-row">
                <Button variant="destructive" className="w-full">
                  Stop Strategy
                </Button>
                <Link to="/app/strategies/grid-trading/details/plan2" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Strategies;
