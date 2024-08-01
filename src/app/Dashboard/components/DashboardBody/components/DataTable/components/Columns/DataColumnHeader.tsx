import { cn } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from '@radix-ui/react-icons'
import { Toggle } from '@radix-ui/react-toggle'
import { Column } from '@tanstack/react-table'
import { useState } from 'react'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  style,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [toggleSorting, setToggleSorting] = useState(false)
  if (!column.getCanSort()) {
    return (
      <div className={cn(className)} style={style}>
        {title}
      </div>
    )
  }
  function sortingToggle() {
    setToggleSorting(!toggleSorting)
    column.toggleSorting(toggleSorting)
  }

  return (
    <div className={cn('flex items-center space-x-2', className)} style={style}>
      <Toggle
        aria-label='Toggle bold'
        onClick={sortingToggle}
        className='-ml-3 h-8 data-[state=open]:bg-accent inline-block'
      >
        <div className='inline-flex align-middle'>
          <span>{title}</span>
          <>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className='ml-2 h-4 w-4' />
            ) : (
              <CaretSortIcon className='ml-2 h-4 w-4' />
            )}
          </>
        </div>
      </Toggle>
    </div>
  )
}
