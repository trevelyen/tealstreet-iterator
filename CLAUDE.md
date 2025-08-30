# Claude Code Instructions

## Project Overview
This is a **comprehensive development framework** for building custom UI components for the Tealstreet crypto trading terminal. It supports multi-component development with shared utilities and provides safe iteration outside the live trading environment.

## Development Workflow
1. **Choose your approach:**
   - **Single Component**: Edit `src/tealstreet-iterator/component.tsx` 
   - **Multiple Components**: Create new components in `examples/` folder
   - **Shared Logic**: Add utilities to `src/tealstreet-iterator/global-module.tsx`

2. **Development Process:**
   - Save → automatic rebuild → `component-ready.tsx` updates via hot reload
   - Copy `component-ready.tsx` content and paste into Tealstreet terminal

## Project Structure
```
src/tealstreet-iterator/
├── component.tsx              # Main component (basic template)
├── component-ready.tsx        # Auto-generated Tealstreet-ready version
├── global-module.tsx          # Shared utilities & state (optional)
├── examples/                  # Example component templates
│   ├── order-panel/
│   │   └── component.tsx      # Quick order placement UI
│   ├── position-monitor/
│   │   └── component.tsx      # Position tracking dashboard
│   └── risk-dashboard/
│       └── component.tsx      # Risk analysis & monitoring
└── adapter/                   # Development mocks (don't copy to Tealstreet)
```

## Development Commands
- `pnpm dev` - Start development server at http://localhost:5173
- Development server automatically rebuilds component-ready.tsx on save

## Multi-Component Development
The project now supports building **multiple specialized trading components**:

### Example Components Included:
1. **Order Panel** (`examples/order-panel/`) - Quick order placement with size/price inputs
2. **Position Monitor** (`examples/position-monitor/`) - Real-time position tracking with close buttons
3. **Risk Dashboard** (`examples/risk-dashboard/`) - Portfolio risk analysis with alerts

### Using Example Components:
1. Copy example to main component: `cp examples/order-panel/component.tsx src/tealstreet-iterator/component.tsx`
2. Customize the component for your needs
3. Hot reload will generate the Tealstreet-ready version

## Global Module (Advanced)
The `global-module.tsx` file provides shared utilities across components:

### Features:
- **Shared State**: Risk settings, daily P&L tracking, alerts
- **Utility Functions**: Position sizing, Fibonacci levels, risk calculations  
- **TypeScript Support**: Full type safety with IntelliSense
- **Persistent Storage**: Settings survive page reloads

### Usage in Components:
```javascript
// Import from global module
import { utils, hooks, RiskManager } from "global"

const Component = () => {
  const [settings] = hooks.useSharedSettings()
  const positionSize = utils.calculatePositionSize(balance, 2, stopDistance)
  // ...
}
```

## Styling Notes
- Currently using Tailwind classes in development
- Consider converting to inline styles for Tealstreet compatibility
- Tealstreet terminal may not support CSS frameworks

## Tealstreet API Quick Reference - Real Usage Examples

### Basic Component Structure
```javascript
const { antd, hooks, utils, orders, components, toast, constants } = api
const { useState, useEffect, useCallback } = React

const Component = () => {
  const [activeSymbol] = hooks.useActiveSymbol()
  const [activeAccount] = hooks.useActiveAccount()
  
  return <div>Your component here</div>
}

Component
```

### Essential Hooks
```javascript
// Market & Account
const [account, setAccount] = api.hooks.useActiveAccount()
const [symbol, setSymbol] = api.hooks.useActiveSymbol()
const market = api.hooks.useMarket(symbol?, accountName?)
const activeAccounts = api.hooks.useActiveAccounts()

// Data
const positions = api.hooks.usePositions({
  account?: string,
  symbol?: string,
  includeMultipleAccounts?: boolean
})

const orders = api.hooks.useOrders({
  account?: string,
  symbol?: string,
  type?: 'market' | 'limit' | 'stop_market',
  status?: 'open' | 'closed' | 'canceled'
})

const ticker = api.hooks.useTicker(symbol?, accountName?)
const balance = api.hooks.useBalance(accountName?)
const combinedBalance = api.hooks.useCombinedBalance()
```

### Order Placement - Real Examples
```javascript
// Market Order with Bracket Orders
try {
  const orderIds = await api.orders.placeMarketOrder(symbol, accountName, side, {
    amount: 0.01,
    reduceOnly: false,
    stopLoss: 65000,          // Creates bracket stop loss
    takeProfit: 75000         // Creates bracket take profit
  })
  // Returns: string[] of order IDs
} catch (error) {
  console.error('Order failed:', error.message)
}

// Limit Order
try {
  const orderIds = await api.orders.placeLimitOrder(symbol, accountName, side, {
    amount: 0.01,
    price: 70000,
    timeInForce: api.constants.OrderTimeInForce.PostOnly,
    reduceOnly: false,
    stopLoss: 65000,
    takeProfit: 75000
  })
} catch (error) {
  console.error('Order failed:', error.message)
}

// Stop Loss Order (Always Reduce-Only)
try {
  const orderIds = await api.orders.placeStopLossOrder(symbol, accountName, side, {
    amount: 0.01,
    price: 65000,
    triggerType: api.constants.OrderStopTriggerType.MarkPrice
  })
} catch (error) {
  console.error('Stop loss failed:', error.message)
}

// TWAP Order
try {
  const result = await api.orders.placeTWAPOrder(symbol, accountName, side, {
    size: 0.1,
    duration: 3600,
    ordersCount: 10,
    chaserDelay: 5000,
    reduceOnly: false,
    randomnessPercentage: 10,
    useLimitOrders: true,
    useChaserOrders: false
  })
} catch (error) {
  console.error('TWAP order failed:', error.message)
}
```

### Order Actions
```javascript
// Cancel order
await api.orders.cancelOrder(accountName, order)

// Close position
await api.orders.closePosition(position)

// Set breakeven stop
await api.orders.setBreakeven(position)

// Chase order
const orderId = await api.orders.chaseOrder(accountName, 
  { symbol: string, side: OrderSide, size?: number },
  { size?: number, reduce?: boolean, delay?: number }
)
```

### Math & Precision (Critical!)
```javascript
// Adjust to exchange precision (RECOMMENDED for all prices/amounts)
const roundedPrice = api.utils.math.adjust(price, market.precision.price)
const roundedAmount = api.utils.math.adjust(amount, market.precision.amount)

// Other math functions
api.utils.math.roundToNearestMultiple(value, multiple)
api.utils.math.clamp(value, min, max)
api.utils.math.percentChange(from, to)
```

### Tealstreet UI Components
```javascript
const { SizeInput, PriceInput, OrderSizeButtons, QuickOrderButton, PostReduceOptions } = api.components

// Size input
<SizeInput
  size={size}
  setSize={setSize}
  price={price}
  activeSymbol={activeSymbol}
  activeAccount={activeAccount}
/>

// Price input
<PriceInput
  price={price}
  setPriceCallback={setPrice}
  activeSymbol={activeSymbol}
  activeAccount={activeAccount}
/>

// Order size buttons
<OrderSizeButtons
  prevSize={size}
  setSize={setSize}
  activeAccount={activeAccount}
  activeSymbol={activeSymbol}
  price={price}
/>

// Display components
<api.components.ColoredNumber value={pnl}>
  {api.utils.formatPnl(pnl)}
</api.components.ColoredNumber>

<api.components.ButtonWithConfirm
  buttonText="Close"
  onConfirm={async () => {
    await api.orders.closePosition(position)
  }}
  danger
/>
```

### Formatting Utilities
```javascript
api.utils.formatNumber(n, decimals = 2)
api.utils.formatCurrency(n)
api.utils.formatPercent(n)
api.utils.abbreviateNumber(n)
api.utils.formatPnl(pnl)
api.utils.formatSide(side)
```

### Position & Risk Calculations  
```javascript
// Position calculations
api.utils.calculatePnlPercent(entry, current, side)
api.utils.calculateReturns(position, pnl)
api.utils.getCurrentPositionSizeAndLeverage(positions, symbol)

// Risk calculations
api.utils.risk.formatPnl(pnl: number, precision?: number, prefix?: string)

// Calculate comprehensive risk
const ordersRisk = api.utils.risk.calculateOrdersRisk(
  markets: Market[],
  tickers: Ticker[],
  positions: Position[],
  orders: Order[]
)

// Calculate risk at specific price
const riskAtPrice = api.utils.risk.calculateRiskAtPrice(
  price: number,
  symbol: string,
  ordersRisk: { [orderId: string]: any },
  positions: Position[],
  orders: Order[]
)
```

### State Management (Jotai)
```javascript
// Create persistent storage atom
const settingsAtom = api.jotai.createStorageAtom('settings', {
  theme: 'dark',
  refreshInterval: 5000,
  showNotifications: true
})

// Use in component
const [settings, setSettings] = api.jotai.useAtom(settingsAtom)
```

### Constants
```javascript
// Order sides and types
api.constants.OrderSide.Buy
api.constants.OrderSide.Sell
api.constants.OrderType.Market
api.constants.OrderType.Limit

// Time in force
api.constants.OrderTimeInForce.PostOnly
api.constants.OrderTimeInForce.GoodTillCancel

// Stop trigger types
api.constants.OrderStopTriggerType.MarkPrice
api.constants.OrderStopTriggerType.LastPrice

// Position sides
api.constants.PositionSide.Long
api.constants.PositionSide.Short
```

### Exchange API
```javascript
// Get all markets
const markets = api.exchange.getMarkets(accountName?)
// Get specific market
const market = api.exchange.getMarket(symbol?, accountName?)
// Get ticker
const ticker = api.exchange.getTicker(symbol?, accountName?)
// Get all tickers for an account
const tickers = api.exchange.getTickers(accountName?)

// Get balance (now requires accountName)
const balance = api.exchange.getBalance(accountName)
// Get combined balance across multiple accounts
const combinedBalance = api.exchange.getCombinedBalance(accountNames?: string[])

// Set leverage
try {
  await api.exchange.setLeverage(accountName, symbol, leverage)
  // Example: await api.exchange.setLeverage('Binance-1', 'BTC/USDT:USDT', 10)
} catch (error) {
  console.error('Failed to set leverage:', error.message)
}

// Call safe exchange methods (read-only)
const data = await api.exchange.callMethod(accountName, methodName, ...args)
// Allowed methods: fetchTicker, fetchOrderBook, fetchTrades, fetchBalance, etc.
```

### Icons
```javascript
const { icons } = api

// Usage examples
<icons.CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
<icons.CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
<icons.LoadingOutlined spin style={{ fontSize: 16 }} />
<icons.ArrowUpOutlined style={{ color: 'green' }} />
<icons.ArrowDownOutlined style={{ color: 'red' }} />
<icons.SettingOutlined />
<icons.InfoCircleOutlined />
<icons.WarningOutlined />

// Full icon list: https://ant.design/components/icon
```

### Data Manipulation
```javascript
// Sorting
const sorted = api.data.sortBy(array, key, desc?)

// Grouping
const grouped = api.data.groupBy(array, key)

// Math operations
const total = api.data.sum(numbers)
const avg = api.data.average(numbers)
const mid = api.data.median(numbers)

// Array utilities
const filtered = api.data.filter(array, predicate)
const mapped = api.data.map(array, transform)
const unique = api.data.unique(array, key?)
```

### Logging & Toast Notifications
```javascript
// Console logging
api.log.info(message, ...args)
api.log.warn(message, ...args)
api.log.error(message, ...args)
api.log.debug(message, ...args)

// Toast notifications
api.toast.success('Order placed successfully')
api.toast.error(`Order failed: ${error.message}`)
api.toast.warning('Warning message')
api.toast.info('Info message')

// Usage in error handling
try {
  await api.orders.placeMarketOrder(symbol, account, side, options)
  api.toast.success('Order placed successfully')
} catch (error) {
  api.toast.error(`Order failed: ${error.message}`)
}
```

### Global Module Examples
```javascript
// Global Module - Shared state
const sharedStateAtom = api.jotai.atom({ 
  activeStrategy: 'scalping',
  riskLevel: 1,
  autoTrade: false 
})

export const hooks = {
  useSharedState: () => api.jotai.useAtom(sharedStateAtom),
}

// Usage in modules:
import { hooks } from "global"
const [state, setState] = hooks.useSharedState()

// Global Module - Trading utilities
export const trading = {
  calculatePositionSize: (balance, risk, stopDistance) => {
    const riskAmount = balance * (risk / 100)
    return riskAmount / stopDistance
  },
  
  getFibonacciLevels: (high, low) => {
    const diff = high - low
    return {
      level_0: low,
      level_236: low + diff * 0.236,
      level_382: low + diff * 0.382,
      level_500: low + diff * 0.500,
      level_618: low + diff * 0.618,
      level_100: high,
    }
  }
}
```

## Trading Component Features
- Order placement (market/limit)
- Bracket orders (stop loss/take profit)
- Position management
- Real-time market data integration
- Toast notifications for user feedback

## Important
- Only edit the main component file
- Hot reload handles all transformations automatically
- Copy final component from component-ready.tsx to Tealstreet
- Adapter files are development-only, don't include in final paste
- React is automatically available in scope
- All imports are stripped in the final component-ready.tsx