import * as antd from 'antd'
import _ from 'lodash'
import * as icons from '@ant-design/icons'
import type { toast as Toast } from 'react-toastify'

import type { Market, Ticker, Position, Order, Candle, Balance, OrderBookUpdate } from "api-types"

declare global {
  const api: {
    icons: typeof icons
    antd: typeof antd
    hooks: {
      useActiveSymbol: () => [string | undefined, (symbol: string) => void]
      useActiveAccount: () => [string | undefined, (account: string) => void]
      useActiveAccounts: () => string[]
      useTheme: () => any
      useMarket: (symbol?: string, accountName?: string) => Market | undefined
      useTicker: (symbol?: string, accountName?: string) => Ticker | null
      useTickers: (accountName?: string) => Ticker[]
      useMarkets: (accountName?: string) => Market[]
      useCombinedBalance: () => Balance
      useBalance: (accountName?: string) => Balance
      usePositions: (params?: {
        symbol?: string;
        account?: string;
        includeMultipleAccounts?: boolean;
      }) => Position[]
      useOrderbook: (symbol?: string, accountName?: string) => OrderBookUpdate
      useOrders: (params?: {
        account?: string
        symbol?: string
        type?: 'market' | 'limit' | 'stop_market' | 'take_profit_market' | 'trailing_stop_market' | string[]
        status?: 'open' | 'closed' | 'canceled' | 'creating' | 'updating' | 'canceling'
      }) => Order[]
    }
    // Note: The following hooks are intentionally omitted as they are not in the documentation:
    // - useCandles
    // - useAccountNames
    // - useSymbols
    exchange: {
      getBalance: (accountName: string) => Balance
      getCombinedBalance: (accountNames?: string[]) => any
      getPositions: (params?: { symbol?: string; account?: string }) => Position[]
      getOrders: (params?: {
        symbol?: string
        account?: string
        type?: ('market' | 'limit' | 'stop_market' | 'take_profit_market' | 'trailing_stop_market') | string[]
        status?: 'open' | 'closed' | 'canceled' | 'creating' | 'updating' | 'canceling'
      }) => Order[]
      getCandles: (symbol: string, timeframe: string, limit?: number) => Candle[]
      getOrderbook: (symbol: string, accountName?: string) => OrderBookUpdate
      getTicker: (symbol: string, accountName?: string) => Ticker | null
      getMarket: (symbol: string, accountName?: string) => Market | undefined
      callMethod: (accountName: string, methodName: string, ...args: any[]) => Promise<any>
    }
    jotai: {
      atom: <T>(initialValue: T) => any
      atomWithStorage: <T>(key: string, initialValue: T) => any
      createStorageAtom: <T>(key: string, initialValue: T, storage?: any) => any
      useAtom: <T>(atom: any) => [T, (value: T) => void]
      useAtomValue: <T>(atom: any) => T
      useSetAtom: <T>(atom: any) => (value: T) => void
    }
    lodash: typeof _
    utils: {
      // Formatting
      formatNumber: (n: number, decimals?: number) => string
      formatCurrency: (n: number) => string
      formatPercent: (n: number) => string
      abbreviateNumber: (n: number) => string
      formatLarge: (n: number, decimals?: number) => string
      formatPnl: (pnl: number) => string
      formatSide: (side: string) => string

      // International formatting
      formatUsdValueIntl: (value: number) => string
      formatUsdPriceIntl: (price: number) => string
      formatCurrencyValueIntl: (value: number, currency: string) => string
      convertToLocalRoundedStr: (value: number, currency?: string) => string

      // Privacy
      privacy: (value: any, suffix?: string) => any

      // Accounts and exchange metadata
      getActiveAccounts: () => string[]
      getExchangeMetadata: (exchangeName: string) => any

      // Day.js
      dayjs: (...args: any[]) => any

      // Currency utils
      currencyUtils: {
        isUsdLikeCurrency: (currency: string) => boolean
        isBtcLikeCurrency: (currency: string) => boolean
        isEquivalentCurrency: (c1: string, c2: string) => boolean
        isBtcLikeSymbol: (symbol: string) => boolean
        getCurrencySigDigits: (currency: string) => number
        getCurrencyPrecision: (currency: string) => number
      }

      // Historical positions
      getHistoricalPosition: (accountName: string, symbol: string, side: string) => any
      getBreakevenPrice: (historicalPosition: any) => number

      // Device
      isMobile: boolean

      // Order and market helpers
      getOrderForm: (accountName: string, symbol: string) => any
      getOpenOrderWithInProgressByAccount: (accountName: string) => any
      isFullStop: (order: any) => boolean
      validateOrderSize: (market: any, orderSize: number, price?: number) => { valid: boolean; error?: string }
      getReferencePriceForTriggerType: (triggerType: string, ticker: any) => number

      // Risk utilities
      risk: {
        formatPnl: (pnl: number, precision?: number, prefix?: string) => string
        filterAndSortOrdersInProfitDirection: (
          orders: Order[],
          entryPrice: number,
          positionSide: 'long' | 'short'
        ) => Order[]
        filterAndSortOrdersInLossDirection: (
          orders: Order[],
          entryPrice: number,
          positionSide: 'long' | 'short'
        ) => Order[]
        calculateOrdersRisk: (
          markets: Market[],
          tickers: Ticker[],
          positions: Position[],
          orders: Order[]
        ) => { [orderId: string]: any }
        calculateRiskAtPrice: (
          price: number,
          symbol: string,
          ordersRisk: { [orderId: string]: any },
          positions: Position[],
          orders: Order[]
        ) => any
      }

      // Price utilities
      getTrackedPrice: (enabled: boolean, side: string, distance: number, account: string, symbol: string, fallback?: number) => number
      getBBOMid: (bids: any[], asks: any[]) => number
      getNearTouchPrice: (side: string, ticker: any, market?: any, exchange?: any) => number | undefined
      getFarTouchPrice: (side: string, ticker: any, market?: any, exchange?: any) => number | undefined
      getTicker: (symbol: string, accountName?: string) => any
      getTickerPredictedBestAsk: (ticker: any) => number | undefined
      getTickerPredictedBestBid: (ticker: any) => number | undefined
      getMarket: (symbol: string, accountName?: string) => any

      // Time utilities
      getCandleEndTime: (timeframe: string, timeInSeconds: number) => number
      getCandleStartTime: (timeframe: string, timeInSeconds: number) => number
      getNumCandlesInRange: (timeframe: string, from: number, to: number) => number
      normalizeEpochToSeconds: (epoch: number) => number
      sleep: (ms: number) => Promise<void>

      // Math utilities
      math: {
        roundToNearestMultiple: (value: number, multiple: number) => number
        roundToNearestMultipleUp: (value: number, multiple: number) => number
        roundToNearestMultipleDown: (value: number, multiple: number) => number
        adjust: (value: number, precision: number) => number
        getSigDigitsFromPrecision: (precision: number) => number
        clamp: (value: number, min: number, max: number) => number
        percentChange: (from: number, to: number) => number
        valueChangePercent: (percent: number, value: number) => number
      }

      // Balance utilities
      getTotalBalanceFromBalance: (balance: any) => number
      getTotalMarginFromBalance: (balance: any) => number
      getAvailableMarginFromBalance: (balance: any) => number
      getMarginCurrency: (market: any) => string
      getBalanceSlice: (accountName: string) => any

      // Account & symbol utilities
      accountIsActive: (accountName: string) => boolean
      getExchangeNameFromAccountName: (accountName: string) => string
      getExchangeByName: (exchangeName: string) => any
      setActiveAccount: (account: string) => void
      setActiveSymbol: (symbol: string, accountName?: string) => void
      getActiveSymbol: () => string | undefined

      // Sizing conversions
      convertNotionalToNative: (notionalSize: number, symbol: string, accountName: string, price?: number) => number
      convertBaseToNative: (baseSize: number, symbol: string, accountName: string, price?: number) => number
      convertNativeToNotional: (nativeSize: number, symbol: string, accountName: string, price?: number) => number
      convertNativeToBase: (nativeSize: number, symbol: string, accountName: string, price?: number) => number

      // Misc
      uuid: () => string
      omitUndefined: (obj: any) => any
    }
    orders: {
      placeMarketOrder: (symbol: string, account: string, side: string, options: any) => Promise<string[]>
      placeLimitOrder: (symbol: string, account: string, side: string, options: any) => Promise<string[]>
      placeStopLossOrder: (symbol: string, account: string, side: string, options: any) => Promise<string[]>
      placeScaledOrder: (symbol: string, account: string, side: string, options: any) => Promise<string[]>
      placeTWAPOrder: (symbol: string, account: string, side: string, options: any) => Promise<any>
      closePosition: (position: any) => Promise<void>
      cancelOrder: (accountName: string, order: any) => Promise<void>
      cancelOrders: (accountName: string, orders: any[]) => Promise<void>
      updateOrder: (accountName: string, order: any, updates: any) => Promise<void>
      setBreakeven: (position: any) => Promise<void>
      chaseOrder: (accountName: string, params: { symbol: string; side: string; size?: number }, opts?: { size?: number; reduce?: boolean; delay?: number }) => Promise<string>
      getTrackedPrice: (trackEnabled: boolean, side: string, trackDistance: number, accountName: string, symbol: string, fallbackPrice?: number) => number
      getAvailableMaxOrderSize: (options: any) => number
    }
    components: {
      SizeInput: any
      PriceInput: any
      OrderSizeButtons: any
      QuickOrderButton: any
      PostReduceOptions: any
      SymbolSelector: any
      AccountSelector: any
      PositionCard: any
      OrderCard: any
      PnlDisplay: any
      LeverageSlider: any
      RiskCalculator: any
      ColoredNumber: any
      ButtonWithConfirm: any
    }
    log: {
      info: (message?: any, ...args: any[]) => void
      warn: (message?: any, ...args: any[]) => void
      error: (message?: any, ...args: any[]) => void
      debug: (message?: any, ...args: any[]) => void
    }
    toast: typeof Toast,
    data: {
      sortBy: (array: any[], key: string, desc?: boolean) => any[]
      groupBy: (array: any[], key: string | ((item: any) => string)) => any
      sum: (array: number[]) => number
      average: (array: number[]) => number
      median: (array: number[]) => number
      unique: (array: any[]) => any[]
      chunk: (array: any[], size: number) => any[]
    }
    constants: {
      OrderSide: {
        Buy: 'buy'
        Sell: 'sell'
      }
      OrderType: {
        Market: 'market'
        Limit: 'limit'
        StopLoss: 'stop_market'
        TakeProfit: 'take_profit_market'
        TrailingStopLoss: 'trailing_stop_market'
      }
      OrderStatus: {
        Open: 'open'
        Closed: 'closed'
        Canceled: 'canceled'
        Creating: 'creating'
        Updating: 'updating'
        Canceling: 'canceling'
      }
      OrderTimeInForce: {
        GoodTillCancel: 'GoodTillCancel'
        ImmediateOrCancel: 'ImmediateOrCancel'
        FillOrKill: 'FillOrKill'
        PostOnly: 'PostOnly'
      }
      OrderStopTriggerType: {
        MarkPrice: 'mark_price'
        LastPrice: 'last_price'
        IndexPrice: 'index_price'
      }
      OrderRejectReason: {
        PostOnly: 'PostOnly'
        InsufficientBalance: 'InsufficientBalance'
        ReduceOnly: 'ReduceOnly'
      }
      PositionSide: {
        Long: 'long'
        Short: 'short'
      }
      MarginType: {
        Isolated: 'isolated'
        Cross: 'cross'
      }
      PositionMode: {
        Hedged: 'hedged'
        OneWay: 'oneway'
      }
    }
  }

  const React: import('react')
}

export { }