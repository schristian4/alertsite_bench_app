'use client'
import { useEffect } from 'react'
import { ThemeProvider } from './Dashboard/components/contexts/ThemeContexts'
import Dashboard from './Dashboard/Dashboard'
import { useDataStore } from './redux/useDataStore'

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
