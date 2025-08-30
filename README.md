# Tealstreet Iterator

A comprehensive development framework for building custom UI components for the Tealstreet crypto trading terminal.

## Features

✅ **Multi-Component Support** - Build multiple specialized trading UIs  
✅ **Global Module** - Shared utilities and state across components  
✅ **Hot Reload** - Auto-generates Tealstreet-ready components on save  
✅ **Example Templates** - Order panels, position monitors, risk dashboards  
✅ **Complete API Reference** - All Tealstreet APIs documented in CLAUDE.md  
✅ **TypeScript Support** - Full type safety and IntelliSense  

## Quick Start

```bash
pnpm install
pnpm dev
```

Navigate to `http://localhost:5173` and start building!

## Project Structure

```
src/tealstreet-iterator/
├── component.tsx              # Main component (edit this)
├── component-ready.tsx        # Auto-generated (copy to Tealstreet)
├── global-module.tsx          # Shared utilities & state
├── examples/                  # Component templates
│   ├── order-panel/           # Quick order placement
│   ├── position-monitor/      # Position tracking
│   └── risk-dashboard/        # Risk analysis
└── adapter/                   # Development mocks
```

## Development Workflow

1. **Single Component**: Edit `src/tealstreet-iterator/component.tsx`
2. **Multiple Components**: Copy examples or create new ones
3. **Shared Logic**: Add utilities to `global-module.tsx`
4. **Copy & Paste**: Use auto-generated `component-ready.tsx` in Tealstreet

## Example Components

### Order Panel
Quick order placement with size/price inputs, bracket orders support
```bash
cp examples/order-panel/component.tsx src/tealstreet-iterator/component.tsx
```

### Position Monitor  
Real-time position tracking with close buttons and P&L display
```bash
cp examples/position-monitor/component.tsx src/tealstreet-iterator/component.tsx
```

### Risk Dashboard
Portfolio risk analysis with alerts and position limits
```bash
cp examples/risk-dashboard/component.tsx src/tealstreet-iterator/component.tsx
```

## API Reference

See `CLAUDE.md` for comprehensive Tealstreet API documentation with real examples covering:

- Order placement (market, limit, bracket, TWAP)
- Position & risk management  
- Real-time market data hooks
- UI components & formatting utilities
- State management with Jotai
- Global module patterns

## Global Module

The `global-module.tsx` provides shared functionality:

- **Risk Management**: Position sizing, stop loss calculations
- **Shared State**: Trading settings, alerts, daily P&L tracking  
- **Utility Functions**: Fibonacci levels, risk-reward ratios
- **TypeScript Types**: Full IntelliSense support

```javascript
// Import in any component
import { utils, hooks, RiskManager } from "global"
```

## Important Notes

- Hot reload automatically rebuilds `component-ready.tsx` when you save
- Only copy `component-ready.tsx` to Tealstreet (not the development files)
- Adapter files are for local development only
- All Tealstreet APIs are documented with working examples
- TypeScript types are automatically available