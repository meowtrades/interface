
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Plus, AlertCircle, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';

const MockTrades = () => {
  const [amount, setAmount] = useState('100');
  const [selectedStrategy, setSelectedStrategy] = useState('smartDca');
  const [selectedToken, setSelectedToken] = useState('btc');
  const [riskLevel, setRiskLevel] = useState('moderate');
  
  const handleStartMockTrade = () => {
    toast.success("Mock trade started successfully!", {
      description: "You can track its performance in the Active Trades tab."
    });
  };
  
  const mockActiveTrades = [
    {
      id: 'mock1',
      type: 'Smart DCA',
      token: 'BTC',
      startDate: 'Mar 28, 2023',
      startAmount: 100,
      currentValue: 145.32,
      profit: 45.32,
      profitPercentage: 45.32,
    },
    {
      id: 'mock2',
      type: 'Grid Trading',
      token: 'ETH',
      startDate: 'Apr 1, 2023',
      startAmount: 100,
      currentValue: 124.80,
      profit: 24.80,
      profitPercentage: 24.80,
    },
    {
      id: 'mock3',
      type: 'Smart DCA',
      token: 'ETH',
      startDate: 'Apr 3, 2023',
      startAmount: 100,
      currentValue: 98.50,
      profit: -1.50,
      profitPercentage: -1.50,
    }
  ];
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mock Trades</h1>
        <p className="text-slate-600">Test strategies with virtual funds before investing real money.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Start a Mock Trade</CardTitle>
            <CardDescription>
              Simulate how a strategy would perform with $100 in virtual funds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5 text-slate-700">Amount</label>
              <Input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="focus:border-crypto-blue"
                placeholder="Enter amount"
              />
              <p className="text-xs text-slate-500 mt-1">Default mock amount is $100</p>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1.5 text-slate-700">Strategy</label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartDca">Smart DCA</SelectItem>
                  <SelectItem value="gridTrading">Grid Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1.5 text-slate-700">Token</label>
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1.5 text-slate-700">Risk Level</label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-slate-700">
              <AlertCircle size={18} className="text-crypto-blue" />
              <p className="text-sm">
                This is a simulation using historical data. Past performance does not guarantee future results.
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleStartMockTrade}
              className="w-full bg-crypto-blue hover:bg-crypto-blue/90"
            >
              Start Mock Trade
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Strategy Performance</CardTitle>
            <CardDescription>
              How a $100 investment would have performed over time
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[320px] flex items-center justify-center bg-slate-50 rounded-lg">
            <div className="text-center text-slate-500">
              <BarChart2 size={48} className="mx-auto mb-2" />
              <p className="text-sm">Select a strategy and token to view performance</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-6">Your Mock Trades</h2>
      
      <Tabs defaultValue="active" className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active Trades ({mockActiveTrades.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Trades (2)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockActiveTrades.map((trade) => (
              <Card key={trade.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full ${
                        trade.type === 'Smart DCA' ? 
                        'bg-blue-100 text-crypto-blue' : 
                        'bg-purple-100 text-crypto-purple'
                      } flex items-center justify-center`}>
                        {trade.type === 'Smart DCA' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      </div>
                      <div>
                        <CardTitle className="text-md">{trade.type}</CardTitle>
                        <CardDescription>{trade.token} • Started {trade.startDate}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Initial Amount</span>
                      <span className="font-medium">${trade.startAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Current Value</span>
                      <span className="font-medium">${trade.currentValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Profit/Loss</span>
                      <span className={`font-medium ${
                        trade.profit >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                      }`}>
                        {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)} ({
                          trade.profit >= 0 ? '+' : ''
                        }{trade.profitPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-slate-400">Performance Chart</span>
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{trade.type} - {trade.token} Mock Trade</DialogTitle>
                        <DialogDescription>Detailed performance of your mock trade</DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-400">Detailed Performance Chart</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Start Date</label>
                            <p className="text-sm text-slate-600">{trade.startDate}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Initial Investment</label>
                            <p className="text-sm text-slate-600">${trade.startAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Current Value</label>
                            <p className="text-sm text-slate-600">${trade.currentValue.toFixed(2)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Profit/Loss</label>
                            <p className={`text-sm ${
                              trade.profit >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                            }`}>
                              {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)} ({
                                trade.profit >= 0 ? '+' : ''
                              }{trade.profitPercentage.toFixed(2)}%)
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Trading Activity</label>
                          <div className="bg-slate-50 p-3 rounded-lg mt-1 text-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Apr 7, 2023</span>
                              <span className="text-crypto-green">Buy: $25.20</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Apr 5, 2023</span>
                              <span className="text-crypto-red">Sell: $27.80</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Apr 3, 2023</span>
                              <span className="text-crypto-green">Buy: $23.50</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" className="w-full">
                          Convert to Real Trade
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="destructive" className="w-full">Stop</Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add New Mock Trade Card */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex flex-col items-center justify-center h-full">
                  <CardContent className="flex flex-col items-center justify-center py-8 h-full">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                      <Plus size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Add Mock Trade</h3>
                    <p className="text-slate-500 text-sm text-center">
                      Try another strategy with virtual funds
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start a New Mock Trade</DialogTitle>
                  <DialogDescription>Test strategies with virtual funds before investing real money</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input type="number" placeholder="100" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Strategy</label>
                    <Select defaultValue="smartDca">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smartDca">Smart DCA</SelectItem>
                        <SelectItem value="gridTrading">Grid Trading</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Token</label>
                    <Select defaultValue="btc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" onClick={handleStartMockTrade}>Start Mock Trade</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'completed1',
                type: 'Smart DCA',
                token: 'BTC',
                startDate: 'Feb 10, 2023',
                endDate: 'Mar 15, 2023',
                startAmount: 100,
                endAmount: 138.25,
                profit: 38.25,
                profitPercentage: 38.25,
              },
              {
                id: 'completed2',
                type: 'Grid Trading',
                token: 'ETH',
                startDate: 'Jan 5, 2023',
                endDate: 'Mar 5, 2023',
                startAmount: 100,
                endAmount: 112.80,
                profit: 12.80,
                profitPercentage: 12.80,
              }
            ].map((trade) => (
              <Card key={trade.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full ${
                        trade.type === 'Smart DCA' ? 
                        'bg-blue-100 text-crypto-blue' : 
                        'bg-purple-100 text-crypto-purple'
                      } flex items-center justify-center`}>
                        {trade.type === 'Smart DCA' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      </div>
                      <div>
                        <CardTitle className="text-md">{trade.type}</CardTitle>
                        <CardDescription>{trade.token} • Completed {trade.endDate}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Duration</span>
                      <span className="font-medium">{trade.startDate} - {trade.endDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Initial Amount</span>
                      <span className="font-medium">${trade.startAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Final Value</span>
                      <span className="font-medium">${trade.endAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Final Profit/Loss</span>
                      <span className={`font-medium ${
                        trade.profit >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                      }`}>
                        {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)} ({
                          trade.profit >= 0 ? '+' : ''
                        }{trade.profitPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">View Report</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{trade.type} - {trade.token} Trade Report</DialogTitle>
                        <DialogDescription>Completed mock trade performance</DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-400">Performance Chart</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Duration</label>
                            <p className="text-sm text-slate-600">{trade.startDate} - {trade.endDate}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Initial Investment</label>
                            <p className="text-sm text-slate-600">${trade.startAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Final Value</label>
                            <p className="text-sm text-slate-600">${trade.endAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Profit/Loss</label>
                            <p className={`text-sm ${
                              trade.profit >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                            }`}>
                              {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)} ({
                                trade.profit >= 0 ? '+' : ''
                              }{trade.profitPercentage.toFixed(2)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button className="bg-crypto-blue hover:bg-crypto-blue/90">
                          Start Real Trade with This Strategy
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default MockTrades;
