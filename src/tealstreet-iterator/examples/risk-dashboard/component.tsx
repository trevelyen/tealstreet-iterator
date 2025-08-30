const { antd, hooks, utils, jotai } = api
const { Card, Row, Col, Statistic, Progress, Alert } = antd

// Example of using persistent storage
const riskSettingsAtom = jotai.createStorageAtom('risk-settings', {
  maxDailyLoss: 1000,
  maxPositions: 5,
  riskPerTrade: 2
})

const RiskDashboard = () => {
  const [activeAccount] = hooks.useActiveAccount()
  const positions = hooks.usePositions({ account: activeAccount })
  const balance = hooks.useBalance()
  const [riskSettings] = jotai.useAtom(riskSettingsAtom)
  
  // Calculate portfolio metrics
  const totalUnrealizedPnl = positions.reduce((sum, pos) => sum + (pos.unrealizedPnl || 0), 0)
  const totalPositions = positions.length
  const portfolioValue = balance?.total || 0
  const riskPercentage = portfolioValue > 0 ? Math.abs(totalUnrealizedPnl / portfolioValue * 100) : 0
  
  // Risk status
  const getRiskStatus = () => {
    if (riskPercentage > 5) return { status: 'error', color: 'red' }
    if (riskPercentage > 3) return { status: 'warning', color: 'orange' }
    return { status: 'success', color: 'green' }
  }
  
  const riskStatus = getRiskStatus()

  return (
    <div className="w-full space-y-4">
      <Card title="Risk Dashboard" size="small">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Total Positions"
              value={totalPositions}
              suffix={`/ ${riskSettings.maxPositions}`}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Unrealized P&L"
              value={totalUnrealizedPnl}
              precision={2}
              valueStyle={{ 
                color: totalUnrealizedPnl >= 0 ? '#3f8600' : '#cf1322' 
              }}
              prefix="$"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Portfolio Value"
              value={portfolioValue}
              precision={2}
              prefix="$"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Risk %"
              value={riskPercentage}
              precision={2}
              suffix="%"
              valueStyle={{ color: riskStatus.color }}
            />
          </Col>
        </Row>
      </Card>

      <Card title="Risk Limits" size="small">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Position Count</span>
              <span>{totalPositions} / {riskSettings.maxPositions}</span>
            </div>
            <Progress 
              percent={(totalPositions / riskSettings.maxPositions) * 100} 
              status={totalPositions >= riskSettings.maxPositions ? 'exception' : 'normal'}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Risk Exposure</span>
              <span>{riskPercentage.toFixed(2)}% / 5%</span>
            </div>
            <Progress 
              percent={(riskPercentage / 5) * 100} 
              status={riskStatus.status}
            />
          </div>
        </div>
      </Card>

      {riskPercentage > 3 && (
        <Alert
          message="High Risk Warning"
          description={`Portfolio risk is ${riskPercentage.toFixed(2)}%. Consider reducing position sizes.`}
          type="warning"
          showIcon
        />
      )}
      
      {totalPositions >= riskSettings.maxPositions && (
        <Alert
          message="Position Limit Reached"
          description={`You have reached the maximum of ${riskSettings.maxPositions} positions.`}
          type="error"
          showIcon
        />
      )}
    </div>
  )
}

export default RiskDashboard