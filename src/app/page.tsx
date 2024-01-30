'use client'
import Dashboard from './dashboard/components/Dashboard'
import { DataProvider } from './dashboard/components/providers/data-provider'
import { ThemeProvider } from './dashboard/components/providers/theme-provider'
export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center ph-24 m-12 adjust-mobile'>
      <DataProvider>
        <ThemeProvider>
          <Dashboard />
        </ThemeProvider>
      </DataProvider>
    </main>
  )
}
