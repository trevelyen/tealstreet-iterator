const { antd, hooks, utils, orders, components, toast, constants } = api
const { useState, useEffect, useCallback } = React
const { OrderSide, OrderTimeInForce } = constants

const Component = () => {
  toast.error('test');
  const [activeSymbol] = hooks.useActiveSymbol()
  const [activeAccount] = hooks.useActiveAccount()
  const market = hooks.useMarket(activeSymbol, activeAccount)
  const ticker = hooks.useTicker()
  const balance = hooks.useBalance()
  const positions = hooks.usePositions({ symbol: activeSymbol, account: activeAccount })

  // Order state
  const [side, setSide] = useState(OrderSide.Buy)
  const [size, setSize] = useState(0.001)
  const [price, setPrice] = useState(0)
  const [orderType, setOrderType] = useState('limit')
  const [postOnly, setPostOnly] = useState(false)
  const [reduceOnly, setReduceOnly] = useState(false)

  // Bracket order states for stop loss and take profit
  const [enableStopLoss, setEnableStopLoss] = useState(false)
  const [stopLossPercent, setStopLossPercent] = useState(2) // 2% default
  const [enableTakeProfit, setEnableTakeProfit] = useState(false)
  const [takeProfitPercent, setTakeProfitPercent] = useState(5) // 5% default

  // Handler for PriceInput that handles null values
  const handlePriceChange = useCallback((newPrice: number | null) => {
    if (newPrice !== null) {
      setPrice(newPrice)
    }
  }, [])

  // Update price when ticker changes
  useEffect(() => {
    if (ticker && price === 0) {
      const nearTouchPrice = utils.getNearTouchPrice(side, ticker)
      if (nearTouchPrice !== undefined && nearTouchPrice > 0) {
        setPrice(nearTouchPrice)
      }
    }
  }, [ticker, side, price])

  const currentPosition = positions.find((p) => p.symbol === activeSymbol)
 
  const handlePlaceOrder = async () => {
    if (!activeSymbol || !activeAccount) {
      toast.error('Please select a symbol and account')
      return
    }

    try {
      // Calculate bracket order prices if enabled
      const orderPrice = orderType === 'market' ? ticker?.last || 0 : price
      const options: any = {
        amount: size,
        reduceOnly,
      }

      // Add bracket orders (stop loss and take profit) if enabled
      // These create additional orders alongside the main order
      if (enableStopLoss && orderPrice > 0) {
        const stopPrice = side === OrderSide.Buy ? orderPrice * (1 - stopLossPercent / 100) : orderPrice * (1 + stopLossPercent / 100)

        // Round to market precision
        if (market?.precision?.price) {
          options.stopLoss = utils.math.adjust(stopPrice, market.precision.price)
        } else {
          options.stopLoss = stopPrice
        }
      }

      if (enableTakeProfit && orderPrice > 0) {
        const tpPrice = side === OrderSide.Buy ? orderPrice * (1 + takeProfitPercent / 100) : orderPrice * (1 - takeProfitPercent / 100)

        // Round to market precision
        if (market?.precision?.price) {
          options.takeProfit = utils.math.adjust(tpPrice, market.precision.price)
        } else {
          options.takeProfit = tpPrice
        }
      }

      if (orderType === 'market') {
        await orders.placeMarketOrder(activeSymbol, activeAccount, side, options)
      } else {
        options.price = price
        options.timeInForce = postOnly ? OrderTimeInForce.PostOnly : OrderTimeInForce.GoodTillCancel
        await orders.placeLimitOrder(activeSymbol, activeAccount, side, options)
      }

      let message = `Order placed: ${side} ${size} @ ${orderType === 'market' ? 'Market' : price}`
      if (enableStopLoss) message += ` | SL: $${options.stopLoss?.toFixed(2)}`
      if (enableTakeProfit) message += ` | TP: $${options.takeProfit?.toFixed(2)}`
      toast.success(message)
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleClosePosition = async () => {
    if (currentPosition) {
      try {
        await orders.closePosition(currentPosition)
        toast.success('Position closed')
      } catch (error) {
        console.error('Failed to close position:', error)
        toast.error(`Failed to close: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  return <div className='p-2 mt-20 max-w-3xl mx-auto bg-neutral-700 border border-neutral-500'>Build here</div>
}

Component