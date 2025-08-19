# TealStreet Component Template

A development template for building custom TealStreet trading components with fast iteration and hot-reload capabilities.

## Overview

This template provides a development environment that simulates the TealStreet API environment, allowing you to build and test trading components locally before deploying them to the TealStreet platform.

## Architecture

```
tealstreet-iterator/
├── component.tsx          # Your main component (edit this!)
├── page.tsx              # Next.js page wrapper
├── adapter/
│   ├── wrapper.tsx       # Client-side setup and component loader
│   ├── ts-faux.tsx       # Mock TealStreet API for development
│   └── tealstreet.d.ts   # TypeScript definitions
└── README.md
```

## Quick Start

1. **Navigate to the development page:**
   ```
   http://localhost:3000/tealstreet-iterator
   ```

2. **Edit your component:**
   Open `component.tsx` and start building your trading UI

3. **Hot reload:**
   Changes to `component.tsx` will automatically update in the browser

## Available APIs

Your component has access to the full TealStreet API through the global `api` object:

### Hooks
```javascript
const [activeSymbol] = hooks.useActiveSymbol()
const [activeAccount] = hooks.useActiveAccount() 
const market = hooks.useMarket(symbol, account)
const ticker = hooks.useTicker()
const balance = hooks.useBalance()
const positions = hooks.usePositions({ symbol, account })
```

### Order Management
```javascript
// Market orders
await orders.placeMarketOrder(symbol, account, side, options)

// Limit orders  
await orders.placeLimitOrder(symbol, account, side, options)

// Close positions
await orders.closePosition(position)
```

### Utilities
```javascript
// Price calculations
const nearTouchPrice = utils.getNearTouchPrice(side, ticker)

// Math operations with precision
const adjustedPrice = utils.math.adjust(price, precision)
```

### UI Components
- `toast.success(message)` - Success notifications
- `toast.error(message)` - Error notifications
- `components.*` - TealStreet UI components
- `antd.*` - Ant Design components

### Constants
```javascript
const { OrderSide, OrderTimeInForce } = constants
```

## Development Features

- **Mock Data:** Realistic fake data for symbols, accounts, prices, and positions
- **Hot Reload:** Instant updates when you edit `component.tsx`
- **Error Handling:** Clear error messages for debugging
- **TypeScript Support:** Full type definitions for the TealStreet API

## Example Component

```tsx
const Component = () => {
  const [activeSymbol] = hooks.useActiveSymbol()
  const ticker = hooks.useTicker()
  const [size, setSize] = useState(0.001)
  
  const handleBuy = async () => {
    try {
      await orders.placeMarketOrder(activeSymbol, 'account1', OrderSide.Buy, {
        amount: size
      })
      toast.success('Order placed!')
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    }
  }
  
  return (
    <div className="p-4">
      <h2>Quick Buy</h2>
      <p>Symbol: {activeSymbol}</p>
      <p>Price: ${ticker?.last}</p>
      <input 
        type="number" 
        value={size} 
        onChange={e => setSize(Number(e.target.value))}
      />
      <button onClick={handleBuy}>Buy {size} {activeSymbol}</button>
    </div>
  )
}
```

## Deployment

When your component is ready:

1. Copy the contents of `component.tsx` 
2. Paste into the TealStreet platform
3. Your component will have access to real trading data and functionality

## Tips

- Use the browser dev tools to inspect the mock API data
- Test error scenarios by triggering invalid operations
- Leverage existing trading logic patterns from the template
- Build responsive UIs that work on different screen sizes

## Support

For questions about the TealStreet API or platform integration, refer to the official TealStreet documentation.