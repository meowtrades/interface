/** @format */

import React from "react";
import { useGridServiceHealth } from "@/api/hooks/useGridVisualization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Database,
  Clock,
  Wifi,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const GridServiceHealthMonitor: React.FC = () => {
  const {
    data: healthData,
    isLoading,
    error,
    isRefetching,
  } = useGridServiceHealth();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Service Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            Service Health - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to load service health data</p>
        </CardContent>
      </Card>
    );
  }

  if (!healthData) return null;

  const { health, summary, activePlanIds, timestamp } = healthData;

  const getStatusBadge = (isHealthy: boolean) => {
    return isHealthy ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Healthy
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        Unhealthy
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Grid Service Health
            {isRefetching && <RefreshCw className="w-4 h-4 animate-spin" />}
          </CardTitle>
          {getStatusBadge(health.isInitialized)}
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(timestamp).toLocaleString()}
        </p>
      </CardHeader>

      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-blue-600 mb-1">
              <Database className="w-6 h-6" />
              {health.activePlansInSet}
            </div>
            <div className="text-sm text-blue-700">Active Plans</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600 mb-1">
              <Activity className="w-6 h-6" />
              {health.totalGridLines}
            </div>
            <div className="text-sm text-green-700">Grid Lines Cached</div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-600 mb-1">
              <Clock className="w-6 h-6" />
              {health.recentExecutionsCount}
            </div>
            <div className="text-sm text-orange-700">Recent Executions</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-purple-600 mb-1">
              <Wifi className="w-6 h-6" />
              {health.activeTokensPolling.length}
            </div>
            <div className="text-sm text-purple-700">Tokens Polling</div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Active Tokens */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Active Price Polling
            </h4>
            <div className="flex flex-wrap gap-1">
              {health.activeTokensPolling.length > 0 ? (
                health.activeTokensPolling.map((token) => (
                  <Badge
                    key={token}
                    variant="outline"
                    className="bg-green-50 border-green-200"
                  >
                    {token}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No tokens being polled
                </span>
              )}
            </div>
          </div>

          {/* Tracked Tokens */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" />
              Tracked Tokens
            </h4>
            <div className="flex flex-wrap gap-1">
              {summary.tokensTracked.length > 0 ? (
                summary.tokensTracked.map((token) => (
                  <Badge
                    key={token}
                    variant="outline"
                    className="bg-blue-50 border-blue-200"
                  >
                    {token}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No tokens tracked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Performance Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">
                Total Plans Tracked:
              </span>
              <span className="ml-2 font-semibold">
                {health.totalPlansTracked}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">
                Plans in Active Set:
              </span>
              <span className="ml-2 font-semibold">
                {health.activePlansInSet}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Grid Keys:</span>
              <span className="ml-2 font-semibold">{summary.totalKeys}</span>
            </div>
            <div>
              <span className="text-muted-foreground">
                Initialization Status:
              </span>
              <span
                className={`ml-2 font-semibold ${
                  health.isInitialized ? "text-green-600" : "text-red-600"
                }`}
              >
                {health.isInitialized ? "Initialized" : "Not Initialized"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Cache Efficiency:</span>
              <span className="ml-2 font-semibold text-green-600">
                {health.totalGridLines > 0 ? "100%" : "0%"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Active Plan IDs:</span>
              <span className="ml-2 font-semibold">{activePlanIds.length}</span>
            </div>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div
            className={`flex items-center gap-2 p-2 rounded ${
              health.isInitialized
                ? "bg-success/10 text-success border border-success/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {health.isInitialized ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-caption font-medium">Service Initialized</span>
          </div>

          <div
            className={`flex items-center gap-2 p-2 rounded ${
              health.activeTokensPolling.length > 0
                ? "bg-success/10 text-success border border-success/20"
                : "bg-warning/10 text-warning border border-warning/20"
            }`}
          >
            {health.activeTokensPolling.length > 0 ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-caption font-medium">Price Feeds Active</span>
          </div>

          <div
            className={`flex items-center gap-2 p-2 rounded ${
              health.totalGridLines > 0
                ? "bg-success/10 text-success border border-success/20"
                : "bg-warning/10 text-warning border border-warning/20"
            }`}
          >
            {health.totalGridLines > 0 ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-caption font-medium">Grid Lines Cached</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridServiceHealthMonitor;
