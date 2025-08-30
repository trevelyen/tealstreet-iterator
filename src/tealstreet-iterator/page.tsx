'use client'
import TealstreetComponent from '@/tealstreet-iterator/adapter/wrapper'

export default function TealstreetPage() {
  return (
    <div className='p-4 min-h-screen bg-neutral-900'>
      <h1 className='text-2xl font-bold text-white'>Tealstreet Iterator</h1>
        <TealstreetComponent />
    </div>
  )
}
