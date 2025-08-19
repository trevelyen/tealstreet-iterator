'use client'
import TealstreetComponent from '@/app/tealstreet-iterator/adapter/wrapper'

export default function TealstreetPage() {
  return (
    <div className='p-4 min-h-screen bg-neutral-900'>
      <h1 className='text-2xl font-bold text-white'>Tealstreet Iterator</h1>
      <div className='mt-20 max-w-3xl mx-auto bg-neutral-700 border border-neutral-500'>
        <TealstreetComponent />
      </div>
    </div>
  )
}
