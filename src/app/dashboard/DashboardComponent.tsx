'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'
import DashboardBody from './components/DashboardBody/DashboardBody'
import DashboardFooter from './components/DashboardFooter/DashboardFooter'
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader'

type CardProps = React.ComponentProps<typeof Card>

export default function DashboardComponent({ className, ...props }: CardProps) {
  return (
    <div className='main-container '>
      <Card className={cn('w-[100%]', className)} {...props}>
        <DashboardHeader />
        <DashboardBody />
        <DashboardFooter />
      </Card>
    </div>
  )
}
