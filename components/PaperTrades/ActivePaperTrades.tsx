import React from "react";
import { Tabs, TabsContent } from "../ui/tabs";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, useStopDcaPlan } from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";

const ActivePaperTrades = () => {
  const stopDcaPlanMutation = useStopDcaPlan();
  const queryClient = useQueryClient();

  const handleStopMockTrade = async (tradeId: string) => {
    try {
      await stopDcaPlanMutation.mutateAsync(tradeId);
      toast.success("Paper Trade Stopped!", {
        description:
          "Your paper trade has been stopped successfully. View the final results in your trade history.",
        duration: 5000,
      });

      // Invalidate all related queries for real-time updates
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["activeStrategiesAnalytics", "mock"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["user", "analytics", "overview"],
        }),
        queryClient.invalidateQueries({ queryKey: ["recentActivities"] }),
        queryClient.invalidateQueries({
          queryKey: ["user", "analytics", "activities"],
        }),
      ]);
    } catch (error) {
      console.error("Failed to stop paper trade:", error);
      toast.error("Failed to Stop Paper Trade", {
        description:
          "Please try again or contact support if the issue persists.",
        duration: 5000,
      });
    }
  };

  // Get mock strategies by filtering for a chain: "mock"
  const {
    data: activeMockStrategiesWithAnalytics,
    isLoading: isLoadingActiveMockStrategiesAnalytics,
  } = useQuery({
    queryKey: ["activeStrategiesAnalytics", "mock"],
    queryFn: async () => {
      const {
        data: { data },
      } = await api.analytics.getActiveMockStrategies();
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale for fresh updates
  });

  return (
    <Tabs defaultValue="active" className="mb-2">
      <TabsContent value="active" className="pt-6">
        {!isLoadingActiveMockStrategiesAnalytics &&
        (!activeMockStrategiesWithAnalytics ||
          activeMockStrategiesWithAnalytics.length === 0) ? (
          <Card className="border-2 border-dashed border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-subtitle font-semibold text-foreground mb-3">
                No Active Paper Trades
              </h3>
              <p className="text-body text-muted-foreground mb-6 max-w-sm leading-relaxed">
                You don&apos;t have any active paper trades yet. Start your
                first simulation to test strategies with virtual funds before
                investing real money.
              </p>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-card transition-all duration-200 hover:shadow-card-hover"
                onClick={() => {
                  const startTradeSection = document.querySelector(
                    "[data-start-trade-section]"
                  );
                  if (startTradeSection) {
                    startTradeSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Start Your First Paper Trade
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingActiveMockStrategiesAnalytics ? (
              <>
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
              </>
            ) : (
              activeMockStrategiesWithAnalytics?.map((trade) => {
                const startedAt = Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(trade.createdAt));

                return (
                  <Card key={trade._id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full ${
                              // eslint-disable-next-line no-constant-condition
                              true
                                ? "bg-blue-100 text-crypto-blue"
                                : "bg-purple-100 text-crypto-purple"
                            } flex items-center justify-center`}
                          >
                            {
                              // eslint-disable-next-line no-constant-condition
                              true ? (
                                <TrendingUp size={20} />
                              ) : (
                                <TrendingDown size={20} />
                              )
                            }
                          </div>
                          <div>
                            <CardTitle className="text-md">Smart DCA</CardTitle>
                            <CardDescription>
                              {trade.token.symbol} • Started {startedAt}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">
                            Initial Amount
                          </span>
                          <span className="font-medium">
                            ${trade.totalInvested.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">
                            Current Value
                          </span>
                          <span className="font-medium">
                            ${trade.currentValue.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">
                            Profit/Loss
                          </span>
                          <span
                            className={`font-medium ${
                              trade.profit >= 0
                                ? "text-crypto-green"
                                : "text-crypto-red"
                            }`}
                          >
                            {trade.profit >= 0 ? "+" : ""}$
                            {trade.profit.toFixed(2)} (
                            {trade.profit >= 0 ? "+" : ""}
                            {trade.profitPercentage.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      <Link
                        href={`/app/strategies/${trade._id}`}
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>

                      <Button
                        onClick={() => handleStopMockTrade(trade._id)}
                        variant="destructive"
                        className="w-full"
                      >
                        Stop
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: "completed1",
              type: "Smart DCA",
              token: "BTC",
              startDate: "Feb 10, 2023",
              endDate: "Mar 15, 2023",
              startAmount: 100,
              endAmount: 138.25,
              profit: 38.25,
              profitPercentage: 38.25,
            },
            {
              id: "completed2",
              type: "Grid Trading",
              token: "ETH",
              startDate: "Jan 5, 2023",
              endDate: "Mar 5, 2023",
              startAmount: 100,
              endAmount: 112.8,
              profit: 12.8,
              profitPercentage: 12.8,
            },
          ].map((trade) => (
            <Card key={trade.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        trade.type === "Smart DCA"
                          ? "bg-blue-100 text-crypto-blue"
                          : "bg-purple-100 text-crypto-purple"
                      } flex items-center justify-center`}
                    >
                      {trade.type === "Smart DCA" ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-md">{trade.type}</CardTitle>
                      <CardDescription>
                        {trade.token} • Completed {trade.endDate}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Duration</span>
                    <span className="font-medium">
                      {trade.startDate} - {trade.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">
                      Initial Amount
                    </span>
                    <span className="font-medium">
                      ${trade.startAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Final Value</span>
                    <span className="font-medium">
                      ${trade.endAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">
                      Final Profit/Loss
                    </span>
                    <span
                      className={`font-medium ${
                        trade.profit >= 0
                          ? "text-crypto-green"
                          : "text-crypto-red"
                      }`}
                    >
                      {trade.profit >= 0 ? "+" : ""}${trade.profit.toFixed(2)} (
                      {trade.profit >= 0 ? "+" : ""}
                      {trade.profitPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {trade.type} - {trade.token} Trade Report
                      </DialogTitle>
                      <DialogDescription>
                        Completed Paper Trade performance
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-slate-400">
                          Performance Chart
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Duration
                          </label>
                          <p className="text-sm text-slate-600">
                            {trade.startDate} - {trade.endDate}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Initial Investment
                          </label>
                          <p className="text-sm text-slate-600">
                            ${trade.startAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Final Value
                          </label>
                          <p className="text-sm text-slate-600">
                            ${trade.endAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Profit/Loss
                          </label>
                          <p
                            className={`text-sm ${
                              trade.profit >= 0
                                ? "text-crypto-green"
                                : "text-crypto-red"
                            }`}
                          >
                            {trade.profit >= 0 ? "+" : ""}$
                            {trade.profit.toFixed(2)} (
                            {trade.profit >= 0 ? "+" : ""}
                            {trade.profitPercentage.toFixed(2)}%)
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
  );
};

export default ActivePaperTrades;
