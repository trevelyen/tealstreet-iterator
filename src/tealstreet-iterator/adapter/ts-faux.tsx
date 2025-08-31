'use client'
import * as React from 'react'
import * as antd from 'antd'
import _ from 'lodash'
import * as icons from '@ant-design/icons'
import { toast } from 'react-toastify'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// This script is purely to prevent errors locally and should not be submitted when pasting your component.tsx back into Tealstreet

// Mock data
const mockMarket = {
  id: 'BTC-USD',
  symbol: 'BTC-USD',
  base: 'BTC',
  quote: 'USD',
  active: true,
  type: 'future',
  precision: { price: 2, amount: 4, cost: 8 },
  limits: {
    amount: { min: 0.001, max: 1000 },
    price: { min: 0.01, max: 1000000 },
    cost: { min: 1, max: 10000000 }
  },
  info: {}
}

const mockTicker = {
  symbol: 'BTC-USD',
  last: 50000,
  bid: 49999,
  ask: 50001,
  high: 51000,
  low: 49000,
  volume: 1000,
  timestamp: Date.now(),
  datetime: new Date().toISOString(),
  percentage: 2.5,
  change: 1250,
  info: {}
}

const mockBalance = {
  total: 15000,
  free: 10000,
  used: 5000,
  upnl: 250,
  currencies: {
    USD: { total: 15000, free: 10000, used: 5000 }
  },
  info: {}
}

const mockPosition = {
  id: '1',
  symbol: 'BTC-USD',
  side: 'long',
  contracts: 0.1,
  contractSize: 1,
  entryPrice: 48000,
  markPrice: 50000,
  realizedPnl: 0,
  unrealizedPnl: 200,
  percentage: 4.17,
  leverage: 10,
  liquidationPrice: 43200,
  margin: 480,
  maintenanceMargin: 240,
  marginMode: 'cross',
  info: {}
}

const mockOrder = {
  id: '123',
  symbol: 'BTC-USD',
  type: 'limit',
  side: 'buy',
  price: 49000,
  amount: 0.1,
  filled: 0,
  remaining: 0.1,
  status: 'open',
  timestamp: Date.now(),
  datetime: new Date().toISOString(),
  fee: { cost: 0, currency: 'USD' },
  trades: [],
  info: {}
}

const mockOrderbook = {
  symbol: 'BTC-USD',
  bids: [[49999, 10], [49998, 20], [49997, 30]],
  asks: [[50001, 10], [50002, 20], [50003, 30]],
  timestamp: Date.now(),
  datetime: new Date().toISOString(),
  nonce: 1
}

// Faux API
const fauxApi = {
  antd,
  
  hooks: {
    // State management
    useActiveAccount: () => ['main', (account: string) => {}] as [string, (account: string) => void],
    useActiveSymbol: () => ['BTC-USD', (symbol: string) => {}] as [string, (symbol: string) => void],
    
    // Market data
    useMarket: (symbol?: string, accountName?: string) => mockMarket,
    useSelectedExchangeName: (accountName?: string) => 'binance',
    useActiveAccounts: () => ['main', 'secondary'],
    useMarketsLoaded: (accountName?: string) => true,
    useActiveExchangeObject: (accountName?: string) => ({ name: 'binance', id: 'binance' }),
    useMarkets: (accountName?: string) => [mockMarket],
    
    // Positions & Orders
    usePositions: (options?: any) => [mockPosition],
    useOrders: (options?: any) => [mockOrder],
    
    // Market data
    useOrderbook: (symbol?: string, accountName?: string) => mockOrderbook,
    useTicker: (symbol?: string, accountName?: string) => mockTicker,
    useTickers: (accountName?: string) => [mockTicker],
    
    // Balance
    useBalance: (accountName?: string) => mockBalance,
    useCombinedBalance: () => ({
      total: 25000,
      free: 20000,
      used: 5000,
      upnl: 500,
      longExposure: 5000,
      shortExposure: 0,
      totalNotional: 5000,
      currencies: { USD: { total: 25000, free: 20000, used: 5000 } }
    }),
    
    // Utility hooks
    useRerenderEveryXSeconds: (seconds: number) => {},
    useCountdown: (targetTime: number) => 0,
    useExchangeLoaded: (exchangeName?: string) => true,
    useExchangesLoaded: () => ({ exchangesLoaded: true, anonymousExchangesLoaded: true }),
    usePrevious: (value: any) => undefined,
    useDevMode: () => false,
    useTheme: () => ({ mode: 'dark' }),
    usePrivacyMode: () => false,
    useAppSettings: () => ({})
  },
  
  utils: {
    // Formatting
    formatNumber: (n: number, decimals?: number) => n.toFixed(decimals || 2),
    formatCurrency: (n: number) => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n),
    formatPercent: (n: number) => `${n.toFixed(2)}%`,
    abbreviateNumber: (n: number) => {
      if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
      if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
      if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
      return n.toString()
    },
    formatLarge: (n: number, decimals?: number) => n.toLocaleString('en-US', { maximumFractionDigits: decimals || 2 }),
    formatPnl: (pnl: number) => `${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}`,
    formatSide: (side: string) => side.charAt(0).toUpperCase() + side.slice(1),
    
    // International formatting
    formatUsdValueIntl: (value: number) => `$${value.toFixed(2)}`,
    formatUsdPriceIntl: (price: number) => `$${price.toFixed(2)}`,
    formatCurrencyValueIntl: (value: number, currency: string) => `${currency} ${value.toFixed(2)}`,
    convertToLocalRoundedStr: (value: number, currency?: string) => value.toFixed(2),
    
    // Privacy mode
    privacy: (value: number, suffix?: string) => `${value}${suffix || ''}`,
    
    // Account & Symbol utilities
    getActiveAccounts: () => ['main', 'secondary'],
    accountIsActive: (accountName: string) => accountName === 'main',
    getExchangeNameFromAccountName: (accountName: string) => 'binance',
    getExchangeByName: (exchangeName: string) => ({ name: exchangeName }),
    setActiveAccount: (account: string) => console.log('Setting active account:', account),
    setActiveSymbol: (symbol: string, account?: string) => console.log('Setting active symbol:', symbol),
    getActiveSymbol: () => 'BTC-USD',
    
    // Symbol conversion
    convertSymbolStateful: (symbol: string, fromExchange: string, toExchange: string) => symbol,
    convertSymbolPure: (symbol: string, fromExchange: string, toExchange: string) => symbol,
    toBinanceOrBybitSymbol: (symbol: string) => symbol,
    getBaseCoinFromSymbol: (symbol: string) => symbol.split('-')[0],
    findBtcSymbolForExchange: (exchange: any) => 'BTC-USD',
    getSymbolLogo: (symbol: string) => '🪙',
    
    // Position & PnL calculations
    calculatePnlPercent: (entry: number, current: number, side: string) => {
      const diff = side === 'long' ? current - entry : entry - current
      return (diff / entry) * 100
    },
    calculateReturns: (position: any, pnl: number) => ({ roe: 10, roi: 5 }),
    calculateFuturePositionSizeAtPrice: (market: any, currentPosition: any, currentPrice: number, targetPrice: number, pnl: number) => 0.1,
    getCurrentPositionSizeAndLeverage: (positions: any[], symbol: string) => ({ size: 0.1, leverage: 10 }),
    calculateImr: (exchange: any, market: any, size: number, price: number) => size * price * 0.01,
    
    // Math utilities
    math: {
      roundToNearestMultiple: (value: number, multiple: number) => Math.round(value / multiple) * multiple,
      roundToNearestMultipleUp: (value: number, multiple: number) => Math.ceil(value / multiple) * multiple,
      roundToNearestMultipleDown: (value: number, multiple: number) => Math.floor(value / multiple) * multiple,
      adjust: (value: number, precision: number) => Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision),
      getSigDigitsFromPrecision: (precision: number) => precision,
      clamp: (value: number, min: number, max: number) => Math.min(Math.max(value, min), max),
      percentChange: (from: number, to: number) => ((to - from) / from) * 100,
      valueChangePercent: (percent: number, value: number) => value * (1 + percent / 100),
    },
    
    // Risk calculation utilities
    risk: {
      formatPnl: (pnl: number, precision?: number, prefix?: string) => `${prefix || ''}${pnl.toFixed(precision || 2)}`,
      filterAndSortOrdersInProfitDirection: (orders: any[], entryPrice: number, positionSide: string) => orders,
      filterAndSortOrdersInLossDirection: (orders: any[], entryPrice: number, positionSide: string) => orders,
      calculateOrdersRisk: (markets: any[], tickers: any[], positions: any[], orders: any[]) => ({}),
      calculateRiskAtPrice: (price: number, symbol: string, ordersRisk: any, positions: any[], orders: any[]) => ({
        positionSize: 0.1,
        positionSide: 'long',
        unrealizedPnl: 100,
        realizedPnl: 0
      })
    },
    
    // Currency utilities
    currencyUtils: {
      isUsdLikeCurrency: (currency: string) => ['USD', 'USDT', 'USDC', 'BUSD'].includes(currency),
      isBtcLikeCurrency: (currency: string) => ['BTC', 'WBTC'].includes(currency),
      isEquivalentCurrency: (currency1: string, currency2: string) => currency1 === currency2,
      isBtcLikeSymbol: (symbol: string) => symbol.includes('BTC'),
      getCurrencySigDigits: (currency: string) => 2,
      getCurrencyPrecision: (currency: string) => 2,
    },
    
    // Color & Theme utilities
    generateOpaqueColor: (color: string, opacity: number) => color,
    getColorIsLight: (color: string) => false,
    getContrastColor: (color: string) => '#ffffff',
    getLeverageColor: (leverage: number, theme: any) => leverage > 10 ? '#ff4d4f' : '#52c41a',
    safeTradingViewColor: (color: string) => color,
    getTheme: () => ({ mode: 'dark' }),
    colorHelpers: {},
    derivedColors: {},
    
    // Time & Date utilities
    dayjs: () => new Date(),
    getCandleEndTime: (timeframe: string, timeInSeconds: number) => timeInSeconds + 3600,
    getCandleStartTime: (timeframe: string, timeInSeconds: number) => timeInSeconds,
    getNumCandlesInRange: (timeframe: string, from: number, to: number) => Math.floor((to - from) / 3600),
    normalizeEpochToSeconds: (epoch: number) => Math.floor(epoch / 1000),
    sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
    
    // Sizing conversion utilities
    convertNotionalToNative: (notionalSize: number, symbol: string, accountName: string, price?: number) => notionalSize / (price || 50000),
    convertBaseToNative: (baseSize: number, symbol: string, accountName: string, price?: number) => baseSize,
    convertNativeToNotional: (nativeSize: number, symbol: string, accountName: string, price?: number) => nativeSize * (price || 50000),
    convertNativeToBase: (nativeSize: number, symbol: string, accountName: string, price?: number) => nativeSize,
    
    // Other utilities
    uuid: () => Math.random().toString(36).substring(2, 11),
    omitUndefined: (obj: any) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)),
    isMobile: false,
    getExchangeMetadata: (exchangeName: string) => ({ name: exchangeName }),
    
    // Pricing utilities
    getNearTouchPrice: (side: string, ticker: any) => side === 'Buy' ? ticker?.bid : ticker?.ask,
    
    // Balance utilities
    getTotalBalanceFromBalance: (balance: any) => balance?.total || 0,
    getTotalMarginFromBalance: (balance: any) => balance?.used || 0,
    getAvailableMarginFromBalance: (balance: any) => balance?.free || 0,
    getMarginCurrency: (market: any) => 'USD',
    getBalanceSlice: (accountName: string) => mockBalance,
  },
  
  orders: {
    placeMarketOrder: async (symbol: string, accountName: string, side: string, options: any) => {
      console.log('faux: Market order placed', { symbol, accountName, side, options })
      return ['order-id-123']
    },
    placeLimitOrder: async (symbol: string, accountName: string, side: string, options: any) => {
      console.log('faux: Limit order placed', { symbol, accountName, side, options })
      return ['order-id-123']
    },
    placeStopLossOrder: async (symbol: string, accountName: string, side: string, options: any) => {
      console.log('faux: Stop loss order placed', { symbol, accountName, side, options })
      return ['order-id-123']
    },
    placeScaledOrder: async (symbol: string, accountName: string, side: string, options: any) => {
      console.log('faux: Scaled order placed', { symbol, accountName, side, options })
      return ['order-id-123']
    },
    placeTWAPOrder: async (symbol: string, accountName: string, side: string, options: any) => {
      console.log('faux: TWAP order placed', { symbol, accountName, side, options })
      return { orderId: 'twap-123', status: 'active' }
    },
    
    cancelOrder: async (accountName: string, order: any) => {
      console.log('faux: Order canceled', { accountName, order })
    },
    cancelOrders: async (accountName: string, orders: any[]) => {
      console.log('faux: Orders canceled', { accountName, orders })
    },
    updateOrder: async (accountName: string, order: any, updates: any) => {
      console.log('faux: Order updated', { accountName, order, updates })
    },
    chaseOrder: async (accountName: string, orderData: any, options?: any) => {
      console.log('faux: Order chased', { accountName, orderData, options })
      return 'chase-id-123'
    },
    
    closePosition: async (position: any) => {
      console.log('faux: Position closed', position)
    },
    setBreakeven: async (position: any) => {
      console.log('faux: Breakeven set', position)
    },
    getTrackedPrice: (trackEnabled: boolean, side: string, trackDistance: number, accountName: string, symbol: string, fallbackPrice: number) => {
      return fallbackPrice + (side === 'buy' ? -trackDistance : trackDistance)
    },
    getAvailableMaxOrderSize: (options: any) => 1000,
  },
  
  exchange: {
    getMarkets: (accountName?: string) => [mockMarket],
    getMarket: (symbol?: string, accountName?: string) => mockMarket,
    getTicker: (symbol?: string, accountName?: string) => mockTicker,
    getTickers: (accountName?: string) => [mockTicker],
    getStore: (accountName?: string) => ({
      markets: [mockMarket],
      tickers: [mockTicker],
      positions: [mockPosition],
      orders: [mockOrder],
      balance: mockBalance
    }),
    
    getBalance: (accountName: string) => mockBalance,
    getCombinedBalance: (accountNames?: string[]) => ({
      total: 25000,
      free: 20000,
      used: 5000,
      upnl: 500
    }),
    getPositions: (options?: any) => [mockPosition],
    getOrders: (options?: any) => [mockOrder],
    getAccountInfo: (accountName?: string) => ({ accountName, exchange: 'binance' }),
    getAllAccounts: () => ['main', 'secondary'],
    
    setLeverage: async (accountName: string, symbol: string, leverage: number) => {
      console.log('faux: Leverage set', { accountName, symbol, leverage })
    },
    
    callMethod: async (accountName: string, methodName: string, ...args: any[]) => {
      console.log('faux: Method called', { accountName, methodName, args })
      return {}
    },
  },
  
  components: {
    // Display Components
    ColoredNumber: ({ value, children }: any) => <span style={{ color: value >= 0 ? 'green' : 'red' }}>{children}</span>,
    ButtonWithConfirm: ({ buttonText, onConfirm }: any) => <button onClick={onConfirm}>{buttonText}</button>,
    Account: ({ account }: any) => <span>{account}</span>,
    SymbolDisplay: ({ symbol }: any) => <span>{symbol}</span>,
    SymbolIcon: ({ symbol }: any) => <span>🪙</span>,
    ExchangeIcon: ({ exchange }: any) => <span>📈</span>,
    
    // Table Components
    FastTable: ({ children }: any) => <table>{children}</table>,
    BlueTabs: ({ children }: any) => <div>{children}</div>,
    
    // Position Table Column Components
    RealizedPnlColumn: () => <td>$0.00</td>,
    SizeColumn: () => <td>0.1</td>,
    UnrealizedPnlColumn: () => <td>$100.00</td>,
    OpenPositionsPopoverSide: () => <div>Long</div>,
    
    // Trading Input Components
    SizeInput: ({ size, setSize }: any) => (
      <input
        type='number'
        value={size}
        onChange={(e) => setSize(parseFloat(e.target.value))}
      />
    ),
    PriceInput: ({ price, setPriceCallback }: any) => (
      <input
        type='number'
        value={price}
        onChange={(e) => setPriceCallback(parseFloat(e.target.value) || null)}
      />
    ),
    OrderSizeButtons: () => <div>Size Buttons</div>,
    QuickOrderButton: () => <button>Quick Order</button>,
    PostReduceOptions: () => <div>Post/Reduce Options</div>,
  },
  
  constants: {
    OrderSide: {
      Buy: 'buy',
      Sell: 'sell'
    },
    OrderType: {
      Market: 'market',
      Limit: 'limit',
      StopLoss: 'stop_market',
      TakeProfit: 'take_profit_market',
      TrailingStopLoss: 'trailing_stop_market'
    },
    OrderStatus: {
      Open: 'open',
      Closed: 'closed',
      Canceled: 'canceled',
      Creating: 'creating',
      Updating: 'updating',
      Canceling: 'canceling'
    },
    OrderTimeInForce: {
      GoodTillCancel: 'GoodTillCancel',
      ImmediateOrCancel: 'ImmediateOrCancel',
      FillOrKill: 'FillOrKill',
      PostOnly: 'PostOnly'
    },
    OrderStopTriggerType: {
      MarkPrice: 'mark_price',
      LastPrice: 'last_price',
      IndexPrice: 'index_price'
    },
    OrderRejectReason: {
      PostOnly: 'PostOnly',
      InsufficientBalance: 'InsufficientBalance',
      ReduceOnly: 'ReduceOnly'
    },
    PositionSide: {
      Long: 'long',
      Short: 'short'
    },
    MarginType: {
      Isolated: 'isolated',
      Cross: 'cross'
    },
    PositionMode: {
      Hedged: 'hedged',
      OneWay: 'oneway'
    }
  },
  
  data: {
    sortBy: (array: any[], key: string, desc?: boolean) => {
      return [...array].sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]
        return desc ? bVal - aVal : aVal - bVal
      })
    },
    groupBy: (array: any[], key: string) => {
      return array.reduce((groups, item) => {
        const group = item[key]
        if (!groups[group]) groups[group] = []
        groups[group].push(item)
        return groups
      }, {})
    },
    sum: (numbers: number[]) => numbers.reduce((a, b) => a + b, 0),
    average: (numbers: number[]) => numbers.reduce((a, b) => a + b, 0) / numbers.length,
    median: (numbers: number[]) => {
      const sorted = [...numbers].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
    },
    unique: (array: any[]) => [...new Set(array)],
    chunk: (array: any[], size: number) => {
      const chunks = []
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
      }
      return chunks
    }
  },
  
  log: {
    info: (message: string, ...args: any[]) => console.log('[INFO]', message, ...args),
    warn: (message: string, ...args: any[]) => console.warn('[WARN]', message, ...args),
    error: (message: string, ...args: any[]) => console.error('[ERROR]', message, ...args),
    debug: (message: string, ...args: any[]) => console.debug('[DEBUG]', message, ...args),
  },
  
  toast: toast,
  
  jotai: {
    atom,
    atomWithStorage,
    useAtom,
    useAtomValue,
    useSetAtom,
    createStorageAtom: (key: string, defaultValue: any, storage?: any) => {
      return atomWithStorage(key, defaultValue, storage)
    }
  },
  
  lodash: _,
  _: _,
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