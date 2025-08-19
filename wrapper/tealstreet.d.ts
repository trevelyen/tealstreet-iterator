declare global {
  const api: {
    antd: {
      Button: any
      Input: any
      Space: any
      Row: any
      Col: any
      Tag: any
      Divider: any
      Radio: any
      Statistic: any
    }
    hooks: {
      useActiveSymbol: () => [string | undefined]
      useActiveAccount: () => [string | undefined]
      useMarket: (symbol?: string, account?: string) => any
      useTicker: () => any
      useBalance: () => any
      usePositions: (params: { symbol?: string; account?: string }) => any[]
    }
    utils: {
      getNearTouchPrice: (side: string, ticker: any) => number | undefined
      math: {
        adjust: (value: number, precision: number) => number
      }
    }
    orders: {
      placeMarketOrder: (symbol: string, account: string, side: string, options: any) => Promise<void>
      placeLimitOrder: (symbol: string, account: string, side: string, options: any) => Promise<void>
      closePosition: (position: any) => Promise<void>
    }
    components: {
      SizeInput: any
      PriceInput: any
      OrderSizeButtons: any
      QuickOrderButton: any
      PostReduceOptions: any
    }
    toast: {
      success: (message: string) => void
      error: (message: string) => void
    }
    constants: {
      OrderSide: {
        Buy: string
        Sell: string
      }
      OrderTimeInForce: {
        PostOnly: string
        GoodTillCancel: string
      }
    }
  }

  const React: {
    useState: <T>(initial: T) => [T, (value: T) => void]
    useEffect: (effect: () => void | (() => void), deps?: any[]) => void
    useCallback: <T extends (...args: any[]) => any>(fn: T, deps: any[]) => T
  }
}

export {}
