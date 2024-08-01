'use client'
import { useEffect } from 'react'
import { useDataStore } from './redux/useDataStore'
import { ThemeProvider } from './contexts/ThemeContexts'
import DashboardComponent from '../app/Dashboard/DashboardComponent'
import DashboardPage from './DashboardPage'

export default function Home() {
  const { getMonitorData } = useDataStore()

  useEffect(() => {
    getMonitorData()
  }, [getMonitorData])
  return (
    <main className='flex min-h-screen flex-col items-center ph-24 m-12 adjust-mobile'>
      <ThemeProvider>
        <DashboardPage />
      </ThemeProvider>
    </main>
  )
}
