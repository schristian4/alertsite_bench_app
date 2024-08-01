'use client'
import { useEffect } from 'react'
import { useDataStore } from './redux/useDataStore'
import Dashboard from './Dashboard/Dashboard'
import { ThemeProvider } from '@/app/Dashboard/components/contexts/ThemeContexts'

export default function Home() {
  const { getMonitorData } = useDataStore()

  useEffect(() => {
    getMonitorData()
  }, [getMonitorData])
  return (
    <main className='flex min-h-screen flex-col items-center ph-24 m-12 adjust-mobile'>
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    </main>
  )
}
