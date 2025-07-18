/** @format */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  GridLineVisualization,
  GridVisualizationData,
} from "@/api/hooks/useGridVisualization";

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface CanvasGridChartProps {
  data: GridVisualizationData;
  priceHistory: PricePoint[];
  currentPrice: number;
  width?: number;
  height?: number;
  className?: string;
}

export const CanvasGridChart: React.FC<CanvasGridChartProps> = ({
  data,
  priceHistory,
  currentPrice,
  width = 800,
  height = 400,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Chart configuration
  const config = useMemo(
    () => ({
      padding: { top: 20, right: 60, bottom: 40, left: 60 },
      grid: {
        color: "#e5e7eb",
        width: 1,
      },
      gridLines: {
        buyColor: "#10b981",
        sellColor: "#ef4444",
        activeWidth: 2,
        executedWidth: 1,
        executedOpacity: 0.5,
      },
      priceChart: {
        color: "#3b82f6",
        width: 2,
      },
      currentPrice: {
        color: "#f59e0b",
        width: 3,
        dashLength: 5,
      },
      text: {
        color: "#374151",
        font: '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      crosshair: {
        color: "#6b7280",
        width: 1,
      },
    }),
    []
  );

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size for high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate chart dimensions
    const chartWidth = rect.width - config.padding.left - config.padding.right;
    const chartHeight =
      rect.height - config.padding.top - config.padding.bottom;

    if (chartWidth <= 0 || chartHeight <= 0) return;

    // Calculate price range
    const allPrices = [
      ...data.gridLines.map((line) => line.price),
      ...priceHistory.map((point) => point.price),
      currentPrice,
    ];
    const minPrice = Math.min(...allPrices) * 0.98;
    const maxPrice = Math.max(...allPrices) * 1.02;
    const priceRange = maxPrice - minPrice;

    // Helper functions
    const priceToY = (price: number) => {
      return (
        config.padding.top + ((maxPrice - price) / priceRange) * chartHeight
      );
    };

    const timeToX = (timestamp: number) => {
      if (priceHistory.length === 0) return config.padding.left;
      const minTime = priceHistory[0].timestamp;
      const maxTime = priceHistory[priceHistory.length - 1].timestamp;
      const timeRange = maxTime - minTime;
      if (timeRange === 0) return config.padding.left;
      return (
        config.padding.left + ((timestamp - minTime) / timeRange) * chartWidth
      );
    };

    // Draw background grid
    ctx.strokeStyle = config.grid.color;
    ctx.lineWidth = config.grid.width;
    ctx.setLineDash([]);

    // Horizontal grid lines (price levels)
    const priceSteps = 8;
    for (let i = 0; i <= priceSteps; i++) {
      const price = minPrice + (priceRange * i) / priceSteps;
      const y = priceToY(price);

      ctx.beginPath();
      ctx.moveTo(config.padding.left, y);
      ctx.lineTo(config.padding.left + chartWidth, y);
      ctx.stroke();

      // Price labels
      ctx.fillStyle = config.text.color;
      ctx.font = config.text.font;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(price.toFixed(4), config.padding.left - 10, y);
    }

    // Vertical grid lines (time)
    if (priceHistory.length > 1) {
      const timeSteps = 6;
      for (let i = 0; i <= timeSteps; i++) {
        const timestamp =
          priceHistory[0].timestamp +
          ((priceHistory[priceHistory.length - 1].timestamp -
            priceHistory[0].timestamp) *
            i) /
            timeSteps;
        const x = timeToX(timestamp);

        ctx.beginPath();
        ctx.moveTo(x, config.padding.top);
        ctx.lineTo(x, config.padding.top + chartHeight);
        ctx.stroke();

        // Time labels
        const date = new Date(timestamp);
        const timeLabel = date.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        ctx.fillStyle = config.text.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(timeLabel, x, config.padding.top + chartHeight + 10);
      }
    }

    // Draw grid lines (buy/sell levels)
    data.gridLines.forEach((line) => {
      const y = priceToY(line.price);
      const color =
        line.type === "buy"
          ? config.gridLines.buyColor
          : config.gridLines.sellColor;
      const width =
        line.status === "active"
          ? config.gridLines.activeWidth
          : config.gridLines.executedWidth;
      const opacity =
        line.status === "active" ? 1 : config.gridLines.executedOpacity;

      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(config.padding.left, y);
      ctx.lineTo(config.padding.left + chartWidth, y);
      ctx.stroke();

      // Grid line labels
      ctx.fillStyle = color;
      ctx.font = config.text.font;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `${line.type.toUpperCase()} $${line.price.toFixed(4)}`,
        config.padding.left + chartWidth + 10,
        y
      );
    });

    ctx.globalAlpha = 1;

    // Draw price history line
    if (priceHistory.length > 1) {
      ctx.strokeStyle = config.priceChart.color;
      ctx.lineWidth = config.priceChart.width;
      ctx.setLineDash([]);

      ctx.beginPath();
      priceHistory.forEach((point, index) => {
        const x = timeToX(point.timestamp);
        const y = priceToY(point.price);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // Draw current price line
    const currentY = priceToY(currentPrice);
    ctx.strokeStyle = config.currentPrice.color;
    ctx.lineWidth = config.currentPrice.width;
    ctx.setLineDash([
      config.currentPrice.dashLength,
      config.currentPrice.dashLength,
    ]);

    ctx.beginPath();
    ctx.moveTo(config.padding.left, currentY);
    ctx.lineTo(config.padding.left + chartWidth, currentY);
    ctx.stroke();

    // Current price label
    ctx.fillStyle = config.currentPrice.color;
    ctx.font = "bold " + config.text.font;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `CURRENT $${currentPrice.toFixed(4)}`,
      config.padding.left + chartWidth + 10,
      currentY
    );

    // Draw crosshair if hovering
    if (isHovering) {
      ctx.strokeStyle = config.crosshair.color;
      ctx.lineWidth = config.crosshair.width;
      ctx.setLineDash([2, 2]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mousePosition.x, config.padding.top);
      ctx.lineTo(mousePosition.x, config.padding.top + chartHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(config.padding.left, mousePosition.y);
      ctx.lineTo(config.padding.left + chartWidth, mousePosition.y);
      ctx.stroke();

      // Price at crosshair
      const priceAtCursor =
        maxPrice -
        ((mousePosition.y - config.padding.top) / chartHeight) * priceRange;
      ctx.fillStyle = config.crosshair.color;
      ctx.fillRect(
        config.padding.left + chartWidth + 5,
        mousePosition.y - 10,
        60,
        20
      );
      ctx.fillStyle = "white";
      ctx.font = config.text.font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        priceAtCursor.toFixed(4),
        config.padding.left + chartWidth + 35,
        mousePosition.y
      );
    }
  }, [data, priceHistory, currentPrice, isHovering, mousePosition, config]);

  // Handle mouse events
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawChart();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawChart]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`cursor-crosshair ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};
