// /** @format */
//
// import React from "react";
// import {
//   GridVisualizationData,
//   GridLineVisualization,
// } from "@/api/hooks/useGridVisualization";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";
//
// interface GridVisualizationChartProps {
//   data: GridVisualizationData;
//   height?: number;
// }
//
// const GridVisualizationChart: React.FC<GridVisualizationChartProps> = ({
//   data,
//   height = 400,
// }) => {
//   const calculatePricePosition = (
//     price: number,
//     gridLines: GridLineVisualization[]
//   ): number => {
//     if (gridLines.length === 0) return 50;
//
//     const prices = gridLines.map((line) => line.price).sort((a, b) => a - b);
//     const minPrice = Math.min(...prices, data.currentPrice) * 0.98; // Add 2% padding
//     const maxPrice = Math.max(...prices, data.currentPrice) * 1.02; // Add 2% padding
//
//     if (price <= minPrice) return 95;
//     if (price >= maxPrice) return 5;
//
//     return 95 - ((price - minPrice) / (maxPrice - minPrice)) * 90;
//   };
//
//   const getRiskLevelColor = (riskLevel: string) => {
//     switch (riskLevel) {
//       case "LOW_RISK":
//         return "bg-green-100 text-green-800";
//       case "MEDIUM_RISK":
//         return "bg-yellow-100 text-yellow-800";
//       case "HIGH_RISK":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };
//
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 6,
//     }).format(price);
//   };
//
//   const formatPercent = (percent: number) => {
//     return `${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`;
//   };
//
//   return (
//     <Card className="w-full">
//       <CardHeader className="pb-4">
//         <div className="flex justify-between items-start">
//           <div>
//             <CardTitle className="text-xl font-bold">
//               {data.tokenSymbol} Grid Strategy
//             </CardTitle>
//             <div className="flex items-center gap-2 mt-1">
//               <Badge className={getRiskLevelColor(data.riskLevel)}>
//                 {data.riskLevel.replace("_", " ")}
//               </Badge>
//               <span className="text-sm text-muted-foreground">
//                 Plan ID: {data.planId.slice(-8)}
//               </span>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-blue-600">
//               {formatPrice(data.currentPrice)}
//             </div>
//             <div className="text-sm text-muted-foreground">Current Price</div>
//           </div>
//         </div>
//       </CardHeader>
//
//       <CardContent>
//         {/* Stats Row */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <div className="text-center">
//             <div className="text-lg font-semibold">
//               {formatPrice(data.centerPrice)}
//             </div>
//             <div className="text-sm text-muted-foreground">Center Price</div>
//           </div>
//           <div className="text-center">
//             <div className="text-lg font-semibold">
//               {formatPrice(data.investmentPerHit)}
//             </div>
//             <div className="text-sm text-muted-foreground">Per Execution</div>
//           </div>
//           <div className="text-center">
//             <div className="text-lg font-semibold flex items-center justify-center gap-1">
//               <Activity className="w-4 h-4" />
//               {data.executionCount}
//             </div>
//             <div className="text-sm text-muted-foreground">Executions</div>
//           </div>
//           <div className="text-center">
//             <div className="text-lg font-semibold">{data.gridLines.length}</div>
//             <div className="text-sm text-muted-foreground">Grid Lines</div>
//           </div>
//         </div>
//
//         {/* Grid Visualization */}
//         <div
//           className="relative border rounded-lg p-4"
//           style={{ height: `${height}px` }}
//         >
//           {/* Grid Lines */}
//           {data.gridLines.map((line, index) => {
//             const position = calculatePricePosition(line.price, data.gridLines);
//             const isBuy = line.type === "buy";
//             const isExecuted = line.status === "recently_executed";
//
//             return (
//               <div
//                 key={index}
//                 className={`absolute left-0 right-0 flex items-center justify-between px-2 py-1 text-xs font-medium transition-all duration-200 ${
//                   isExecuted ? "opacity-60 animate-pulse" : "opacity-90"
//                 }`}
//                 style={{
//                   top: `${position}%`,
//                   transform: "translateY(-50%)",
//                   backgroundColor: isBuy ? "#10B98150" : "#EF444450",
//                   borderLeft: `3px solid ${isBuy ? "#10B981" : "#EF4444"}`,
//                   zIndex: 1,
//                 }}
//               >
//                 <div className="flex items-center gap-2">
//                   {isBuy ? (
//                     <TrendingDown className="w-3 h-3 text-green-600" />
//                   ) : (
//                     <TrendingUp className="w-3 h-3 text-red-600" />
//                   )}
//                   <span className={isBuy ? "text-green-700" : "text-red-700"}>
//                     {line.type.toUpperCase()}
//                   </span>
//                 </div>
//
//                 <div className="flex items-center gap-2">
//                   <span className="font-mono">{formatPrice(line.price)}</span>
//                   <span
//                     className={`font-semibold ${
//                       line.distancePercent > 0
//                         ? "text-red-600"
//                         : "text-green-600"
//                     }`}
//                   >
//                     {formatPercent(line.distancePercent)}
//                   </span>
//                   {isExecuted && <Clock className="w-3 h-3 text-orange-500" />}
//                 </div>
//               </div>
//             );
//           })}
//
//           {/* Current Price Line */}
//           <div
//             className="absolute left-0 right-0 bg-blue-500 shadow-lg"
//             style={{
//               top: `${calculatePricePosition(
//                 data.currentPrice,
//                 data.gridLines
//               )}%`,
//               height: "3px",
//               transform: "translateY(-50%)",
//               zIndex: 2,
//             }}
//           >
//             <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
//               LIVE: {formatPrice(data.currentPrice)}
//             </div>
//           </div>
//
//           {/* Center Price Line */}
//           <div
//             className="absolute left-0 right-0 border-t-2 border-dashed border-gray-400 opacity-60"
//             style={{
//               top: `${calculatePricePosition(
//                 data.centerPrice,
//                 data.gridLines
//               )}%`,
//               transform: "translateY(-50%)",
//               zIndex: 0,
//             }}
//           >
//             <div className="absolute right-2 transform -translate-y-full bg-gray-500 text-white px-1 py-0.5 rounded text-xs">
//               CENTER
//             </div>
//           </div>
//         </div>
//
//         {/* Legend */}
//         <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t">
//           <div className="flex items-center gap-1">
//             <div className="w-4 h-2 bg-green-500 rounded"></div>
//             <span className="text-sm">Buy Lines</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <div className="w-4 h-2 bg-red-500 rounded"></div>
//             <span className="text-sm">Sell Lines</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <div className="w-4 h-1 bg-blue-500 rounded"></div>
//             <span className="text-sm">Current Price</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <div className="w-4 h-0.5 bg-gray-400 border-dashed"></div>
//             <span className="text-sm">Center Price</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Clock className="w-3 h-3 text-orange-500" />
//             <span className="text-sm">Recently Executed</span>
//           </div>
//         </div>
//
//         {/* Last Execution Time */}
//         {data.lastExecutionTime && (
//           <div className="text-center text-sm text-muted-foreground mt-2">
//             Last execution: {new Date(data.lastExecutionTime).toLocaleString()}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };
//
// // Loading skeleton component
// export const GridVisualizationSkeleton: React.FC<{ height?: number }> = ({
//   height = 400,
// }) => (
//   <Card className="w-full">
//     <CardHeader>
//       <div className="flex justify-between items-start">
//         <div>
//           <Skeleton className="h-6 w-32 mb-2" />
//           <div className="flex gap-2">
//             <Skeleton className="h-5 w-20" />
//             <Skeleton className="h-5 w-24" />
//           </div>
//         </div>
//         <div className="text-right">
//           <Skeleton className="h-8 w-24 mb-1" />
//           <Skeleton className="h-4 w-20" />
//         </div>
//       </div>
//     </CardHeader>
//     <CardContent>
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="text-center">
//             <Skeleton className="h-6 w-full mb-1" />
//             <Skeleton className="h-4 w-full" />
//           </div>
//         ))}
//       </div>
//       <Skeleton
//         className="w-full rounded-lg"
//         style={{ height: `${height}px` }}
//       />
//     </CardContent>
//   </Card>
// );
//
// export default GridVisualizationChart;
