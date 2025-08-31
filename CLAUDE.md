# Claude Code Instructions

## Project Overview
This is a **comprehensive development framework** for building custom UI components for the Tealstreet crypto trading terminal. It supports multi-component development with shared utilities and provides safe iteration outside the live trading environment.

## Official API Documentation
For the complete Tealstreet API reference, see `TEALSTREET_API_DOCUMENTATION.md` which contains:
- Full API structure and methods
- Global Module system documentation
- React hooks and components reference
- Order placement and exchange methods
- Complete examples and patterns

## Development Workflow
1. **Choose your approach:**
   - **Single Component**: Edit `src/tealstreet-iterator/_BUILD-HERE/component-iterate.tsx` 
   - **Auto-Save Components**: Add `const CustomModuleName = 'your-component-name'` for automatic versioning

2. **Development Process:**
   - Save → automatic rebuild → `_COPY-THIS/component-ready.tsx` updates via hot reload
   - Copy `_COPY-THIS/component-ready.tsx` content and paste into Tealstreet terminal
   - **Auto-versioning**: Components with `CustomModuleName` automatically save to `_SAVED/your-name/v1/`, `v2/`, etc.

## Project Structure
```
src/tealstreet-iterator/
├── _BUILD-HERE/
│   └── component-iterate.tsx   # Main component (add CustomModuleName for auto-save)
├── _COPY-THIS/
│   └── component-ready.tsx     # Auto-generated Tealstreet-ready version
├── _SAVED/                     # Auto-versioned component history
│   ├── simple-executor/        # Example: CustomModuleName = 'simple-executor'
│   │   ├── v1/                 # First version
│   │   │   ├── component.tsx           # Original source
│   │   │   └── component-ready.tsx     # Tealstreet-ready version
│   │   ├── v2/                 # Second version (auto-created on next save)
│   │   │   ├── component.tsx
│   │   │   └── component-ready.tsx
│   │   └── v3/                 # Third version, etc...
│   └── balance-display/        # Another component
│       ├── v1/
│       └── v2/
├── global-module.tsx           # Shared utilities & state (optional)
└── adapter/                    # Development mocks (don't copy to Tealstreet)
```

## Development Commands
- `pnpm dev` - Start development server at http://localhost:5173
- Development server automatically rebuilds component-ready.tsx on save
- `pnpm run build` - Manual build (auto-runs on save during dev)

## Auto-Versioning System
The project includes an automatic versioning system that prevents overwriting previous work:

### How it Works:
1. Add `const CustomModuleName = 'your-component-name'` to your component
2. Every save automatically creates a new version in `_SAVED/your-component-name/v1/`, `v2/`, etc.
3. Each version contains both the original source and Tealstreet-ready files
4. Previous versions are never overwritten - complete development history is preserved

### Example:
```jsx
const CustomModuleName = 'price-tracker'

const Component = () => {
  // Your component code here
  return <div>Price Tracker v1</div>
}

// For development, will be removed in build  
export default Component
```

This automatically creates:
- `_SAVED/price-tracker/v1/component.tsx` (your source)
- `_SAVED/price-tracker/v1/component-ready.tsx` (Tealstreet-ready)
- Next save creates v2, then v3, etc.

## Multi-Component Development
Build and manage **multiple specialized trading components** with full version control:

### Using Example Components:
1. Copy example to main component: `cp examples/balance-display/component.tsx src/tealstreet-iterator/_BUILD-HERE/component-iterate.tsx`
2. Add your `CustomModuleName` for auto-versioning
3. Customize and iterate - each save creates a new version

## Global Module (Advanced)
The `global-module.tsx` file provides shared utilities across components and will eventually allow you to share logic amongst your scripts as the service matures. For now, we just use individual components.

## API Reference
See `TEALSTREET_API_DOCUMENTATION.md` for the complete Tealstreet API documentation.

## Important
- Only edit the main component file (`component-iterate.tsx`)
- Add `const CustomModuleName = 'your-name'` for automatic versioning
- Hot reload handles all transformations automatically
- Copy final component from `_COPY-THIS/component-ready.tsx` to Tealstreet
- Adapter files are development-only, don't include in final paste
- Previous versions are never overwritten - complete development history preserved
- React is automatically available in scope
