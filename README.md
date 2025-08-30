# Tealstreet Iterator

## What to Edit

**Only edit `src/tealstreet-itrator/component.tsx`** - this contains your custom module.

## How to Use
1. `pnpm i`
2. `pnpm dev`
3. Navigate to `http://localhost:5173`
4. Edit `src/tealstreet-itrator/component.tsx` to build your custom module
5. `pnpm build-tealstreet` gets auto ran when you save the `component.tsx` file
6. The output is written to `src/tealstreet-iterator/component-ready.tsx`
6. Copy the contents of `component-ready.tsx` and paste into Tealstreet

## Adapter Logic (Ignore This)

The `adapter/` folder contains development-only files that mock the Tealstreet API environment:
- `wrapper.tsx` - Sets up the mock environment
- `ts-faux.tsx` - Provides fake trading data for development
- `tealstreet.d.ts` - TypeScript definitions for the Tealstreet API
- `api-types.d.ts` - TypeScript definitions for the API types

**Do not include any adapter files when pasting your component into Tealstreet.** The Tealstreet platform provides the real API - the adapter is only for local development and testing.
