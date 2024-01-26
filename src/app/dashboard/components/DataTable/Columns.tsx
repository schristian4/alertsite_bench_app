import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './DataColumnHeader'
import { Button } from '../../../../components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export type MonitorDataShape = {
  status: JSX.Element
  major_site: string
  avail: string
  rMetric: JSX.Element
}

export const Columns: ColumnDef<MonitorDataShape>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' className='flex align-middle justify-center' />
    ),
    cell: ({ row }) => (
      <div className='iconWrapper w-full flex align-middle justify-center relative'>
        {row.getValue('status')}
      </div>
    ),
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'major_site',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Major Site'
        className='flex align-middle justify-center'
      />
    ),
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  },
  {
    header: 'Availability',
    accessorKey: 'avail',
    cell: ({ row }) => <div className='lowercase'>{row.getValue('avail')}</div>,
    footer: (props) => props.column.id,
  },
  {
    header: 'Response Time Metric',
    accessorKey: 'rMetric',
    cell: ({ row }) => (
      <div className='minibar minibar--mini hover:border-cyan-400 border  pb-[1px]   '>
        {row.getValue('rMetric')}
      </div>
    ),
    footer: (props) => props.column.id,
  },
]
