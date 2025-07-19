import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Strategy } from "@/lib/types";
import { RefreshCw, Grid, TrendingUp } from "lucide-react";

// Color map for strategy types
const ColorMap: Record<string, { bg: string, text: string }> = {
  'dca': { bg: 'bg-blue-100', text: 'text-crypto-blue' },
  'grid': { bg: 'bg-purple-100', text: 'text-crypto-purple' },
  'momentum': { bg: 'bg-amber-100', text: 'text-amber-600' },
  'custom': { bg: 'bg-green-100', text: 'text-green-600' },
};

// Icon map for strategy types
const IconMap: Record<string, React.ReactNode> = {
  'RefreshCw': <RefreshCw size={20} />,
  'Grid': <Grid size={20} />,
  'TrendingUp': <TrendingUp size={20} />
};

interface StrategyWhatIfDialogProps {
  strategy: Strategy;
  open: boolean;
  onClose: () => void;
  defaultToken?: string;
}

const StrategyWhatIfDialog = ({ strategy, open, onClose, defaultToken = 'btc' }: StrategyWhatIfDialogProps) => {
  const [timeframe, setTimeframe] = useState("3months");
  const [investment, setInvestment] = useState("1000");
  const [tokenId, setTokenId] = useState(defaultToken);
  
  // Get color scheme based on strategy type
  const colorScheme = ColorMap[strategy.type] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  
  // Get token performance
  const tokenPerformance = strategy.performance?.[tokenId] || {
    Y: 0,
    sixMonths: 0,
    threeMonths: 0,
    month: 0,
    week: 0
  };
  
  // Calculate projected returns based on timeframe and investment
  const getProjectedReturn = (): number => {
    const amount = parseFloat(investment) || 0;
    let returnPercentage = 0;
    
    switch (timeframe) {
      case "1week":
        returnPercentage = tokenPerformance.week || 0;
        break;
      case "1month":
        returnPercentage = tokenPerformance.month || 0;
        break;
      case "3months":
        returnPercentage = tokenPerformance.threeMonths || 0;
        break;
      case "6months":
        returnPercentage = tokenPerformance.sixMonths || 0;
        break;
      case "1year":
        returnPercentage = tokenPerformance.Y || 0;
        break;
      default:
        returnPercentage = 0;
    }
    
    return amount * (1 + returnPercentage / 100);
  };

  const projectedReturn = getProjectedReturn();
  const profit = projectedReturn - (parseFloat(investment) || 0);
  const profitPercentage = ((projectedReturn / (parseFloat(investment) || 1)) - 1) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${colorScheme.bg} ${colorScheme.text} flex items-center justify-center`}>
              {IconMap[strategy.icon as keyof typeof IconMap] || <RefreshCw size={16} />}
            </div>
            <DialogTitle>{strategy.name} - What If Calculator</DialogTitle>
          </div>
          <DialogDescription>
            See how this strategy could perform with your investment amount.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="token">Token</Label>
              <Select
                value={tokenId}
                onValueChange={setTokenId}
              >
                <SelectTrigger id="token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tokens</SelectLabel>
                    {strategy.supportedTokens.map(token => (
                      <SelectItem key={token} value={token}>
                        {token.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="investment">Investment Amount (USD)</Label>
              <Input
                id="investment"
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                min="10"
                step="100"
              />
            </div>
          </div>
          
          <div>
            <Label>Timeframe</Label>
            <Tabs defaultValue="3months" value={timeframe} onValueChange={setTimeframe} className="mt-2">
              <TabsList className="grid grid-cols-5 h-auto">
                <TabsTrigger value="1week" className="text-xs py-1">1 Week</TabsTrigger>
                <TabsTrigger value="1month" className="text-xs py-1">1 Month</TabsTrigger>
                <TabsTrigger value="3months" className="text-xs py-1">3 Months</TabsTrigger>
                <TabsTrigger value="6months" className="text-xs py-1">6 Months</TabsTrigger>
                <TabsTrigger value="1year" className="text-xs py-1">1 Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">Historical Performance</div>
              <div className="text-2xl font-bold text-crypto-green">
                {timeframe === "1week" && `+${tokenPerformance.week || 0}%`}
                {timeframe === "1month" && `+${tokenPerformance.month || 0}%`}
                {timeframe === "3months" && `+${tokenPerformance.threeMonths || 0}%`}
                {timeframe === "6months" && `+${tokenPerformance.sixMonths || 0}%`}
                {timeframe === "1year" && `+${tokenPerformance.Y || 0}%`}
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">Projected Return</div>
              <div className="text-2xl font-bold">${projectedReturn.toFixed(2)}</div>
              <div className={`text-sm ${profit >= 0 ? 'text-crypto-green' : 'text-red-500'}`}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg text-amber-800 text-sm">
            <p className="font-medium mb-1">Important Note</p>
            <p>Past performance does not guarantee future results. These projections are based on historical data and are for illustrative purposes only.</p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="sm:order-1"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white sm:order-2"
          >
            One Click Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StrategyWhatIfDialog; 