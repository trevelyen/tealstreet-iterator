import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import pnpmHotUpdatePlugin from './pnpm-hot-update-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    pnpmHotUpdatePlugin(
      {
        filePattern: "src/tealstreet-iterator/component.tsx",
        command: "pnpm run build"
      }
    )
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
