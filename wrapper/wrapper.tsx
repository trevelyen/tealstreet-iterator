// @ts-nocheck
'use client'
import { useEffect, useState } from 'react'
import setupFauxApi from './ts-faux'
import Component from '../component'

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

  return <Component />
}
