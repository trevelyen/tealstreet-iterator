// Import types from api-types module
declare module "api-types" {
  export type Position = {
    id: string;
    symbol: string;
    side: 'long' | 'short';
    entryPrice: number;
    notional: number;
    leverage: number;
    marginType?: 'cross' | 'isolated';
    positionMode?: 'hedged' | 'one-way';
    unrealizedPnl: number;
    realizedPnl?: number;
    contracts: number;
    contractsNative?: number;
    liquidationPrice: number;
    lastUpdate?: number;
    info?: any;
    extra?: {
      contractsNative?: number;
      unrealizedPnlNative?: number;
    };
  };

  export type DisplayedPosition = Position & {
    account: string;
    ticker?: Ticker;
    market?: Market;
    balance?: Balance;
    exchangeName?: string;
    oneMinUpnl?: number;
    fiveMinUpnl?: number;
    hasActiveChaser?: boolean;
    hasActiveTWAP?: boolean;
    isFakePosition?: boolean;
    chaserSize?: number;
  };

  export type Order = {
    id: string;
    parentId?: string;
    status: OrderStatus;
    symbol: string;
    type: OrderType;
    side: OrderSide;
    price: number;
    amount: number;
    filled: number;
    remaining: number;
    reduceOnly: boolean;
    close?: boolean;
    timeInForce?: OrderTimeInForce;
    lastUpdate: number;
    tpTriggerType?: OrderStopTriggerType;
    slTriggerType?: OrderStopTriggerType;
    takeProfit?: number;
    stopLoss?: number;
    info?: any;
    extra?: {
      remainingNative?: number;
      remainingNotional?: number;
      rejectReason?: OrderRejectReason;
      isFromChaser?: boolean;
      chaserId?: string;
    };
  };

  export type Market = {
    id: string;
    symbol: string;
    base: string;
    quote: string;
    active: boolean;
    precision: {
      amount: number;
      price: number;
    };
    contractSize?: number;
    isExpiring?: boolean;
    isInverse?: boolean;
    isSpot?: boolean;
    isReadOnly?: boolean;
    takerFee?: number;
    makerFee?: number;
    info?: any;
  };

  export type Ticker = {
    id: string;
    symbol: string;
    bid: number;
    ask: number;
    last: number;
    mark: number;
    index: number;
    percentage: number;
    openInterest: number;
    fundingRate: number;
    fundingTime: number;
    volume: number;
    quoteVolume: number;
    info?: any;
  };

  export type Balance = {
    used: number;
    free: number;
    total: number;
    upnl: number;
    currencies?: { [currency: string]: Balance };
    coins?: { [coin: string]: CoinBalance };
    info?: any;
  };

  export type CoinBalance = {
    base: string;
    amount: number;
    notional: number;
  };

  export type OrderBook = {
    bids: OrderBookOrders[];
    asks: OrderBookOrders[];
  };

  export type OrderBookUpdate = any;

  export type OrderBookOrders = {
    price: number;
    amount: number;
    total: number;
  };

  export type Candle = {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    lastSide?: OrderSide;
  };

  export type OrderSide = 'buy' | 'sell';
  export type OrderType = 'market' | 'limit' | 'stop_market' | 'take_profit_market' | 'trailing_stop_market';
  export type OrderStatus = 'open' | 'closed' | 'canceled' | 'creating' | 'updating' | 'canceling';
  export type OrderTimeInForce = 'GoodTillCancel' | 'ImmediateOrCancel' | 'FillOrKill' | 'PostOnly';
  export type OrderStopTriggerType = 'mark_price' | 'last_price' | 'index_price';
  export type OrderRejectReason = 'PostOnly' | 'InsufficientBalance' | 'ReduceOnly' | string;
  export type Timeframe = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '12h' | '1d' | '1w';
  export type MarginType = 'cross' | 'isolated';
  export type PositionMode = 'hedged' | 'oneway';
  export type PositionSide = 'long' | 'short';
}
