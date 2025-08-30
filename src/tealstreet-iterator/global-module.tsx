// Global Module - Shared state and utilities for all custom modules
// This code runs once and is available to all custom modules via 'global' import
// TypeScript types are automatically extracted for IntelliSense!
//
// TIP: For complex types, define 'type GlobalType = {...}' at the top of this file
// and it will be used directly instead of parsing your exports!

// Example: Create shared state with TypeScript types
const counterAtom = api.jotai.atom(0)

export type CustomOptions = {
  autoTrade: boolean
  riskLevel: number
  maxDailyLoss: number
  maxPositions: number
}

export const defaultOptions: CustomOptions = {
  autoTrade: false,
  riskLevel: 1,
  maxDailyLoss: 1000,
  maxPositions: 5,
}

const configAtom = api.jotai.createStorageAtom('custom-options', defaultOptions)

// Example: Shared utility functions with proper typing
export const utils = {
  // Format price with proper decimals
  formatPrice: (price: number, decimals: number = 2): string => {
    return price.toFixed(decimals)
  },

  // Calculate position size based on risk
  calculatePositionSize: (balance: number, riskPercent: number, stopDistance: number): number => {
    const riskAmount = balance * (riskPercent / 100)
    return riskAmount / stopDistance
  },

  // Fibonacci retracement levels
  getFibonacciLevels: (high: number, low: number) => {
    const diff = high - low
    return {
      level_0: low,
      level_236: low + diff * 0.236,
      level_382: low + diff * 0.382,
      level_500: low + diff * 0.500,
      level_618: low + diff * 0.618,
      level_786: low + diff * 0.786,
      level_100: high,
    }
  },

  // Risk-reward ratio calculation
  calculateRiskReward: (entryPrice: number, stopLoss: number, takeProfit: number): number => {
    const risk = Math.abs(entryPrice - stopLoss)
    const reward = Math.abs(takeProfit - entryPrice)
    return reward / risk
  },
}

// Example: Shared hooks with proper return types
export const hooks = {
  // Hook to use shared counter
  useSharedCounter: (): [number, (v: number) => void] => {
    return api.jotai.useAtom(counterAtom)
  },

  // Hook to use shared settings
  useSharedSettings: (): [CustomOptions, (v: CustomOptions) => void] => {
    return api.jotai.useAtom(configAtom)
  },

  // Hook for daily P&L tracking
  useDailyPnL: () => {
    const [dailyPnL, setDailyPnL] = api.jotai.useAtom(
      api.jotai.createStorageAtom('daily-pnl', 0)
    )
    
    const resetDaily = () => setDailyPnL(0)
    const addToPnL = (amount: number) => setDailyPnL(prev => prev + amount)
    
    return { dailyPnL, resetDaily, addToPnL }
  }
}

// Example: Shared constants with literal types
export const constants = {
  MAX_POSITION_SIZE: 50000,
  MIN_POSITION_SIZE: 1,
  DEFAULT_LEVERAGE: 10,
  RISK_LEVELS: {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 5,
  } as const,
  
  // Common timeframes
  TIMEFRAMES: {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '4h': '4h',
    '1d': '1d',
  } as const,
}

// Example: TypeScript types (these will appear in IntelliSense!)
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type Timeframe = keyof typeof constants.TIMEFRAMES

// Example: Class with methods
export class RiskManager {
  private maxRiskPercent: number

  constructor(maxRisk: number = 2) {
    this.maxRiskPercent = maxRisk
  }

  calculateStopLoss(entryPrice: number, riskPercent: number, side: 'buy' | 'sell'): number {
    const riskAmount = riskPercent / 100
    
    if (side === 'buy') {
      return entryPrice * (1 - riskAmount)
    } else {
      return entryPrice * (1 + riskAmount)
    }
  }

  calculateTakeProfit(entryPrice: number, riskRewardRatio: number, stopLoss: number): number {
    const risk = Math.abs(entryPrice - stopLoss)
    const reward = risk * riskRewardRatio
    
    if (entryPrice > stopLoss) {
      // Long position
      return entryPrice + reward
    } else {
      // Short position
      return entryPrice - reward
    }
  }

  isRiskAcceptable(riskPercent: number): boolean {
    return riskPercent <= this.maxRiskPercent
  }

  getPositionSize(balance: number, riskPercent: number, entryPrice: number, stopLoss: number): number {
    const riskAmount = balance * (riskPercent / 100)
    const priceDistance = Math.abs(entryPrice - stopLoss)
    return riskAmount / priceDistance
  }
}

// Example: Alert system
const alertsAtom = api.jotai.createStorageAtom('price-alerts', [] as Array<{
  id: string
  symbol: string
  price: number
  condition: 'above' | 'below'
  message: string
}>)

export const alerts = {
  useAlerts: () => api.jotai.useAtom(alertsAtom),
  
  addAlert: (symbol: string, price: number, condition: 'above' | 'below', message: string) => {
    const [alerts, setAlerts] = api.jotai.useAtom(alertsAtom)
    const newAlert = {
      id: Date.now().toString(),
      symbol,
      price,
      condition,
      message,
    }
    setAlerts([...alerts, newAlert])
    return newAlert.id
  },
  
  removeAlert: (id: string) => {
    const [alerts, setAlerts] = api.jotai.useAtom(alertsAtom)
    setAlerts(alerts.filter(alert => alert.id !== id))
  },
}

// Example: Test Component using Ant Design
const { Card, Space, Typography, Button } = api.antd
const { Text: AntText } = Typography

export const TestComponent = () => {
  const [counter, setCounter] = hooks.useSharedCounter()
  const [settings] = hooks.useSharedSettings()
  
  return (
    <Card title='Global Module Test' size='small'>
      <Space direction='vertical' style={{ width: '100%' }}>
        <div>
          <AntText strong>Shared Counter: {counter}</AntText>
          <Button 
            onClick={() => setCounter(counter + 1)} 
            style={{ marginLeft: 8 }}
          >
            Increment
          </Button>
        </div>
        <div>
          <AntText>Auto Trade: {settings.autoTrade ? 'On' : 'Off'}</AntText>
        </div>
        <div>
          <AntText>Risk Level: {settings.riskLevel}</AntText>
        </div>
      </Space>
    </Card>
  )
}