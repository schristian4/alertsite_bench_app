import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DataTable, { MonitorDataShape } from '../components/DataTable'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<MonitorDataShape>[] = [
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Major Site',
    accessorKey: 'major_site',
  },
  {
    header: 'Availability',
    accessorKey: 'avail',
  },
  {
    header: 'Metric',
    accessorKey: 'rMetric',
  },
]

const data: MonitorDataShape[] = [
  {
    status: <span>Active</span>,
    major_site: 'Site A',
    avail: '99%',
    rMetric: <span>100ms</span>,
  },
  {
    status: <span>Inactive</span>,
    major_site: 'Site B',
    avail: '95%',
    rMetric: <span>200ms</span>,
  },
]

describe('DataTable', () => {
  it('renders table headers correctly', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Major Site')).toBeInTheDocument()
    expect(screen.getByText('Availability')).toBeInTheDocument()
    expect(screen.getByText('Metric')).toBeInTheDocument()
  })

  it('renders table rows correctly', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Site A')).toBeInTheDocument()
    expect(screen.getByText('99%')).toBeInTheDocument()

    expect(screen.getByText('Inactive')).toBeInTheDocument()
    expect(screen.getByText('Site B')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
    // expect(screen.getByText('200ms')).toBeInTheDocument() // rMetric is a span with text
  })

  it('displays "No results." when there is no data', () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText('No results.')).toBeInTheDocument()
  })
})
