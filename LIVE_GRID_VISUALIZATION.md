<!-- @format -->

# Live Grid Visualization with WebSocket

This implementation provides real-time grid trading visualization using WebSocket connections and canvas-based charts similar to TradingView.

## Frontend Components

### 1. LiveGridVisualization Component

- **Location**: `interface/src/components/LiveGridVisualization.tsx`
- **Features**:
  - Real-time price updates via WebSocket
  - Canvas-based chart rendering
  - Grid line visualization
  - Live price monitoring
  - Fullscreen chart mode
  - Connection status indicators

### 2. CanvasGridChart Component

- **Location**: `interface/src/components/CanvasGridChart.tsx`
- **Features**:
  - High-performance canvas rendering
  - TradingView-like interface
  - Crosshair for price inspection
  - Grid lines with buy/sell levels
  - Live price line
  - Price history charting
  - High DPI display support

### 3. WebSocket Hooks

- **useWebSocket**: `interface/src/hooks/useWebSocket.ts` - Generic WebSocket connection management
- **useLivePrices**: `interface/src/hooks/useLivePrices.ts` - Specialized hook for live price updates

## WebSocket Message Format

### Client → Server Messages

```typescript
// Subscribe to price updates
{
  type: 'subscribe',
  symbol: 'BTC'
}

// Unsubscribe from price updates
{
  type: 'unsubscribe',
  symbol: 'BTC'
}
```

### Server → Client Messages

```typescript
// Price update message
{
  type: 'price_update',
  data: {
    symbol: 'BTC',
    price: 45250.50,
    timestamp: 1672531200000,
    change24h: 125.50,
    changePercent24h: 0.28
  },
  timestamp: 1672531200000
}
```

## Backend WebSocket Server Setup

You need to implement a WebSocket server that provides live price feeds. Here's a basic example structure:

### 1. WebSocket Route Setup (Express + Socket.io)

```typescript
// backend/src/routes/websocket/index.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("subscribe", ({ symbol }) => {
      socket.join(`price_${symbol}`);
      console.log(`${socket.id} subscribed to ${symbol}`);
    });

    socket.on("unsubscribe", ({ symbol }) => {
      socket.leave(`price_${symbol}`);
      console.log(`${socket.id} unsubscribed from ${symbol}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
```

### 2. Price Feed Service

```typescript
// backend/src/services/priceFeed.ts
import { Server } from "socket.io";

export class PriceFeedService {
  private io: Server;
  private priceCache: Map<string, number> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.startPriceFeed();
  }

  private startPriceFeed() {
    // Update prices every second
    setInterval(() => {
      this.updatePrices();
    }, 1000);
  }

  private updatePrices() {
    // Fetch prices from your price source (e.g., exchange API, database)
    const symbols = ["BTC", "ETH", "INJ"]; // Your tracked symbols

    symbols.forEach(async (symbol) => {
      try {
        const price = await this.fetchPriceFromSource(symbol);
        const previousPrice = this.priceCache.get(symbol) || price;
        const change24h = price - previousPrice;
        const changePercent24h = (change24h / previousPrice) * 100;

        this.priceCache.set(symbol, price);

        // Broadcast to subscribed clients
        this.io.to(`price_${symbol}`).emit("message", {
          type: "price_update",
          data: {
            symbol,
            price,
            timestamp: Date.now(),
            change24h,
            changePercent24h,
          },
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error(`Failed to update price for ${symbol}:`, error);
      }
    });
  }

  private async fetchPriceFromSource(symbol: string): Promise<number> {
    // Implement your price fetching logic here
    // This could be from:
    // - Exchange APIs (Binance, CoinGecko, etc.)
    // - Your database
    // - Third-party services

    // Mock implementation for demo
    const basePrice = { BTC: 45000, ETH: 3000, INJ: 25 }[symbol] || 100;
    return basePrice + (Math.random() - 0.5) * basePrice * 0.01; // ±0.5% variation
  }
}
```

### 3. Integration with Main Server

```typescript
// backend/src/server.ts
import express from "express";
import { createServer } from "http";
import { setupWebSocket } from "./routes/websocket";
import { PriceFeedService } from "./services/priceFeed";

const app = express();
const server = createServer(app);

// Setup WebSocket
const io = setupWebSocket(server);
const priceFeedService = new PriceFeedService(io);

// Your existing routes...

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running with WebSocket support");
});
```

## Environment Variables

Add these to your `.env` files:

### Frontend (.env)

```bash
VITE_WS_URL=ws://localhost:3000/ws
```

### Backend (.env)

```bash
FRONTEND_URL=http://localhost:5173
```

## Features

1. **Real-time Price Updates**: WebSocket connection provides live price feeds
2. **Canvas Rendering**: High-performance chart rendering using HTML5 Canvas
3. **Grid Line Visualization**: Visual representation of buy/sell grid levels
4. **Interactive Charts**: Crosshair, zoom, pan capabilities
5. **Connection Status**: Visual indicators for WebSocket connection status
6. **Auto-reconnection**: Automatic reconnection on connection loss
7. **Fullscreen Mode**: Expandable charts for detailed analysis

## Performance Considerations

1. **Canvas vs SVG**: Canvas is used for better performance with frequent updates
2. **Price History Limit**: Configurable limit to prevent memory issues
3. **Efficient Rendering**: Only re-render when necessary
4. **WebSocket Throttling**: Consider rate limiting on the backend
5. **Connection Pooling**: Manage WebSocket connections efficiently

## Next Steps

1. Implement the WebSocket server backend
2. Add price data sources (exchange APIs)
3. Test with real-time data
4. Add more chart types (candlestick, volume)
5. Implement chart indicators
6. Add user preferences for chart settings
