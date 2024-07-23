import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dashboard from '../Dashboard'
import { DataProviderContext, DataProviderState } from '../components/providers/data-provider'
import { SortedLocationNameIds } from '@/lib/constants'
export type MonitorDatum = {
  id: number
  name: string
}

// Mock data for the test
const mockContextData: DataProviderState = {
  loading: false,
  monitorData: SortedLocationNameIds,
  rerender: jest.fn(),
  progress: 100,
  errorStatus: false,
  errorMessage: '',
  errorStatusCode: 0,
}

describe('Dashboard Component | Success State', () => {
  test('Should render the dashboard content', async () => {
    render(
      <DataProviderContext.Provider value={mockContextData}>
        <Dashboard />
      </DataProviderContext.Provider>
    )

    expect(screen.getByText('AlertSite Technical Benchmark 2.0')).toBeInTheDocument()
    // Checking some components are rendered within LoadingWrapper when not loading
    await waitFor(() => expect(screen.getByText('Atlanta, GA - 20')).toBeInTheDocument())
  })
})
const errorMockContextData: DataProviderState = {
  loading: false,
  monitorData: SortedLocationNameIds,
  rerender: jest.fn(),
  progress: 100,
  errorStatus: true,
  errorMessage: '404 \n Error Code: 404',
  errorStatusCode: 404,
}
describe('Dashboard Component | Error State', () => {
  test('Should render the dashboard with error message', async () => {
    render(
      <DataProviderContext.Provider value={errorMockContextData}>
        <Dashboard />
      </DataProviderContext.Provider>
    )

    // Checking some components are rendered within LoadingWrapper when not loading
    await waitFor(() => expect(screen.getByText('404')).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText('Error Code: 404')).toBeInTheDocument())
  })
  test('calls rerender function when REFRESH button is clicked', async () => {
    render(
      <DataProviderContext.Provider value={errorMockContextData}>
        <Dashboard />
      </DataProviderContext.Provider>
    )

    const button = screen.getByText('REFRESH')
    fireEvent.click(button)

    expect(errorMockContextData.rerender).toHaveBeenCalledTimes(1)
  })
})
