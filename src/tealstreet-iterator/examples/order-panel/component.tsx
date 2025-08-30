const { antd, hooks, utils, orders, components, toast, constants } = api
const { useState, useEffect } = React
const { Button, Card, Space, Switch, InputNumber } = antd
const { SizeInput, PriceInput } = components
const { OrderSide, OrderTimeInForce } = constants

const OrderPanel = () => {
  const [activeSymbol] = hooks.useActiveSymbol()
  const [activeAccount] = hooks.useActiveAccount()
  const ticker = hooks.useTicker()
  
  const [size, setSize] = useState(0.01)
  const [price, setPrice] = useState(0)
  const [postOnly, setPostOnly] = useState(false)
  
  // Auto-update price from ticker
  useEffect(() => {
    if (ticker?.last && price === 0) {
      setPrice(ticker.last)
    }
  }, [ticker, price])
  
  const placeOrder = async (side) => {
    try {
      await orders.placeLimitOrder(activeSymbol, activeAccount, side, {
        amount: size,
        price: price,
        timeInForce: postOnly ? OrderTimeInForce.PostOnly : OrderTimeInForce.GoodTillCancel
      })
      toast.success(`${side} order placed: ${size} @ ${price}`)
    } catch (error) {
      toast.error(`Order failed: ${error.message}`)
    }
  }

  return (
    <Card title="Quick Order Panel" size="small" className="w-full max-w-md">
      <Space direction="vertical" className="w-full">
        <div>Symbol: {activeSymbol || 'None'}</div>
        <div>Account: {activeAccount || 'None'}</div>
        
        <SizeInput
          size={size}
          setSize={setSize}
          price={price}
          activeSymbol={activeSymbol}
          activeAccount={activeAccount}
        />
        
        <PriceInput
          price={price}
          setPriceCallback={setPrice}
          activeSymbol={activeSymbol}
          activeAccount={activeAccount}
        />
        
        <div>
          <Switch checked={postOnly} onChange={setPostOnly} /> Post Only
        </div>
        
        <Space>
          <Button 
            type="primary" 
            className="bg-green-600"
            onClick={() => placeOrder(OrderSide.Buy)}
          >
            Buy {size}
          </Button>
          <Button 
            type="primary" 
            className="bg-red-600"
            onClick={() => placeOrder(OrderSide.Sell)}
          >
            Sell {size}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

export default OrderPanel