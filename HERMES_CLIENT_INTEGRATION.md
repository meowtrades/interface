<!-- @format -->

# HermesClient Integration for Live Price Feeds

## Overview

This document describes the integration of Pyth Network's HermesClient for real-time price feeds in the MeowTrades grid trading visualization system.

## Why HermesClient?

Instead of using Server-Sent Events (SSE) or WebSocket relays through our backend, we use HermesClient directly in the frontend for:

- **Lower Latency**: Direct connection to Pyth's Hermes service
- **Reduced Backend Load**: No need for price relay infrastructure
- **Better Reliability**: One less point of failure
- **Real-time Data**: Pyth provides high-frequency price updates

## Implementation

### Hook: `useLivePrices`

Located at: `src/hooks/useLivePrices.ts`

```typescript
const { prices, connectionStatus, lastUpdate, error } = useLivePrices({
  symbols: ["SOL/USD", "BTC/USD"],
  onPriceUpdate: (update) => console.log(update),
  updateInterval: 1000, // optional, default 1000ms
});
```

**Features:**

- Automatic connection management
- Configurable update intervals
- Error handling and retry logic
- Connection status monitoring
- Price history management

### Components

#### LiveGridVisualization

- Integrates live price updates with grid visualization
- Shows connection status and error states
- Updates charts in real-time

#### GridVisualization Page

- Test panel for HermesClient functionality
- Connection status monitoring
- Live price display for testing

## Price Feed IDs

Current supported trading pairs with their Pyth Network price feed IDs:

- SOL/USD: `0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d`
- BTC/USD: `0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43`
- ETH/USD: `0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace`
- USDC/USD: `0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a`
- USDT/USD: `0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b`
- AVAX/USD: `0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7`
- MATIC/USD: `0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52`
- ATOM/USD: `0xb00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819`

## Testing

1. Navigate to `/grid-visualization`
2. Click "Test Hermes Client ON" button
3. Monitor connection status and live price updates
4. Check browser console for debug logs

## Error Handling

The system handles various error states:

- **Connection Failed**: Network or service unavailable
- **Invalid Price Feed IDs**: Unknown trading pairs
- **Rate Limiting**: Too many requests
- **Data Parsing Errors**: Malformed price data

## Dependencies

- `@pythnetwork/hermes-client`: ^2.0.0

## Configuration

Update `PRICE_FEED_IDS` in `useLivePrices.ts` to add new trading pairs.

The Hermes endpoint is currently set to: `https://hermes.pyth.network`

## Performance Considerations

- Default update interval: 1000ms (adjustable)
- Price history limited to prevent memory bloat
- Automatic cleanup on component unmount
- Connection pooling handled by HermesClient
