const { antd, hooks, utils, orders, components, toast } = api
const { Table, Card, Button, Tag, Space } = antd
const { ColoredNumber, ButtonWithConfirm } = components

const PositionMonitor = () => {
  const [activeSymbol] = hooks.useActiveSymbol()
  const [activeAccount] = hooks.useActiveAccount()
  const positions = hooks.usePositions({ 
    account: activeAccount,
    includeMultipleAccounts: true 
  })

  const closePosition = async (position) => {
    try {
      await orders.closePosition(position)
      toast.success(`Closed position: ${position.symbol}`)
    } catch (error) {
      toast.error(`Failed to close: ${error.message}`)
    }
  }

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      render: (side) => (
        <Tag color={side === 'long' ? 'green' : 'red'}>
          {side?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => utils.formatNumber(size, 6),
    },
    {
      title: 'Entry Price',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price) => utils.formatCurrency(price),
    },
    {
      title: 'Unrealized PnL',
      dataIndex: 'unrealizedPnl',
      key: 'unrealizedPnl',
      render: (pnl) => (
        <ColoredNumber value={pnl}>
          {utils.formatPnl(pnl)}
        </ColoredNumber>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, position) => (
        <ButtonWithConfirm
          buttonText="Close"
          onConfirm={() => closePosition(position)}
          danger
        />
      ),
    },
  ]

  return (
    <Card title="Position Monitor" className="w-full">
      <div className="mb-4 text-sm text-gray-300">
        Active: {activeSymbol || 'All'} | Account: {activeAccount || 'All'}
      </div>
      
      <Table
        columns={columns}
        dataSource={positions}
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ y: 400 }}
      />
      
      {positions.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No positions found
        </div>
      )}
    </Card>
  )
}

export default PositionMonitor