import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './DataColumnHeader'

export const Columns: ColumnDef<MonitorDataTableShape>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' className='flex items-center justify-center' />
    ),

    cell: ({ row }) => {
      return (
        <div className='iconWrapper w-full flex items-center justify-center relative'>
          {row.getValue('status')}
        </div>
      )
    },
    sortingFn: (rowA, rowB, columnId) => {
      const aElement = rowA.getValue(columnId) as React.ReactElement
      const bElement = rowB.getValue(columnId) as React.ReactElement

      const aStatusCode = aElement.props.statusScore
      const bStatusCode = bElement.props.statusScore

      return aStatusCode - bStatusCode
    },
    enableSorting: true,
  },
  {
    accessorKey: 'major_site',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Major Site'
        className='flex items-center text-center justify-center'
        style={{ maxWidth: 200 }}
      />
    ),
    cell: ({ row }) => (
      <div className='flex justify-center items-center'>
        <p style={{ overflowWrap: 'break-word', maxWidth: 200 }}>{row.getValue('major_site')}</p>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'avail',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Availability'
        className='flex items-center justify-center'
      />
    ),
    cell: ({ row }) => {
      return (
        <div className='lowercase' style={{ maxWidth: 100 }}>
          {parseFloat(row.getValue('avail')).toFixed(2)}%
        </div>
      )
    },
    sortingFn: (rowA, rowB, columnId) => {
      const aValue = parseFloat(rowA.getValue(columnId))
      const bValue = parseFloat(rowB.getValue(columnId))
      return aValue - bValue
    },
    enableSorting: true,
  },
  {
    accessorKey: 'rMetric',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Response Time Metric'
        className='flex items-center justify-center'
        style={{ overflow: 'hidden' }}
      />
    ),
    cell: ({ row }) => (
      <div className='minibar minibar--mini hover:border-cyan-400 border pb-[1px] ' style={{ maxWidth: 500 }}>
        {row.getValue('rMetric')}
      </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const aValue = parseFloat(rowA.getValue('avail'))
      const bValue = parseFloat(rowB.getValue('avail'))
      return aValue - bValue
    },
    enableSorting: true,
  },
]
