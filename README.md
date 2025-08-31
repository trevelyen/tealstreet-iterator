# Tealstreet Iterator

A comprehensive development framework for building custom UI components for the Tealstreet crypto trading terminal.

## Features

✅ **Auto-Versioning System** - Never lose work with automatic version control  
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
├── _BUILD-HERE/
│   └── component-iterate.tsx         # Main component (add CustomModuleName for auto-save)
├── _COPY-THIS/
│   └── component-ready.tsx           # Auto-generated Tealstreet-ready version
├── _SAVED/                           # Auto-versioned component history
│   ├── simple-executor/              # Example: CustomModuleName = 'simple-executor'
│   │   ├── v1/                       # First version
│   │   │   ├── component-iterate.tsx # Original source
│   │   │   └── component-ready.tsx   # Tealstreet-ready version
│   │   ├── v2/                       # Second version (auto-created on next save)
│   │   │   ├── component-iterate.tsx
│   │   │   └── component-ready.tsx
│   │   └── v3/                       # Third version, etc...
│   └── balance-display/              # Another component
│       ├── v1/
│       └── v2/
├── global-module.tsx                 # Shared utilities & state (optional)
└── adapter/                          # Development mocks (don't copy to Tealstreet)
```

## Development Workflow

### Auto-Versioning (Recommended)
1. **Edit**: `src/tealstreet-iterator/_BUILD-HERE/component-iterate.tsx`
2. **Add**: `const CustomModuleName = 'yourComponentName'` at the top
3. **Save**: Automatically creates versioned copies in `_SAVED/yourComponentName/v1/`, `v2/`, etc.
4. **Copy & Paste**: Use `_COPY-THIS/component-ready.tsx` in Tealstreet

### Traditional Workflow
1. **Single Component**: Edit `component-iterate.tsx` without `CustomModuleName` for one-off components
2. **Multiple Components**: Copy examples or create new ones
3. **Shared Logic**: Add utilities to `global-module.tsx`

### Example with Auto-Versioning
```jsx
const CustomModuleName = 'scalping-bot'

const Component = () => {
  // Your trading component here
  return <div>Scalping Bot v1</div>
}

export default Component
```
Every save creates: `_SAVED/scalpingBot/v1/`, `v2/`, `v3/`... with complete history!

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

- **Auto-Versioning**: Add `const CustomModuleName = 'name'` to automatically save versions
- **Hot Reload**: Automatically rebuilds `_COPY-THIS/component-ready.tsx` when you save
- **Copy Ready Files**: Only copy `_COPY-THIS/component-ready.tsx` to Tealstreet (not development files)
- **Version History**: Previous versions are never overwritten - complete development history preserved
- **Adapter Files**: For local development only, don't copy to Tealstreet
- **API Documentation**: All Tealstreet APIs documented with working examples in `CLAUDE.md`
- **TypeScript**: Types automatically available with full IntelliSense support