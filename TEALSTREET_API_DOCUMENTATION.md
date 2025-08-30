# Custom Module API Reference (v1.1.1)

## Overview

The Custom Module API provides comprehensive access to Tealstreet's trading functionality, UI components, and utilities. All modules receive an `api` object with the following structure.

**Important**: React is provided through the api object and made available in your module's scope automatically. You don't need to destructure React from the api:

```javascript
// React is automatically available in scope
const { antd, hooks, utils, exchange, components, constants, lodash, orders, toast } = api;
const { useState, useEffect, useMemo } = React; // React is already in scope
```

## Global Module

The Global Module is a special module that provides shared state, utilities, and types for all your custom modules. It acts as a central place to define common functionality that can be imported and used across all your modules.

### Creating a Global Module

Access the Global Module Editor from the Module Editor or Custom Hotkey Editor. The global module:
- Runs once when loaded and its exports are cached
- Provides TypeScript types automatically extracted for IntelliSense
- Persists across module reloads
- Can maintain shared state between modules

### Using Global Module in Your Modules

Import from the global module using the special `"global"` import:

```javascript
// Import from global module in any custom module
import { utils, hooks, constants, RiskManager } from "global";

const Component = () => {
  // Use shared hooks from global module
  const [sharedCounter, setSharedCounter] = hooks.useSharedCounter();
  const [settings, setSettings] = hooks.useSharedSettings();
  
  // Use shared utilities
  const formattedPrice = utils.formatPrice(100.5, 2);
  
  // Use shared classes
  const riskManager = new RiskManager(2);
  const stopLoss = riskManager.calculateStopLoss(100, 5);
  
  return (
    <div>
      <div>Counter: {sharedCounter}</div>
      <div>Risk Level: {settings.riskLevel}</div>
      <button onClick={() => setSharedCounter(sharedCounter + 1)}>
        Increment Shared Counter
      </button>
    </div>
  );
};
```

### Global Module Examples

#### Example 1: Shared State Management
```javascript
// Global Module - Shared state accessible by all modules
const sharedStateAtom = api.jotai.atom({ 
  activeStrategy: 'scalping',
  riskLevel: 1,
  autoTrade: false 
});

export const hooks = {
  useSharedState: () => api.jotai.useAtom(sharedStateAtom),
};

// Usage in any module:
// import { hooks } from "global";
// const [state, setState] = hooks.useSharedState();
```

#### Example 2: Custom Trading Utilities
```javascript
// Global Module - Shared trading utilities
export const trading = {
  calculatePositionSize: (balance, risk, stopDistance) => {
    const riskAmount = balance * (risk / 100);
    return riskAmount / stopDistance;
  },
  
  getFibonacciLevels: (high, low) => {
    const diff = high - low;
    return {
      level_0: low,
      level_236: low + diff * 0.236,
      level_382: low + diff * 0.382,
      level_500: low + diff * 0.500,
      level_618: low + diff * 0.618,
      level_100: high,
    };
  },
  
  getATRStopLoss: (entryPrice, atr, multiplier = 2, isLong = true) => {
    return isLong 
      ? entryPrice - (atr * multiplier)
      : entryPrice + (atr * multiplier);
  }
};
```

#### Example 3: TypeScript Types and Classes
```javascript
// Global Module - Define types and classes for better IntelliSense

// Custom type definitions (will appear in IntelliSense)
export type TradingStrategy = 'scalping' | 'swing' | 'position' | 'arbitrage';

export type RiskProfile = {
  maxRiskPerTrade: number;
  maxDailyLoss: number;
  maxOpenPositions: number;
  allowedPairs: string[];
};

// Shared class with methods
export class PositionManager {
  private maxPositions: number;
  private positions: Map<string, any>;
  
  constructor(maxPositions = 5) {
    this.maxPositions = maxPositions;
    this.positions = new Map();
  }
  
  canOpenPosition(): boolean {
    return this.positions.size < this.maxPositions;
  }
  
  addPosition(symbol: string, data: any): boolean {
    if (!this.canOpenPosition()) return false;
    this.positions.set(symbol, data);
    return true;
  }
  
  removePosition(symbol: string): void {
    this.positions.delete(symbol);
  }
  
  getPosition(symbol: string): any {
    return this.positions.get(symbol);
  }
  
  getAllPositions(): any[] {
    return Array.from(this.positions.values());
  }
}
```

#### Example 4: Persistent Storage Atoms
```javascript
// Global Module - Shared persistent storage
const tradingConfigAtom = api.jotai.createStorageAtom('trading-config', {
  defaultSize: 100,
  defaultLeverage: 10,
  quickBuyEnabled: true,
  soundEnabled: false,
  theme: 'dark'
});

const alertsAtom = api.jotai.createStorageAtom('price-alerts', []);

export const storage = {
  // Config hooks
  useTradingConfig: () => api.jotai.useAtom(tradingConfigAtom),
  useTradingConfigValue: () => api.jotai.useAtomValue(tradingConfigAtom),
  setTradingConfig: () => api.jotai.useSetAtom(tradingConfigAtom),
  
  // Alerts hooks
  useAlerts: () => api.jotai.useAtom(alertsAtom),
  addAlert: (alert) => {
    const [alerts, setAlerts] = api.jotai.useAtom(alertsAtom);
    setAlerts([...alerts, { ...alert, id: Date.now() }]);
  },
  removeAlert: (id) => {
    const [alerts, setAlerts] = api.jotai.useAtom(alertsAtom);
    setAlerts(alerts.filter(a => a.id !== id));
  }
};
```

#### Example 5: WebSocket and Real-time Data
```javascript
// Global Module - Shared WebSocket connections and data streams
let priceSocket = null;
const priceCallbacks = new Set();

export const realtime = {
  subscribeToPrices: (callback) => {
    priceCallbacks.add(callback);
    
    // Initialize WebSocket if not already connected
    if (!priceSocket) {
      // Setup WebSocket connection (example)
      console.log('Initializing price WebSocket...');
    }
    
    // Return unsubscribe function
    return () => {
      priceCallbacks.delete(callback);
      if (priceCallbacks.size === 0 && priceSocket) {
        // Close WebSocket if no more subscribers
        console.log('Closing price WebSocket...');
        priceSocket = null;
      }
    };
  },
  
  // Shared real-time data hook
  useLivePrices: () => {
    const [prices, setPrices] = api.jotai.useAtom(api.jotai.atom({}));
    
    React.useEffect(() => {
      const unsubscribe = realtime.subscribeToPrices((newPrices) => {
        setPrices(prev => ({ ...prev, ...newPrices }));
      });
      
      return unsubscribe;
    }, []);
    
    return prices;
  }
};
```

### Global Module Best Practices

1. **State Management**: Use Jotai atoms for shared state that needs to persist or be reactive
2. **Type Definitions**: Define custom types at the top of your global module for better IntelliSense
3. **Utility Functions**: Group related utilities into exported objects (e.g., `utils`, `trading`, `math`)
4. **Classes**: Export classes for complex shared logic with state
5. **Constants**: Define shared constants that multiple modules need
6. **Hooks**: Create custom hooks that combine multiple API hooks or add shared logic
7. **Performance**: Global module code runs once and is cached, so initialization code is efficient

### TypeScript Support

The global module automatically extracts TypeScript types from your exports. These types are available in all your custom modules:

```javascript
// Global Module
export type OrderConfig = {
  size: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
};

export const createOrder = (config: OrderConfig) => {
  // Implementation
};

// In any custom module - full IntelliSense support!
import { createOrder, OrderConfig } from "global";

const config: OrderConfig = {
  size: 100,
  leverage: 10,
  stopLoss: 95
};

createOrder(config); // Full type checking and autocomplete
```

### Fallback Type Declaration (GlobalType)

If the automatic type extraction fails to parse complex types correctly, you can define a fallback `GlobalType` type declaration at the top of your global module. This type will be used directly instead of parsing your exports:

```javascript
// Global Module - Define GlobalType as a fallback for complex type scenarios
type GlobalType = {
  // Define all your exports with their exact types here
  utils: {
    formatPrice: (price: number, decimals?: number) => string;
    calculateRisk: (entry: number, stop: number, size: number) => number;
  };
  
  hooks: {
    useSharedState: () => [SharedState, (state: SharedState) => void];
    useTrading: () => TradingAPI;
  };
  
  constants: {
    MAX_LEVERAGE: 125;
    MIN_SIZE: 0.001;
    FEE_RATE: 0.0006;
  };
  
  // Complex class types
  RiskManager: {
    new (maxRisk: number): {
      calculateStopLoss(entry: number, risk: number): number;
      isValid(): boolean;
    };
  };
};

// Your actual exports (these will be typed according to GlobalType above)
export const utils = {
  formatPrice: (price, decimals = 2) => price.toFixed(decimals),
  calculateRisk: (entry, stop, size) => Math.abs(entry - stop) * size
};

// ... rest of your exports
```

**When to use GlobalType fallback:**
- When you have complex nested types that aren't parsing correctly
- When using advanced TypeScript features like conditional types or mapped types
- When the automatic parser shows incorrect IntelliSense for your exports
- When you want explicit control over the exact type definitions

**Important notes:**
- The `GlobalType` must be defined as `type GlobalType = { ... }` at the top of your file
- It completely replaces automatic type extraction when present
- All your exports should be defined in the GlobalType for proper IntelliSense
- This is a fallback mechanism - try automatic extraction first

### Global Module vs Regular Modules

| Feature | Global Module | Regular Module |
|---------|--------------|----------------|
| Purpose | Shared utilities and state | Specific functionality |
| Execution | Runs once, exports cached | Runs every time used |
| State | Shared across all modules | Isolated to module instance |
| Types | Automatically extracted for all modules | Only available within module |
| Import | `import ... from "global"` | Cannot be imported |
| Naming | Fixed as "global" | User-defined name |

## Types

You can import TypeScript types in your custom modules using the special `"api-types"` module name. This provides access to all the trading types you need for proper typing of callbacks, function parameters, and variables.

```javascript
// Import types at the top of your module
import { DisplayedPosition, Position, Order, Market, Ticker } from "api-types";

// Use imported types for better type safety
const Component = () => {
  const positions = api.hooks.usePositions();
  
  // Type your callbacks with imported types
  const handlePositionClick = (position: Position) => {
    console.log(`Position ${position.symbol}: ${position.unrealizedPnl}`);
  };
  
  // Type your filters
  const profitablePositions = positions.filter((p: Position) => p.unrealizedPnl > 0);
  
  // Type your custom functions
  const calculateTotalPnl = (positions: Position[]): number => {
    return positions.reduce((sum, p) => sum + (p.unrealizedPnl || 0), 0);
  };
  
  return (
    <div>
      {positions.map((position: DisplayedPosition) => (
        <div key={position.id} onClick={() => handlePositionClick(position)}>
          {position.symbol}: {api.utils.formatCurrency(position.unrealizedPnl)}
        </div>
      ))}
    </div>
  );
};
```

### Types Overview

All types from the `@tealstreet/safe-cex` package are available for import, including:

- **Position Types**: `Position`, `DisplayedPosition`, `HistoricalPosition`
- **Order Types**: `Order`, `OrderSide`, `OrderType`, `OrderStatus`, `OrderTimeInForce`, `OrderStopTriggerType`
- **Market Types**: `Market`, `Ticker`, `Balance`, `CoinBalance`
- **Orderbook Types**: `OrderBook`, `OrderBookOrders`, `OrderBookUpdate`
- **Other Types**: `Candle`, `Timeframe`, `MarginType`, `PositionMode`, `PositionSide`

Using these type imports provides full IntelliSense support in the Monaco editor, making your custom modules more robust and easier to develop.

### Order Types

#### Order
```typescript
type Order = {
  id: string;                    // Unique order identifier
  parentId?: string;             // Parent order ID for conditional orders
  status: OrderStatus;           // Current order status
  symbol: string;                // Trading pair (e.g., "BTC-USDT")
  type: OrderType;               // Order type (market, limit, etc.)
  side: OrderSide;               // Buy or Sell
  price: number;                 // Order price
  amount: number;                // Order amount in base currency
  filled: number;                // Amount already filled
  remaining: number;             // Remaining amount to fill
  reduceOnly: boolean;           // True if order reduces position only
  close?: boolean;               // True if order closes position
  timeInForce?: OrderTimeInForce; // Time in force instruction
  lastUpdate: number;            // Last update timestamp
  tpTriggerType?: OrderStopTriggerType; // Take profit trigger type
  slTriggerType?: OrderStopTriggerType; // Stop loss trigger type
  takeProfit?: number;           // Take profit price
  stopLoss?: number;             // Stop loss price
  info?: any;                    // Exchange-specific data
  extra?: {                      // Additional order data
    remainingNative?: number;    // Remaining in native contract units
    remainingNotional?: number;  // Remaining notional value
    rejectReason?: OrderRejectReason; // Rejection reason if applicable
    isFromChaser?: boolean;      // True if from chaser order
    chaserId?: string;           // Chaser order ID
    chaserAttempts?: number;     // Chaser attempt count
    chaserMaxAttempts?: number;  // Max chaser attempts
  };
};
```



### Position Types

#### Position
```typescript
type Position = {
  id: string;                    // Position identifier
  symbol: string;                // Trading pair
  side: PositionSide;            // Long or Short
  entryPrice: number;            // Average entry price
  notional: number;              // Position value in quote currency
  leverage: number;              // Position leverage
  marginType?: MarginType;       // Cross or Isolated margin
  positionMode?: PositionMode;   // Hedged or One-way
  unrealizedPnl: number;         // Unrealized PnL
  realizedPnl?: number;          // Realized PnL
  contracts: number;             // Position size in base units (ALWAYS in base currency)
  contractsNative?: number;      // Position size in native contracts
  liquidationPrice: number;     // Liquidation price
  lastUpdate?: number;           // Last update timestamp
  info?: any;                    // Exchange-specific data
  extra?: {                      // Additional position data
    contractsNative?: number;    // Native contract size (use for orders)
    unrealizedPnlNative?: number; // Native unrealized PnL
  };
};
```

> **⚠️ Important Note on Position Sizing:**
>
> `position.contracts` is **ALWAYS** in the base currency, even for non-linear or non-standard contract-sized markets. This differs from orders and ensures that PnL and other mathematical calculations can always use linear formulas.
>
> For submitting orders with the correct position size:
> - **Safest approach**: Use `const amount = position.extra?.contractsNative || position.contracts`
> - **Alternative**: Use `api.utils.convertFromBaseSizeToNative(position.contracts, symbol, account)` which safely handles the conversion (no-op in most cases where size is already in base)
>
> The `contractsNative` field only exists when the native sizing for the market is not in whole units of the base currency.



#### DisplayedPosition
```typescript
type DisplayedPosition = Position & {
  account: string;                 // Account identifier
  ticker?: Ticker;                 // Current ticker data
  market?: Market;                 // Market information
  balance?: Balance;               // Account balance
  exchangeName?: string;           // Exchange name
  oneMinUpnl?: number;             // 1-minute unrealized PnL
  fiveMinUpnl?: number;            // 5-minute unrealized PnL
  hasActiveChaser?: boolean;       // Has active chaser order
  hasActiveTWAP?: boolean;         // Has active TWAP order
  isFakePosition?: boolean;        // Is simulated position
  chaserSize?: number;             // Chaser order size
};
```


### Market Types

#### Market
```typescript
type Market = {
  id: string;                    // Market identifier
  symbol: string;                // Trading pair (e.g., "BTC-USDT")
  base: string;                  // Base currency (e.g., "BTC")
  quote: string;                 // Quote currency (e.g., "USDT")
  active: boolean;               // Market is active for trading
  precision: {                   // Price and amount precision
    amount: number;              // Amount decimal places
    price: number;               // Price decimal places
  };
  limits: {                      // Trading limits
    amount: {                    // Amount limits
      min: number;               // Minimum order amount
      max: number;               // Maximum order amount
    };
    leverage: {                  // Leverage limits
      min: number;               // Minimum leverage
      max: number;               // Maximum leverage
    };
  };
  contractSize?: number;         // Contract size for derivatives
  isExpiring?: boolean;          // Contract has expiry
  isInverse?: boolean;           // Inverse contract
  isSpot?: boolean;              // Spot market
  isReadOnly?: boolean;          // Read-only market
  takerFee?: number;             // Taker fee rate
  makerFee?: number;             // Maker fee rate
  info?: any;                    // Exchange-specific data
};
```

### Balance Types

#### Balance
```typescript
type Balance = {
  used: number;                           // Balance in use (orders, positions)
  free: number;                           // Available balance
  total: number;                          // Total balance
  upnl: number;                           // Unrealized PnL
  currencies?: { [currency: string]: Balance }; // Per-currency breakdown
  coins?: { [coin: string]: CoinBalance }; // Per-coin breakdown
  info?: any;                             // Exchange-specific data
};
```

#### CoinBalance
```typescript
type CoinBalance = {
  base: string;        // Coin symbol
  amount: number;      // Coin amount
  notional: number;    // Notional value in quote currency
};
```

### Ticker Types

#### Ticker
```typescript
type Ticker = {
  id: string;          // Ticker identifier
  symbol: string;      // Trading pair
  bid: number;         // Best bid price
  ask: number;         // Best ask price
  last: number;        // Last traded price
  mark: number;        // Mark price (for derivatives)
  index: number;       // Index price (for derivatives)
  percentage: number;  // 24h price change percentage
  openInterest: number; // Open interest
  fundingRate: number; // Current funding rate
  fundingTime: number; // Next funding time
  volume: number;      // 24h base volume
  quoteVolume: number; // 24h quote volume
  info?: any;          // Exchange-specific data
};
```

### Candle Types

#### Candle
```typescript
type Candle = {
  timestamp: number;   // Candle timestamp
  open: number;        // Opening price
  high: number;        // Highest price
  low: number;         // Lowest price
  close: number;       // Closing price
  volume: number;      // Trading volume
  lastSide?: OrderSide; // Last trade side
};
```

### OrderBook Types

#### OrderBook
```typescript
type OrderBook = {
  bids: OrderBookOrders[];  // Buy orders (highest price first)
  asks: OrderBookOrders[];  // Sell orders (lowest price first)
};
```

#### OrderBookOrders
```typescript
type OrderBookOrders = {
  price: number;   // Price level
  amount: number;  // Total amount at this price
  total: number;   // Cumulative total from best price
};
```

### Timeframe Types

```typescript
// Standard timeframes
type Timeframe = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '12h' | '1d' | '1w';
```

### Usage in Custom Modules

All these types are automatically available in your module editor with full IntelliSense support:

```typescript
function useHotkeyHandler() {
  const { useActiveSymbol, useActiveAccount, useTicker, usePositions } = api.hooks;
  const [activeSymbol] = useActiveSymbol();
  const [activeAccount] = useActiveAccount();
  
  // Full type safety with Ticker and Position types
  const ticker: Ticker | null = api.hooks.useTicker(activeSymbol, activeAccount);
  const positions: Position[] = api.hooks.usePositions({ account: activeAccount });
  
  return async () => {
    if (!ticker?.bid) {
      api.toast.error('No bid price available');
      return;
    }
    
    // Use api.constants for enum values
    try {
      await api.orders.placeLimitOrder(
        activeSymbol, 
        activeAccount, 
        api.constants.OrderSide.Buy,  // Use api.constants
        {
          price: ticker.bid,
          amount: 100,
          postOnly: true,
          timeInForce: api.constants.OrderTimeInForce.PostOnly  // Use api.constants
        }
      );
      api.toast.success('Order placed successfully');
    } catch (error) {
      api.toast.error(`Order failed: ${error.message}`);
    }
  };
}
```

## Styling

### Tailwind CSS Classes
All Tailwind CSS utility classes are available for use in your custom modules. You can use them directly in your JSX:

```javascript
<div className="p-4 bg-gray-900 rounded-lg">
  <h2 className="text-xl font-bold mb-4 text-white">My Module</h2>
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-green-500/10 p-3 rounded">
      <span className="text-green-500">Long Position</span>
    </div>
    <div className="bg-red-500/10 p-3 rounded">
      <span className="text-red-500">Short Position</span>
    </div>
  </div>
</div>
```

Common Tailwind utilities for trading interfaces:
- **Colors**: `text-green-500` (profits), `text-red-500` (losses), `bg-gray-900` (dark backgrounds)
- **Spacing**: `p-4`, `m-2`, `gap-4`, `space-x-2`
- **Layout**: `flex`, `grid`, `grid-cols-2`, `flex-col`, `items-center`, `justify-between`
- **Typography**: `text-sm`, `text-lg`, `font-bold`, `font-mono`
- **Borders**: `border`, `rounded-lg`, `border-gray-700`
- **Effects**: `hover:bg-gray-800`, `transition-colors`, `opacity-50`

### Inline Styles
You can also use traditional inline styles:

```javascript
<div style={{ padding: 16, backgroundColor: '#1a1a1a' }}>
  <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
    {utils.formatCurrency(value)}
  </span>
</div>
```

## Core Libraries

### React
React is automatically made available in your module's scope. You can use React hooks and methods directly:

```javascript
// React methods are available globally in your module
const { useState, useEffect, useMemo, useCallback, useRef } = React;
const { Fragment } = React;

// Or use them directly
const [state, setState] = React.useState(initialValue);
```

### Ant Design Components

All Ant Design (v5.x) components are available through `api.antd`. Component types are marked as 'any' due to complexity in the browser editor environment.

**Note**: Ant Design is available but not well typed due to browser limitations. Please refer to the official Ant Design documentation for detailed type information and usage: [https://ant.design/components/overview](https://ant.design/components/overview)

```javascript
// All Ant Design components are available
const { Button, Input, Table, Card, Space, Row, Col, Modal, message } = api.antd;

// Example usage
<Button type="primary" onClick={handleClick}>
  Click me
</Button>

<Table 
  dataSource={data} 
  columns={columns}
  pagination={{ pageSize: 10 }}
/>

// Using message for notifications
api.antd.message.success('Operation completed!');
```

Common components include:
- **Layout**: Row, Col, Space, Divider, Layout
- **Navigation**: Menu, Breadcrumb, Dropdown, Pagination, Steps
- **Data Entry**: Button, Input, InputNumber, Select, Switch, Slider, Radio, Checkbox, Form, DatePicker, TimePicker
- **Data Display**: Table, Tag, Badge, Card, Statistic, List, Descriptions, Empty, Avatar, Carousel, Collapse, Tree
- **Feedback**: Alert, Spin, Progress, Skeleton, message, notification, Modal, Drawer, Popconfirm
- **Typography**: Typography (with Text, Title, Paragraph)
- **Other**: Tooltip, Popover, ConfigProvider, FloatButton, Watermark

All components support their full props and functionality as documented in the Ant Design documentation.

### Lodash
```javascript
api.lodash // Full lodash library
api._ // Alias for lodash
```

**Note**: Lodash is available but not well typed due to browser limitations. Please refer to the official Lodash documentation for detailed type information and usage: [https://lodash.com/docs](https://lodash.com/docs)

## Custom Hooks

### Tab State Management
### Market & Account Hooks
```javascript
// Get active account with setter - returns [value, setter]
const [account, setAccount] = api.hooks.useActiveAccount();
// account: string (e.g., "binance:main")
// setAccount: (account: string) => void

// Get active symbol with setter - returns [value, setter]  
const [symbol, setSymbol] = api.hooks.useActiveSymbol();
// symbol: string (e.g., "BTC-USDT")
// setSymbol: (symbol: string) => void

// Get market for a symbol/account
const market = api.hooks.useMarket(symbol?, accountName?);
// Returns: Market object with symbol, base, quote, precision, limits, etc.

// Get selected exchange name from account name
const exchangeName = api.hooks.useSelectedExchangeName(accountName?);
// Returns: string (e.g., "binance")

// Get all active account names
const activeAccounts = api.hooks.useActiveAccounts();
// Returns: string[] of account names (e.g., ["binance:main", "bybit:sub1"])

// Check if markets are loaded
const marketsLoaded = api.hooks.useMarketsLoaded(accountName?);
// Returns: boolean

// Get active exchange object
const exchange = api.hooks.useActiveExchangeObject(accountName?);
// Returns: Exchange object or null
```

### Data Hooks
```javascript
// Positions with multi-account support
const positions = api.hooks.usePositions({
  account?: string,
  symbol?: string,
  includeMultipleAccounts?: boolean
});

// Orders with filtering - includes in-progress orders (creating, canceling, etc.)
const orders = api.hooks.useOrders({
  account?: string,
  symbol?: string,
  type?: 'market' | 'limit' | 'stop_market' | 'take_profit_market' | 'trailing_stop_market',
  status?: 'open' | 'closed' | 'canceled' | 'creating' | 'updating' | 'canceling'
});
// Returns: Order[] with proper account field and in-progress status handling

// Orderbook data
const orderbook = api.hooks.useOrderbook(symbol?, accountName?);
// Returns: OrderBookUpdate object with bids, asks, and metadata

// Ticker data
const ticker = api.hooks.useTicker(symbol?, accountName?);
// Returns: Ticker object with bid, ask, last price, volume, etc.

// All markets for an account
const markets = api.hooks.useMarkets(accountName?);
// Returns: Market[] with all available trading pairs for the account

// All tickers for an account
const tickers = api.hooks.useTickers(accountName?);
// Returns: Ticker[] with all ticker data for the account

// Balance
const balance = api.hooks.useBalance(accountName?);
// Returns: { total, free, used, upnl }

// Combined balance across all accounts
const combinedBalance = api.hooks.useCombinedBalance();
// Returns: { total, free, used, upnl, longExposure, shortExposure, totalNotional, currencies }
```

### Utility Hooks
```javascript
// Re-render every X seconds
api.hooks.useRerenderEveryXSeconds(seconds);

// Countdown timer
const remaining = api.hooks.useCountdown(targetTime);

// Exchange loaded state
const isLoaded = api.hooks.useExchangeLoaded(exchangeName?);

// All exchanges loaded state
const { exchangesLoaded, anonymousExchangesLoaded } = api.hooks.useExchangesLoaded();

// Previous value
const prevValue = api.hooks.usePrevious(value);

// Dev mode
const isDevMode = api.hooks.useDevMode();

// Theme
const theme = api.hooks.useTheme();

// Privacy mode
const privacyMode = api.hooks.usePrivacyMode();

// App settings
const settings = api.hooks.useAppSettings();
```

## Order Management

### Place Orders

### Order Options Types
Order placement methods use different option types depending on the order type:

```typescript
// For regular orders (market, limit)
type PlaceOrderOptions = {
  type?: 'market' | 'limit' | 'stop_market' | 'take_profit_market' | 'trailing_stop_market';  // Use api.constants.OrderType
  side?: 'buy' | 'sell';         // Use api.constants.OrderSide
  amount: number;                // Required: Order size in base currency
  price?: number;                // Limit price (required for limit orders)
  reduceOnly?: boolean;          // If true, only reduces position
  
  // Bracket order fields - these create additional TP/SL orders alongside the main order
  // Example: A limit order can be placed with both Take Profit and Stop Loss at the same time
  stopLoss?: number;             // Stop loss price for bracket order
  takeProfit?: number;           // Take profit price for bracket order
  timeInForce?: 'GoodTillCancel' | 'ImmediateOrCancel' | 'FillOrKill' | 'PostOnly';  // Use api.constants.OrderTimeInForce
  tpTriggerType?: 'mark_price' | 'last_price' | 'index_price';  // Take profit trigger type - Use api.constants.OrderStopTriggerType
  slTriggerType?: 'mark_price' | 'last_price' | 'index_price';  // Stop loss trigger type - Use api.constants.OrderStopTriggerType
}

// For stop loss orders specifically
type StopOrderOptions = {
  type?: 'market' | 'limit' | 'stop_market' | 'take_profit_market' | 'trailing_stop_market';  // Use api.constants.OrderType
  side?: 'buy' | 'sell';         // Order side - Use api.constants.OrderSide
  amount?: number;               // Order size in base currency
  price?: number;                // Trigger price for stop orders
  timeInForce?: 'GoodTillCancel' | 'ImmediateOrCancel' | 'FillOrKill' | 'PostOnly';  // Use api.constants.OrderTimeInForce
  triggerType?: 'mark_price' | 'last_price' | 'index_price';  // Stop trigger type - Use api.constants.OrderStopTriggerType
}
```

**Note:** Any omitted optional fields in order creation methods will be automatically derived from the current order form state (e.g., default order size, time-in-force settings, etc.).

### Order Placement Methods

All order placement methods now throw errors on failure instead of returning result objects:
```typescript
// All methods throw on error, return order IDs on success
// Wrap in try-catch for error handling
```

```javascript
// Market order - uses PlaceOrderOptions
try {
  const orderIds = await api.orders.placeMarketOrder(symbol, accountName, side, {
    amount: 0.01,
    reduceOnly: false,
    stopLoss: 65000,          // Creates bracket stop loss order
    takeProfit: 75000         // Creates bracket take profit order
  });
  // Returns: string[] of order IDs
} catch (error) {
  // Handle error
  console.error('Order failed:', error.message);
}

// Limit order - uses PlaceOrderOptions
try {
  const orderIds = await api.orders.placeLimitOrder(symbol, accountName, side, {
    amount: 0.01,
    price: 70000,
    timeInForce: api.constants.OrderTimeInForce.PostOnly,
    reduceOnly: false,
    stopLoss: 65000,          // Creates bracket stop loss order
    takeProfit: 75000         // Creates bracket take profit order
  });
  // Returns: string[] of order IDs
} catch (error) {
  // Handle error
  console.error('Order failed:', error.message);
}

// Stop loss order - uses StopOrderOptions
// IMPORTANT: Stop loss orders are ALWAYS reduce-only (close on trigger)
// The reduceOnly parameter is ignored - stop losses will always only close positions
try {
  const orderIds = await api.orders.placeStopLossOrder(symbol, accountName, side, {
    amount: 0.01,
    price: 65000,
    triggerType: api.constants.OrderStopTriggerType.MarkPrice
  });
  // Returns: string[] of order IDs
} catch (error) {
  // Handle error
  console.error('Stop loss failed:', error.message);
}

// Scaled order
try {
  const orderIds = await api.orders.placeScaledOrder(symbol, accountName, side, options);
  // Returns: string[] of order IDs
} catch (error) {
  // Handle error
}

// TWAP order (Time-Weighted Average Price)
try {
  const result = await api.orders.placeTWAPOrder(symbol, accountName, side, {
    size: 0.1,                      // Total order size
    duration: 3600,                 // Duration in seconds (default: 3600)
    ordersCount: 10,                // Number of orders to split into (default: 10)
    chaserDelay: 5000,              // Delay for chaser orders in ms
    reduceOnly: false,              // Reduce-only flag
    randomnessPercentage: 10,       // Randomness percentage (0-100)
    useLimitOrders: true,           // Use limit orders (default: true)
    useChaserOrders: false          // Use chaser orders
  });
  // Returns the TWAP result
} catch (error) {
  // Handle error
}
```

### Important: Stop Loss Order Behavior

**Stop loss orders are ALWAYS reduce-only (close on trigger)**. This means:
- They will only close existing positions, never open new ones
- The `reduceOnly` parameter is ignored - it's always treated as `true`
- If you don't have a position, the stop loss order will be rejected
- Stop losses are designed solely for risk management and position protection

```javascript
// Example: This stop loss will ONLY close your long position when triggered
const result = await api.orders.placeStopLossOrder(
  'BTC-USDT', 
  'myAccount', 
  api.constants.OrderSide.Sell,  // Sell to close a long position
  {
    amount: position.contracts,
    price: 65000,
    triggerType: api.constants.OrderStopTriggerType.MarkPrice
  }
);
```

### Order Actions
```javascript
// Cancel single order
try {
  await api.orders.cancelOrder(accountName, order);
  // Order cancelled successfully
} catch (error) {
  console.error('Cancel failed:', error.message);
}

// Cancel multiple orders
try {
  await api.orders.cancelOrders(accountName, orders);
  // Orders cancelled successfully
} catch (error) {
  console.error('Cancel failed:', error.message);
}

// Update order
try {
  await api.orders.updateOrder(accountName, order, updates);
  // Order updated successfully
} catch (error) {
  console.error('Update failed:', error.message);
}

// Chase order - aggressively fills at market
try {
  const orderId = await api.orders.chaseOrder(accountName, 
    { symbol: string, side: OrderSide, size?: number },
    { size?: number, reduce?: boolean, delay?: number }
  );
  // Returns: string (order ID)
} catch (error) {
  console.error('Chase order failed:', error.message);
}
```

### Helper Methods
```javascript
// Close position
try {
  await api.orders.closePosition(position);
  // Position closed successfully
} catch (error) {
  console.error('Close failed:', error.message);
}

// Set breakeven stop
try {
  await api.orders.setBreakeven(position);
  // Breakeven stop set successfully
} catch (error) {
  console.error('Set breakeven failed:', error.message);
}

// Get tracked price
const price = api.orders.getTrackedPrice(
  trackEnabled, side, trackDistance, accountName, symbol, fallbackPrice
);

// Get available max order size
const maxSize = api.orders.getAvailableMaxOrderSize(options);
```

## Exchange API

### Market & Symbol Data
```javascript
// Get all markets
const markets = api.exchange.getMarkets(accountName?);

// Get specific market
const market = api.exchange.getMarket(symbol?, accountName?);

// Get ticker
const ticker = api.exchange.getTicker(symbol?, accountName?);

// Get all tickers for an account
const tickers = api.exchange.getTickers(accountName?);

// Get exchange store for low-level access
const store = api.exchange.getStore(accountName?);
// Returns: Store object with markets, tickers, positions, orders, balance, etc.
```

### Account Data
```javascript
// Get balance (now requires accountName)
const balance = api.exchange.getBalance(accountName);

// Get combined balance across multiple accounts
const combinedBalance = api.exchange.getCombinedBalance(accountNames?: string[]);

// Get positions
const positions = api.exchange.getPositions({ 
  symbol?: string,
  account?: string 
});

// Get orders with enhanced filtering
const orders = api.exchange.getOrders({ 
  symbol?: string,
  account?: string,
  type?: ('market' | 'limit' | 'stop_market' | 'take_profit_market' | 'trailing_stop_market') | string[],
  status?: 'open' | 'closed' | 'canceled' | 'creating' | 'updating' | 'canceling'
});

// Get account info
const info = api.exchange.getAccountInfo(accountName?);

// Get all accounts
const accounts = api.exchange.getAllAccounts();

// Set leverage for a symbol
try {
  await api.exchange.setLeverage(accountName, symbol, leverage);
  // Example: await api.exchange.setLeverage('Binance-1', 'BTC/USDT:USDT', 10);
} catch (error) {
  console.error('Failed to set leverage:', error.message);
}
```

### Safe Methods (Read-only)
```javascript
// Call safe exchange methods
const data = await api.exchange.callMethod(accountName, methodName, ...args);
// Allowed methods: fetchTicker, fetchOrderBook, fetchTrades, fetchBalance, etc.
```

## Utilities

### Formatting
```javascript
// Numbers
api.utils.formatNumber(n, decimals = 2)
api.utils.formatCurrency(n)
api.utils.formatPercent(n)
api.utils.abbreviateNumber(n)
api.utils.formatLarge(n, decimals = 2)
api.utils.formatPnl(pnl)
api.utils.formatSide(side)

// International formatting
api.utils.formatUsdValueIntl(value)
api.utils.formatUsdPriceIntl(price)
api.utils.formatCurrencyValueIntl(value, currency)
api.utils.convertToLocalRoundedStr(value, currency?)

// Privacy mode (Note: always shows actual values in modules)
api.utils.privacy(value, suffix?)

// Account management
api.utils.getActiveAccounts() // Returns array of active account strings

// Currency utilities
api.utils.currencyUtils.isUsdLikeCurrency(currency)
api.utils.currencyUtils.isBtcLikeCurrency(currency)
api.utils.currencyUtils.isEquivalentCurrency(currency1, currency2)
api.utils.currencyUtils.isBtcLikeSymbol(symbol)
api.utils.currencyUtils.getCurrencySigDigits(currency)
api.utils.currencyUtils.getCurrencyPrecision(currency)

// Historical position utilities
api.utils.getHistoricalPosition(accountName, symbol, side)
api.utils.getBreakevenPrice(historicalPosition)

// Date manipulation with Day.js
api.utils.dayjs().format('YYYY-MM-DD')
api.utils.dayjs('2024-01-01').add(1, 'day')
api.utils.dayjs().subtract(1, 'hour').toISOString()

// Device detection
api.utils.isMobile // boolean flag for mobile device

// Exchange metadata
api.utils.getExchangeMetadata('binance') // Returns exchange capabilities and limits
```

### Position Calculations
```javascript
// PnL calculations
api.utils.calculatePnlPercent(entry, current, side)  // Calculate PnL percentage for a position
api.utils.calculateReturns(position, pnl)            // Calculate ROE/ROI returns

// Position sizing
api.utils.calculateFuturePositionSizeAtPrice(market, currentPosition, currentPrice, targetPrice, pnl)
api.utils.getCurrentPositionSizeAndLeverage(positions, symbol)  // Returns { size, leverage }

// Margin calculations
api.utils.calculateImr(exchange, market, size, price)  // Calculate initial margin requirement
```

### Account & Symbol Utilities
```javascript
// Account management
api.utils.accountIsActive(accountName)
api.utils.getExchangeNameFromAccountName(accountName)
api.utils.getExchangeByName(exchangeName)  // Get exchange info by name
api.utils.setActiveAccount(account)
api.utils.setActiveSymbol(symbol, account?)
api.utils.getActiveSymbol()

// Symbol conversion
api.utils.convertSymbolStateful(symbol, fromExchange, toExchange)
api.utils.convertSymbolPure(symbol, fromExchange, toExchange)
api.utils.toBinanceOrBybitSymbol(symbol)
api.utils.getBaseCoinFromSymbol(symbol)
api.utils.findBtcSymbolForExchange(exchange)
api.utils.getSymbolLogo(symbol)
```

### Order Utilities
```javascript
// Order management
api.utils.getOrderForm(accountName, symbol)
api.utils.getOpenOrderWithInProgressByAccount(accountName)
api.utils.isFullStop(order)  // Check if order is a full stop order
api.utils.validateOrderSize(market, orderSize, price?)  // Returns { valid, error? }
api.utils.getReferencePriceForTriggerType(triggerType, ticker)  // Get reference price for trigger orders
```

### Balance Utilities
```javascript
api.utils.getTotalBalanceFromBalance(balance)
api.utils.getTotalMarginFromBalance(balance)
api.utils.getAvailableMarginFromBalance(balance)
api.utils.getMarginCurrency(market)
api.utils.getBalanceSlice(accountName)  // Get balance data for account
```

### Color Utilities
```javascript
api.utils.generateOpaqueColor(color, opacity)  // Generate opaque color with opacity
api.utils.getColorIsLight(color)               // Check if color is light
api.utils.getContrastColor(color)              // Get contrasting color for readability
api.utils.getLeverageColor(leverage, theme)    // Get color based on leverage level
api.utils.safeTradingViewColor(color)          // Ensure color is safe for TradingView
api.utils.getTheme()                           // Get current theme
api.utils.colorHelpers                         // Color helper utilities
api.utils.derivedColors                        // Derived color palette
```

### Price Utilities
```javascript
api.utils.getTrackedPrice(enabled, side, distance, account, symbol, fallback)
api.utils.getBBOMid(bids, asks)
api.utils.getNearTouchPrice(side, ticker, market, exchange)
api.utils.getFarTouchPrice(side, ticker, market, exchange)
api.utils.getTicker(symbol, accountName)  // Get ticker data for symbol/account
api.utils.getTickerPredictedBestAsk(ticker)
api.utils.getTickerPredictedBestBid(ticker)
api.utils.getMarket(symbol, accountName)  // Get market info for symbol/account
```

### Time Utilities
```javascript
api.utils.getCandleEndTime(timeframe, timeInSeconds)
api.utils.getCandleStartTime(timeframe, timeInSeconds)
api.utils.getNumCandlesInRange(timeframe, from, to)
api.utils.normalizeEpochToSeconds(epoch)
api.utils.sleep(ms)  // Async sleep/delay function
```

### Other Utilities
```javascript
api.utils.uuid()  // Generate unique identifier
api.utils.omitUndefined(obj)  // Remove undefined properties from object
```

### Risk Calculation Utilities

The risk utilities provide sophisticated risk analysis for positions and orders.

```javascript
// Format P&L with optional precision and prefix
api.utils.risk.formatPnl(pnl: number, precision?: number, prefix?: string)
// Example: formatPnl(1234.56, 2, '$') → "$1,234.56"

// Filter and sort orders in profit direction
api.utils.risk.filterAndSortOrdersInProfitDirection(
  orders: Order[],
  entryPrice: number,
  positionSide: 'long' | 'short'
) // Returns: Order[] sorted by distance from entry

// Filter and sort orders in loss direction  
api.utils.risk.filterAndSortOrdersInLossDirection(
  orders: Order[],
  entryPrice: number,
  positionSide: 'long' | 'short'
) // Returns: Order[] sorted by distance from entry

// Calculate comprehensive risk for all orders
const ordersRisk = api.utils.risk.calculateOrdersRisk(
  markets: Market[],
  tickers: Ticker[],
  positions: Position[],
  orders: Order[]
);
// Returns: { [orderId: string]: OrderRiskProfile[] }
// Each OrderRiskProfile contains: orderPnl, totalRealizedPnl, rollingUnrealizedPnl, etc.

// Calculate risk metrics at a specific price point
const riskAtPrice = api.utils.risk.calculateRiskAtPrice(
  price: number,
  symbol: string,
  ordersRisk: { [orderId: string]: any },
  positions: Position[],
  orders: Order[]
);
// Returns: { positionSize, positionSide, unrealizedPnl, realizedPnl } | null
```

#### Example: Risk Analysis at Target Price
```javascript
function analyzeRiskAtTarget() {
  const { useActiveSymbol, useActiveAccount, usePositions, useOrders, useTicker, useMarkets } = api.hooks;
  const [activeSymbol] = useActiveSymbol();
  const [activeAccount] = useActiveAccount();
  
  const markets = useMarkets();
  const tickers = [useTicker(activeSymbol, activeAccount)];
  const positions = usePositions({ account: activeAccount });
  const orders = useOrders({ account: activeAccount });
  
  // Calculate risk for all orders
  const ordersRisk = api.utils.risk.calculateOrdersRisk(
    markets, tickers, positions, orders
  );
  
  // Analyze risk at specific price points
  const currentPrice = tickers[0]?.last || 0;
  const targetPrices = [
    currentPrice * 0.95,  // 5% down
    currentPrice * 1.05   // 5% up
  ];
  
  targetPrices.forEach(price => {
    const risk = api.utils.risk.calculateRiskAtPrice(
      price, activeSymbol, ordersRisk, positions, orders
    );
    
    if (risk) {
      console.log(`At $${price}:`);
      console.log(`  Position: ${risk.positionSize} ${risk.positionSide}`);
      console.log(`  Unrealized PnL: ${api.utils.risk.formatPnl(risk.unrealizedPnl)}`);
      console.log(`  Realized PnL: ${api.utils.risk.formatPnl(risk.realizedPnl)}`);
    }
  });
}
```

### Math Utilities

#### Price and Amount Rounding
The `adjust` method is the recommended way to round prices and amounts to the correct precision for an exchange.

**Important:** The `market.precision.price` and `market.precision.amount` values are **already the step sizes** (tick sizes), NOT the number of decimal places. For example:
- `market.precision.price = 0.01` means the price must be in increments of 0.01
- `market.precision.amount = 0.001` means the amount must be in increments of 0.001

```javascript
// Get market data
const market = api.utils.getMarket(activeSymbol, activeAccount);

// market.precision.price is the tick size (e.g., 0.01, 0.001, 0.0001)
// NO NEED to use Math.pow(10, -precision) - it's already the step size!
const tickSize = market?.precision?.price || 0.01;
const amountStep = market?.precision?.amount || 0.001;

// Round price to the market's tick size
if (market?.precision?.price) {
  const roundedPrice = api.utils.math.adjust(price, market.precision.price);
}

// Round amount to the market's amount precision
if (market?.precision?.amount) {
  const roundedAmount = api.utils.math.adjust(amount, market.precision.amount);
}

// Example: Round stop loss price
let stopPrice = entryPrice * 0.98; // 2% below entry
stopPrice = api.utils.math.adjust(stopPrice, market.precision.price);

// Example: Adjust order price by one tick
const improvedBidPrice = api.utils.math.adjust(ticker.bid + market.precision.price, market.precision.price);
const improvedAskPrice = api.utils.math.adjust(ticker.ask - market.precision.price, market.precision.price);
```

#### All Math Utilities
```javascript
api.utils.math.roundToNearestMultiple(value, multiple)     // Round to nearest multiple
api.utils.math.roundToNearestMultipleUp(value, multiple)   // Round up to multiple
api.utils.math.roundToNearestMultipleDown(value, multiple) // Round down to multiple
api.utils.math.adjust(value, precision)                    // Round to exchange precision (recommended)
api.utils.math.getSigDigitsFromPrecision(precision)        // Get significant digits from precision
api.utils.math.clamp(value, min, max)                      // Constrain value between min and max
api.utils.math.percentChange(from, to)                     // Calculate percentage change
api.utils.math.valueChangePercent(percent, value)          // Apply percentage change to value
```

### Sizing Conversion Utilities
```javascript
// Convert between notional (USD), base, and native sizes
api.utils.convertNotionalToNative(notionalSize, symbol, accountName, price?)  // USD to native
api.utils.convertBaseToNative(baseSize, symbol, accountName, price?)          // Base to native
api.utils.convertNativeToNotional(nativeSize, symbol, accountName, price?)    // Native to USD
api.utils.convertNativeToBase(nativeSize, symbol, accountName, price?)        // Native to base
```


## Data Manipulation

```javascript
// Sorting
api.data.sortBy(array, key, desc?)

// Grouping
api.data.groupBy(array, key)

// Math operations
api.data.sum(numbers)
api.data.average(numbers)
api.data.median(numbers)

// Array utilities
api.data.unique(array)
api.data.chunk(array, size)
```

## Logging & Toasts

### Console Logging
```javascript
api.log.info(message, ...args)
api.log.warn(message, ...args)
api.log.error(message, ...args)
api.log.debug(message, ...args)
```

### Toast Notifications
```javascript
api.toast.success(message)
api.toast.error(message)
api.toast.warning(message)
api.toast.info(message)
```

## UI Components

### Tealstreet Components
```javascript
// Display Components
api.components.ColoredNumber       // Displays numbers with red/green color based on value
api.components.ButtonWithConfirm   // Button with confirmation dialog
api.components.Account            // Account display with exchange icon
api.components.SymbolDisplay      // Symbol display with formatting
api.components.SymbolIcon         // Icon for cryptocurrency symbols
api.components.ExchangeIcon       // Icon for exchanges

// Table Components
api.components.FastTable          // Adaptive high-performance table (switches between fast and simple based on data size)
api.components.BlueTabs          // Styled tab component

// Position Table Column Components
api.components.RealizedPnlColumn    // Column for displaying realized PnL
api.components.SizeColumn          // Column for displaying position size
api.components.UnrealizedPnlColumn // Column for displaying unrealized PnL
api.components.OpenPositionsPopoverSide // Settings popover for position table

// Trading Input Components
api.components.SizeInput         // Professional size input with market-aware features
// Props: size, setSize, price, activeSymbol, activeAccount, style

api.components.PriceInput        // Price input with precision and tracking support
// Props: price, setPriceCallback, activeSymbol, activeAccount

api.components.OrderSizeButtons  // Quick size selection buttons (e.g., +100 USDT, CC)
// Props: prevSize, setSize, activeAccount, activeSymbol, price

api.components.QuickOrderButton  // One-click order placement (offer/take with offset)
// Props: offset, side, type, size, postOnly, reduceOnly, activeSymbol, activeAccount

api.components.PostReduceOptions // Post-only and reduce-only checkboxes
// Props: post, reduce, setPostCallback, setReduceCallback
```

### Icons

All Ant Design icons are available through `api.icons`. This includes hundreds of icons for every use case.

**Full icon list**: [https://ant.design/components/icon](https://ant.design/components/icon)

```javascript
// Example usage
const { icons } = api;

return (
  <div>
    <icons.CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
    <icons.CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
    <icons.LoadingOutlined spin style={{ fontSize: 16 }} />
    <icons.ArrowUpOutlined style={{ color: 'green' }} />
    <icons.SettingOutlined />
  </div>
);
```

## State Management

### Jotai
Jotai is exposed for creating persistent state in your modules:

```javascript
// Basic atoms
api.jotai.atom                  // Create a basic atom
api.jotai.atomWithStorage       // Create a persistent atom

// Hooks
api.jotai.useAtom              // Read and write atom
api.jotai.useAtomValue         // Read-only atom
api.jotai.useSetAtom           // Write-only atom

// Helper for module-specific storage
api.jotai.createStorageAtom(key, defaultValue, storage?)
```

Example usage:
```javascript
// Create a persistent storage atom for your module
const settingsAtom = api.jotai.createStorageAtom('settings', {
  theme: 'dark',
  refreshInterval: 5000,
  showNotifications: true
});

// In your component
const Component = () => {
  const [settings, setSettings] = api.jotai.useAtom(settingsAtom);
  
  // Settings will persist across module reloads
  return (
    <div>
      <Switch 
        checked={settings.showNotifications}
        onChange={(checked) => 
          setSettings(prev => ({ ...prev, showNotifications: checked }))
        }
      />
    </div>
  );
};
```

## Constants

All constants are available through `api.constants` for use in your modules:

```javascript
// Order Side
api.constants.OrderSide.Buy         // 'buy'
api.constants.OrderSide.Sell        // 'sell'

// Order Types
api.constants.OrderType.Market             // 'market'
api.constants.OrderType.Limit              // 'limit'
api.constants.OrderType.StopLoss           // 'stop_market'
api.constants.OrderType.TakeProfit         // 'take_profit_market'
api.constants.OrderType.TrailingStopLoss   // 'trailing_stop_market'

// Order Status
api.constants.OrderStatus.Open         // 'open' - Order is active
api.constants.OrderStatus.Closed       // 'closed' - Order is filled
api.constants.OrderStatus.Canceled     // 'canceled' - Order was cancelled
api.constants.OrderStatus.Creating     // 'creating' - Order is being created
api.constants.OrderStatus.Updating     // 'updating' - Order is being updated
api.constants.OrderStatus.Canceling    // 'canceling' - Order is being cancelled

// Time in Force
api.constants.OrderTimeInForce.GoodTillCancel      // 'GoodTillCancel' - Default
api.constants.OrderTimeInForce.ImmediateOrCancel   // 'ImmediateOrCancel'
api.constants.OrderTimeInForce.FillOrKill          // 'FillOrKill'
api.constants.OrderTimeInForce.PostOnly            // 'PostOnly' - Maker only

// Stop Trigger Types
api.constants.OrderStopTriggerType.MarkPrice   // 'mark_price'
api.constants.OrderStopTriggerType.LastPrice   // 'last_price'
api.constants.OrderStopTriggerType.IndexPrice  // 'index_price'

// Order Reject Reasons
api.constants.OrderRejectReason.PostOnly            // 'PostOnly'
api.constants.OrderRejectReason.InsufficientBalance // 'InsufficientBalance'
api.constants.OrderRejectReason.ReduceOnly          // 'ReduceOnly'

// Position Side
api.constants.PositionSide.Long     // 'long'
api.constants.PositionSide.Short    // 'short'

// Margin Type
api.constants.MarginType.Isolated   // 'isolated'
api.constants.MarginType.Cross      // 'cross'

// Position Mode
api.constants.PositionMode.Hedged   // 'hedged' - Separate long/short
api.constants.PositionMode.OneWay   // 'oneway' - Net position
```

## Example Usage

### Basic Position Monitor
```javascript
// Simple position monitor
const Component = () => {
  const { antd, hooks, utils, orders, toast } = api;
  const { useState, useEffect } = React; // React is already in scope
  const { Table, Tag, Button } = antd;
  
  const [activeSymbol] = hooks.useActiveSymbol();
  const [activeAccount] = hooks.useActiveAccount();
  const positions = hooks.usePositions({ includeMultipleAccounts: true });
  
  const handleClose = async (position) => {
    try {
      await orders.closePosition(position);
      toast.success(`Position closed for ${position.symbol}`);
    } catch (error) {
      toast.error(`Failed: ${error.message}`);
    }
  };
  
  return (
    <Table
      dataSource={positions}
      columns={[
        {
          title: 'Symbol',
          dataIndex: 'symbol',
          render: (symbol) => <Tag>{symbol}</Tag>
        },
        {
          title: 'PnL',
          dataIndex: 'unrealizedPnl',
          render: (pnl) => utils.formatPnl(pnl)
        },
        {
          title: 'Action',
          render: (_, record) => (
            <Button onClick={() => handleClose(record)} danger size="small">
              Close
            </Button>
          )
        }
      ]}
    />
  );
};

return Component;
```

### Professional Trading Interface
```javascript
// Advanced trading panel with persistent settings
const settingsAtom = api.jotai.createStorageAtom('tradingSettings', {
  defaultSize: 100,
  postOnly: false,
  reduceOnly: false,
  quickOffsets: [1, 2, 5, 10]
});

const Component = () => {
  const { antd, hooks, components, orders, toast, constants, utils, jotai } = api;
  const { useState, useCallback } = React;
  const { Card, Space, Button, Row, Col, Divider, Tag, Switch } = antd;
  const { SizeInput, PriceInput, OrderSizeButtons, QuickOrderButton, PostReduceOptions } = components;
  const { OrderSide } = constants;
  
  // Tab state for multi-account support
  const [activeSymbol] = hooks.useActiveSymbol();
  const [activeAccount] = hooks.useActiveAccount();
  
  // Persistent settings
  const [settings, setSettings] = jotai.useAtom(settingsAtom);
  
  // Order state
  const [size, setSize] = useState(settings.defaultSize);
  const [price, setPrice] = useState(0);
  const [side, setSide] = useState(OrderSide.Buy);
  const [postOnly, setPostOnly] = useState(settings.postOnly);
  const [reduceOnly, setReduceOnly] = useState(settings.reduceOnly);
  
  // Market data
  const market = hooks.useMarket();
  const ticker = hooks.useTicker();
  const orderbook = hooks.useOrderbook();
  const balance = hooks.useBalance();
  
  // Save settings when they change
  const updateSettings = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, [setSettings]);
  
  return (
    <Card title="Professional Trading">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Quick Order Buttons */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <strong>Quick Orders:</strong>
          </div>
          <Row gutter={8}>
            {settings.quickOffsets.map(offset => (
              <Col span={6} key={offset}>
                <QuickOrderButton
                  offset={offset}
                  side={side}
                  type="offer"
                  size={size}
                  postOnly={postOnly}
                  reduceOnly={reduceOnly}
                  activeSymbol={activeSymbol}
                  activeAccount={activeAccount}
                />
              </Col>
            ))}
          </Row>
        </div>
        
        <Divider />
        
        {/* Size Selection */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <strong>Size:</strong>
            <Tag style={{ float: 'right' }}>
              Balance: {utils.formatCurrency(balance.free)}
            </Tag>
          </div>
          <OrderSizeButtons
            prevSize={size}
            setSize={setSize}
            activeAccount={activeAccount}
            activeSymbol={activeSymbol}
            price={price}
          />
          <SizeInput
            size={size}
            setSize={setSize}
            price={price}
            activeSymbol={activeSymbol}
            activeAccount={activeAccount}
            style={{ marginTop: 8 }}
          />
        </div>
        
        {/* Price Input */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <strong>Price:</strong>
            <span style={{ float: 'right' }}>
              Bid: {ticker.bid} | Ask: {ticker.ask}
            </span>
          </div>
          <PriceInput
            price={price}
            setPriceCallback={setPrice}
            activeSymbol={activeSymbol}
            activeAccount={activeAccount}
          />
        </div>
        
        {/* Order Options */}
        <PostReduceOptions
          post={postOnly}
          reduce={reduceOnly}
          setPostCallback={setPostOnly}
          setReduceCallback={setReduceOnly}
        />
        
        {/* Persistent Settings */}
        <div>
          <Divider orientation="left">Settings</Divider>
          <Space>
            <span>Default Size:</span>
            <Input
              type="number"
              value={settings.defaultSize}
              onChange={(e) => updateSettings('defaultSize', Number(e.target.value))}
              style={{ width: 100 }}
            />
            <span>Auto Post-Only:</span>
            <Switch
              checked={settings.postOnly}
              onChange={(checked) => updateSettings('postOnly', checked)}
            />
          </Space>
        </div>
        
        {/* Place Order Button */}
        <Button
          type="primary"
          size="large"
          block
          style={{
            backgroundColor: side === OrderSide.Buy ? '#52c41a' : '#ff4d4f'
          }}
          onClick={async () => {
            try {
              await orders.placeLimitOrder(
                activeSymbol,
                activeAccount,
                side,
                { amount: size, price, postOnly, reduceOnly }
              );
              toast.success('Order placed successfully');
            } catch (error) {
              toast.error(`Order failed: ${error.message}`);
            }
          }}
        >
          {side} {size} {market?.base} @ {price}
        </Button>
      </Space>
    </Card>
  );
};

return Component;
```

### Multi-Account Position Manager
```javascript
// Position manager with cross-account monitoring
const Component = () => {
  const { antd, hooks, utils, components, orders, toast, constants, lodash } = api;
  const { useState, useMemo } = React;
  const { Card, Table, Button, Space, Tag, Progress, Statistic, Row, Col, Select } = antd;
  const { ColoredNumber, ButtonWithConfirm } = components;
  const { PositionSide } = constants;
  
  // Multi-account data
  const positions = hooks.usePositions({ includeMultipleAccounts: true });
  const combinedBalance = hooks.useCombinedBalance();
  const activeAccounts = hooks.useActiveAccounts();
  
  // Filter state
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedSide, setSelectedSide] = useState('all');
  
  // Filter positions
  const filteredPositions = useMemo(() => {
    return positions.filter(pos => {
      if (selectedAccount !== 'all' && pos.account !== selectedAccount) return false;
      if (selectedSide !== 'all' && pos.side !== selectedSide) return false;
      return true;
    });
  }, [positions, selectedAccount, selectedSide]);
  
  // Calculate metrics
  const metrics = useMemo(() => {
    const byAccount = lodash.groupBy(filteredPositions, 'account');
    return Object.entries(byAccount).map(([account, positions]) => ({
      account,
      positionCount: positions.length,
      totalNotional: lodash.sumBy(positions, 'notional'),
      totalPnl: lodash.sumBy(positions, 'unrealizedPnl'),
      avgLeverage: lodash.meanBy(positions, 'leverage') || 0
    }));
  }, [filteredPositions]);
  
  const columns = [
    {
      title: 'Account',
      dataIndex: 'account',
      render: (account) => {
        const [exchange, name] = account.split(':');
        return (
          <Space>
            <components.ExchangeIcon exchange={exchange} />
            <span>{name}</span>
          </Space>
        );
      }
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      render: (symbol, record) => (
        <Space>
          <Tag color={record.side === PositionSide.Long ? 'green' : 'red'}>
            {record.side}
          </Tag>
          <components.SymbolDisplay symbol={symbol} />
        </Space>
      )
    },
    {
      title: 'Size',
      dataIndex: 'notional',
      render: (notional) => utils.formatCurrency(notional)
    },
    {
      title: 'PnL',
      dataIndex: 'unrealizedPnl',
      render: (pnl, record) => (
        <ColoredNumber value={pnl}>
          {utils.formatPnl(pnl)} ({utils.formatPercent(record.unrealizedPnlPercent / 100)})
        </ColoredNumber>
      )
    },
    {
      title: 'Leverage',
      dataIndex: 'leverage',
      render: (leverage, record) => {
        const theme = hooks.useTheme();
        return (
          <Tag color={utils.getLeverageColor(leverage, theme)}>
            {leverage.toFixed(1)}x
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      render: (_, position) => (
        <Space>
          <ButtonWithConfirm
            buttonText="Close"
            onConfirm={async () => {
              try {
                await orders.closePosition(position);
                toast.success(`Closed ${position.symbol} position`);
              } catch (error) {
                toast.error(`Failed: ${error.message}`);
              }
            }}
            size="small"
            danger
          />
          <Button
            size="small"
            onClick={async () => {
              try {
                await orders.setBreakeven(position);
                toast.success('Breakeven stop set');
              } catch (error) {
                toast.error(`Failed: ${error.message}`);
              }
            }}
          >
            B/E
          </Button>
        </Space>
      )
    }
  ];
  
  return (
    <div style={{ padding: 16 }}>
      {/* Summary Stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Balance"
              value={combinedBalance.total + combinedBalance.upnl}
              prefix="$"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total PnL"
              value={combinedBalance.upnl}
              prefix="$"
              precision={2}
              valueStyle={{ 
                color: combinedBalance.upnl >= 0 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Positions"
              value={filteredPositions.length}
              suffix={`/ ${positions.length}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Accounts"
              value={activeAccounts.length}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>Account:</span>
          <Select
            value={selectedAccount}
            onChange={setSelectedAccount}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Accounts</Select.Option>
            {activeAccounts.map(acc => (
              <Select.Option key={acc} value={acc}>
                {acc.split(':')[1] || acc}
              </Select.Option>
            ))}
          </Select>
          
          <span>Side:</span>
          <Select
            value={selectedSide}
            onChange={setSelectedSide}
            style={{ width: 100 }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value={PositionSide.Long}>Long</Select.Option>
            <Select.Option value={PositionSide.Short}>Short</Select.Option>
          </Select>
        </Space>
      </Card>
      
      {/* Positions Table */}
      <Card title="Open Positions">
        <Table
          dataSource={filteredPositions}
          columns={columns}
          rowKey={(record) => `${record.account}-${record.symbol}-${record.side}`}
          pagination={false}
        />
      </Card>
      
      {/* Account Summary */}
      <Card title="Account Summary" style={{ marginTop: 16 }}>
        <Table
          dataSource={metrics}
          columns={[
            { title: 'Account', dataIndex: 'account' },
            { title: 'Positions', dataIndex: 'positionCount' },
            { 
              title: 'Total Notional', 
              dataIndex: 'totalNotional',
              render: (val) => utils.formatCurrency(val)
            },
            { 
              title: 'Total PnL', 
              dataIndex: 'totalPnl',
              render: (val) => (
                <ColoredNumber value={val}>
                  {utils.formatPnl(val)}
                </ColoredNumber>
              )
            },
            { 
              title: 'Avg Leverage', 
              dataIndex: 'avgLeverage',
              render: (val) => `${val.toFixed(1)}x`
            }
          ]}
          rowKey="account"
          pagination={false}
        />
      </Card>
    </div>
  );
};

return Component;
```

### Simple Module with Tailwind CSS
```javascript
// Example using Tailwind CSS classes
const Component = () => {
  const { hooks, utils } = api;
  const { useState } = React;
  
  const positions = hooks.usePositions();
  const balance = hooks.useBalance();
  const [selectedTab, setSelectedTab] = useState("positions");
  
  return (
    <div className="p-4 min-h-full bg-gray-900">
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4 border-b border-gray-700">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === "positions" 
              ? "text-blue-500 border-b-2 border-blue-500" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setSelectedTab("positions")}
        >
          Positions
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === "balance" 
              ? "text-blue-500 border-b-2 border-blue-500" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setSelectedTab("balance")}
        >
          Balance
        </button>
      </div>
      
      {/* Content */}
      {selectedTab === "positions" ? (
        <div className="space-y-2">
          {positions.map((pos, index) => (
            <div key={`${pos.symbol}-${pos.account}-${index}`} className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-white">{pos.symbol}</span>
                  <span className={`text-sm ${pos.side === "Buy" ? "text-green-500" : "text-red-500"}`}>
                    {pos.side}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Size</div>
                  <div className="font-mono">{utils.formatNumber(pos.contracts)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">PnL</div>
                  <div className={`font-mono font-bold ${pos.unrealizedPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {utils.formatCurrency(pos.unrealizedPnl)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Balance</div>
              <div className="text-2xl font-bold text-white">
                {utils.formatCurrency(balance.total)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Free Balance</div>
              <div className="text-2xl font-bold text-green-500">
                {utils.formatCurrency(balance.free)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

return Component;
```
