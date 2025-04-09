import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar
} from 'recharts';
import { ArrowRight, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface StrategyWhatIfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategyName: string;
  strategyType: 'smart-dca' | 'grid-trading';
}

// Mock data for what if scenarios (3 months back with $500 investment)
const getWhatIfData = (strategyType: 'smart-dca' | 'grid-trading') => {
  // Different performance data based on strategy type
  const multiplier = strategyType === 'smart-dca' ? 1.12 : 1.09; // 12% or 9% growth
  const initialInvestment = 500;
  const finalValue = initialInvestment * multiplier;
  const profit = finalValue - initialInvestment;
  
  // Generate data points for the chart
  const dataPoints = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  
  // Create 12 data points (weekly) over the 3 month period
  for (let i = 0; i < 12; i++) {
    const date = new Date(threeMonthsAgo);
    date.setDate(date.getDate() + (i * 7));
    
    // For the grid trading, add some more volatility
    const volatility = strategyType === 'grid-trading' ? 
      (Math.random() * 0.05) - 0.025 : 
      (Math.random() * 0.02) - 0.01;
    
    // Linear growth with some randomness
    const progress = i / 11; // 0 to 1
    const value = initialInvestment + (profit * progress) + (initialInvestment * volatility);
    
    dataPoints.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value * 100) / 100
    });
  }
  
  // Add transaction data
  const transactions = [];
  if (strategyType === 'smart-dca') {
    // For DCA, show regular buys
    for (let i = 0; i < 3; i++) {
      const date = new Date(threeMonthsAgo);
      date.setDate(date.getDate() + (i * 30));
      transactions.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type: 'Buy',
        amount: strategyType === 'smart-dca' ? '$166.67' : '$125.00',
        value: strategyType === 'smart-dca' ? 
          (Math.round((166.67 + (Math.random() * 10 - 5)) * 100) / 100).toFixed(2) : 
          (Math.round((125 + (Math.random() * 10 - 5)) * 100) / 100).toFixed(2)
      });
    }
  } else {
    // For grid trading, show buys and sells
    for (let i = 0; i < 5; i++) {
      const date = new Date(threeMonthsAgo);
      date.setDate(date.getDate() + (i * 18));
      const isEven = i % 2 === 0;
      transactions.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type: isEven ? 'Buy' : 'Sell',
        amount: '$100.00',
        value: (Math.round((100 + (Math.random() * 10 - 5)) * 100) / 100).toFixed(2)
      });
    }
  }
  
  return {
    dataPoints,
    initialInvestment,
    finalValue: Math.round(finalValue * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    profitPercentage: Math.round((profit / initialInvestment) * 100 * 10) / 10,
    transactions
  };
};

const StrategyWhatIfDialog: React.FC<StrategyWhatIfDialogProps> = ({
  open,
  onOpenChange,
  strategyName,
  strategyType
}) => {
  const data = getWhatIfData(strategyType);
  const isProfitable = data.profit > 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            What if you invested $500 3 months ago?
          </DialogTitle>
          <DialogDescription>
            See how a $500 investment would have performed with the {strategyName} strategy
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Summary card */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-500 mb-1">Initial Investment</p>
              <p className="text-xl font-semibold">${data.initialInvestment.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-500 mb-1">Current Value</p>
              <p className="text-xl font-semibold">${data.finalValue.toFixed(2)}</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm text-slate-500 mb-1">Profit/Loss</p>
              <p className={`text-xl font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitable ? '+' : ''}{data.profit.toFixed(2)} ({data.profitPercentage}%)
              </p>
            </div>
          </div>
          
          {/* Chart */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-medium mb-4">Performance Over Time</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dataPoints} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isProfitable ? "#22c55e" : "#ef4444"} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={isProfitable ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
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
                    stroke={isProfitable ? "#22c55e" : "#ef4444"} 
                    strokeWidth={2}
                    fill="url(#colorValue)"
                    dot={false}
                    activeDot={{ r: 6, fill: isProfitable ? "#22c55e" : "#ef4444", stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Transactions */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-medium mb-4">Simulated Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((transaction, index) => (
                    <tr key={index} className="border-t border-slate-200">
                      <td className="py-2 px-4">{transaction.date}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'Buy' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-2 px-4">{transaction.amount}</td>
                      <td className="py-2 px-4">${transaction.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Strategy-specific features */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-medium mb-4">Strategy Insights</h3>
            <div className="space-y-3">
              {strategyType === 'smart-dca' ? (
                <>
                  <div className="flex items-start gap-3">
                    <Clock className="text-blue-500 mt-0.5 w-5 h-5" />
                    <div>
                      <p className="font-medium">Automatic Timing</p>
                      <p className="text-sm text-slate-500">The strategy purchased more during market dips, optimizing your entry points.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="text-blue-500 mt-0.5 w-5 h-5" />
                    <div>
                      <p className="font-medium">Cost Averaging</p>
                      <p className="text-sm text-slate-500">Regular investments reduced your average cost basis over the 3-month period.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="text-purple-500 mt-0.5 w-5 h-5" />
                    <div>
                      <p className="font-medium">Volatility Profit</p>
                      <p className="text-sm text-slate-500">The strategy captured profits from price volatility with automatic buy/sell orders.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ArrowRight className="text-purple-500 mt-0.5 w-5 h-5" />
                    <div>
                      <p className="font-medium">Predefined Range</p>
                      <p className="text-sm text-slate-500">Trading occurred within a set price range, with profits taken at the upper bound.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button 
            className={strategyType === 'smart-dca' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}
          >
            Start This Strategy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StrategyWhatIfDialog; 