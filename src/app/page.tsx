'use client'
import { useEffect } from 'react'
import { useDataStore } from './redux/useDataStore'
import { ThemeProvider } from './contexts/ThemeContexts'
import DashboardComponent from '../app/Dashboard/DashboardComponent'
import { Analytics } from '@vercel/analytics/next'

export default function Home() {
  const { getMonitorData } = useDataStore()

  useEffect(() => {
    getMonitorData()
    // Only run once on mount - getMonitorData dependency would cause infinite re-renders
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <main className='flex min-h-screen flex-col items-center ph-24 m-12 adjust-mobile'>
      <Analytics />
      <ThemeProvider>
        <DashboardComponent />
      </ThemeProvider>
    </main>
  )
}
