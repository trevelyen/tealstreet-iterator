import * as React from 'react'

const { hooks, utils } = api

const Component = () => {
  const [activeAccount] = hooks.useActiveAccount()
  const balance = hooks.useBalance(activeAccount)
  const combinedBalance = hooks.useCombinedBalance()

  return (
    <div className='p-6 bg-gray-900'>
      <h2 className='text-xl font-bold text-white mb-4'>Account Balance</h2>
      
      {activeAccount && balance ? (
        <div className='space-y-2'>
          <div className='text-gray-300'>
            <span className='font-medium'>{activeAccount}:</span>
          </div>
          <div className='text-2xl font-bold text-green-400'>
            {utils.formatCurrency(balance.total || 0)}
          </div>
          {balance.free !== balance.total && (
            <div className='text-sm text-gray-400'>
              Available: {utils.formatCurrency(balance.free || 0)}
            </div>
          )}
          {balance.used > 0 && (
            <div className='text-sm text-orange-400'>
              In Use: {utils.formatCurrency(balance.used || 0)}
            </div>
          )}
        </div>
      ) : (
        <div className='text-gray-400'>No account selected</div>
      )}

      {combinedBalance && (
        <div className='mt-6 pt-4 border-t border-gray-700'>
          <div className='text-gray-300 mb-2'>Combined Balance:</div>
          <div className='text-lg font-semibold text-blue-400'>
            {utils.formatCurrency(combinedBalance.total || 0)}
          </div>
        </div>
      )}
    </div>
  )
}

// For development, will be removed in build
export default Component
