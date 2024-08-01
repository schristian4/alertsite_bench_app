'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'
import DashboardBody from './components/DashboardBody/DashboardBody'
import DashboardFooter from './components/DashboardFooter/DashboardFooter'
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader'

export default function DashboardComponent() {
  return (
    <div className='main-container '>
      <Card className='w-[100%]'>
        <DashboardHeader />
        <DashboardBody />
        <DashboardFooter />
      </Card>
    </div>
  )
}
