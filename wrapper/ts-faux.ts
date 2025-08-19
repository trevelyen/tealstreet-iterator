// @ts-nocheck
'use client'
import React, { useState, useEffect, useCallback } from 'react'

// This script is purely to prevent errors locally and should not be submitted when pasting your component.js back into TS

// Faux API
const fauxApi = {
  antd: {
    Button: ({ children, onClick, ...props }: any) => (
      <button
        onClick={onClick}
        {...props}>
        {children}
      </button>
    ),
    Input: ({ value, onChange, ...props }: any) => (
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    ),
    Space: ({ children, ...props }: any) => (
      <div
        style={{ display: 'flex', gap: '8px' }}
        {...props}>
        {children}
      </div>
    ),
    Row: ({ children, ...props }: any) => (
      <div
        style={{ display: 'flex' }}
        {...props}>
        {children}
      </div>
    ),
    Col: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Tag: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    Divider: () => <hr />,
    Radio: ({ children, ...props }: any) => (
      <input
        type='radio'
        {...props}
      />
    ),
    Statistic: ({ title, value }: any) => (
      <div>
        <div>{title}</div>
        <div>{value}</div>
      </div>
    ),
  },
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
  toast: {
    success: (msg: string) => console.log('✅', msg),
    error: (msg: string) => console.error('❌', msg),
  },
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
}

// Inject globals for development
if (typeof window !== 'undefined') {
  ;(window as any).api = fauxApi
  ;(window as any).React = React
}

// Export faux setup
export default function setupFauxApi() {
  return null
}
