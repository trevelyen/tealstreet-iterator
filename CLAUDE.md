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
   - **Single Component**: Edit `src/tealstreet-iterator/_BUILD-HERE/component.tsx` 
   - **Multiple Components**: Save new components in `_SAVED/` folder

2. **Development Process:**
   - Save → automatic rebuild → `_COPY-THIS/component-ready.tsx` updates via hot reload
   - Copy `_COPY-THIS/component-ready.tsx` content and paste into Tealstreet terminal

## Project Structure
```
src/tealstreet-iterator/
├── _BUILD-HERE/
│   └── component.tsx           # Main component (basic template)
├── _COPY-THIS/
│   └── component-ready.tsx     # Auto-generated Tealstreet-ready version
├── _SAVED/                     # Previously saved component templates
│   ├── balance-display/
│   │   ├── component-ready.tsx # Auto-generated Tealstreet-ready version
│   │   └── component.tsx       # Local IDE-workable script (to edit: run pnpm dev, paste into the _BUILD-HERE component.tsx, iterate)
├── global-module.tsx           # Shared utilities & state (optional)
└── adapter/                    # Development mocks (don't copy to Tealstreet)
```

## Development Commands
- `pnpm dev` - Start development server at http://localhost:5173
- Development server automatically rebuilds component-ready.tsx on save

## Multi-Component Development
The project now supports building **multiple specialized trading components**:

### Example Components Included:
1. **Balance Display** (`examples/balance-display/`) - Simple balance retrieval


### Using Example Components:
1. Copy example to main component: `cp examples/balance-display/component.tsx src/tealstreet-iterator/_BUILD-HERE/component.tsx`
2. Customize the component for your needs
3. Hot reload will generate the new Tealstreet-ready version at `src/tealstreet-iterator/_COPY-THIS/component-ready.tsx`

## Global Module (Advanced)
The `global-module.tsx` file provides shared utilities across components and will eventually allow you to share logic amongst your scripts as the service matures. For now, we just use individual components.

## API Reference
See `TEALSTREET_API_DOCUMENTATION.md` for the complete Tealstreet API documentation.

## Important
- Only edit the main component file
- Hot reload handles all transformations automatically
- Copy final component from _COPY-THIS/component-ready.tsx to Tealstreet
- Adapter files are development-only, don't include in final paste
- React is automatically available in scope
