
'use client'
import * as React from 'react'
import * as antd from 'antd'
import _ from 'lodash'
import * as icons from '@ant-design/icons'
import { toast } from 'react-toastify'

// This script is purely to prevent errors locally and should not be submitted when pasting your component.tsx back into Tealstreet

// Faux API
const fauxApi = {
  antd,
  hooks: {
    useActiveSymbol: () => ['BTC-USD'] as [string | undefined],
    useActiveAccount: () => ['main'] as [string | undefined],
    useMarket: () => ({ precision: { price: 2, amount: 4 } }),
    useTicker: () => ({ last: 50000, bid: 49999, ask: 50001 }),
    useBalance: () => ({ available: 10000, total: 15000 }),
    usePositions: () => [],
  },
  utils: {
    getNearTouchPrice: (side: string, ticker: any) => {
      return side === 'Buy' ? ticker?.bid : ticker?.ask
    },
    math: {
      adjust: (value: number, precision: number) => {
        return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
      },
    },
  },
  orders: {
    placeMarketOrder: async () => {
      console.log('faux: Market order placed')
    },
    placeLimitOrder: async () => {
      console.log('faux: Limit order placed')
    },
    closePosition: async () => {
      console.log('faux: Position closed')
    },
  },
  components: {
    SizeInput: ({ value, onChange }: any) => (
      <input
        type='number'
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    ),
    PriceInput: ({ value, onChange }: any) => (
      <input
        type='number'
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || null)}
      />
    ),
    OrderSizeButtons: () => <div>Size Buttons</div>,
    QuickOrderButton: () => <button>Quick Order</button>,
    PostReduceOptions: () => <div>Post/Reduce Options</div>,
  },
  toast: toast,
  constants: {
    OrderSide: {
      Buy: 'Buy',
      Sell: 'Sell',
    },
    OrderTimeInForce: {
      PostOnly: 'PostOnly',
      GoodTillCancel: 'GoodTillCancel',
    },
  },
  lodash: _,
  icons
}

// Inject globals for development
if (typeof window !== 'undefined') {
  ;(window as any).api = fauxApi
  ;(window as any).React = React
  ;(window as any).antd = antd
  ;(window as any).lodash = _
  ;(window as any).icons = icons
  ;(window as any).toast = toast
} else if (typeof globalThis !== 'undefined') {
  // For server-side rendering
  ;(globalThis as any).api = fauxApi
  ;(globalThis as any).React = React
  ;(globalThis as any).antd = antd
  ;(globalThis as any).lodash = _
  ;(globalThis as any).icons = icons
  ;(globalThis as any).toast = toast
}

// Export faux setup
export default function setupFauxApi() {
  // Ensure globals are set
  if (typeof window !== 'undefined') {
    ;(window as any).api = fauxApi
    ;(window as any).React = React
    ;(window as any).antd = antd
    ;(window as any).lodash = _
    ;(window as any).icons = icons
    ;(window as any).toast = toast
  } else if (typeof globalThis !== 'undefined') {
    ;(globalThis as any).api = fauxApi
    ;(globalThis as any).React = React
    ;(globalThis as any).antd = antd
    ;(globalThis as any).lodash = _
    ;(globalThis as any).icons = icons
    ;(globalThis as any).toast = toast
  }
  return null
}
