# Tealstreet Iterator

## What to Edit

**Only edit `src/tealstreet-itrator/component.tsx`** - this contains your trading component logic.

## How to Use

1. Navigate to `http://localhost:5173`
2. Edit `src/tealstreet-itrator/component.tsx` to build your trading UI
3. When finished, run `pnpm build-tealstreet` to generate `src/tealstreet-iterator/component-ready.tsx`
4. Copy the contents of `component-ready.tsx` and paste into Tealstreet

## Adapter Logic (Ignore This)

The `adapter/` folder contains development-only files that mock the Tealstreet API environment:
- `wrapper.tsx` - Sets up the mock environment
- `ts-faux.tsx` - Provides fake trading data for development
- `tealstreet.d.ts` - TypeScript definitions for the Tealstreet API
- `api-types.d.ts` - TypeScript definitions for the API types

**Do not include any adapter files when pasting your component into Tealstreet.** The Tealstreet platform provides the real API - the adapter is only for local development and testing.
