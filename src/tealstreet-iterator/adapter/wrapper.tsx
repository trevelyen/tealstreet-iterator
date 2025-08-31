'use client'
import { useEffect, useState } from 'react'
import setupFauxApi from './ts-faux'
import { ToastContainer } from 'react-toastify'

// Initialize API immediately for SSR
setupFauxApi()

import Component from '../_BUILD-HERE/component-iterate'

// Wrapper that sets up mocks and renders component
export default function TealStreetWrapper() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setupFauxApi() // Initialize the faux API
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className='p-8'>Loading Tealstreet component...</div>
  }

  return <>
    <ToastContainer />
    <Component />
  </>
}
