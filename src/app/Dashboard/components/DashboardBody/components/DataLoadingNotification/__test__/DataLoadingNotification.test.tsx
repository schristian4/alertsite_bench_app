import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { DataLoadingNotification } from '../DataLoadingNotification'

// Mock the useDataStore hook
jest.mock('@/app/redux/useDataStore', () => ({
  useDataStore: jest.fn(),
}))

const mockUseDataStore = require('@/app/redux/useDataStore').useDataStore

describe('DataLoadingNotification', () => {
  beforeEach(() => {
    mockUseDataStore.mockReset()
  })

  it('renders nothing when apiMetadata is null and no cache status', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: null,
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    const { container } = render(<DataLoadingNotification />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when there are no failures or skips', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 10,
        failureCount: 0,
        skippedCount: 0,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    const { container } = render(<DataLoadingNotification />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when all requests failed (complete failure)', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 0,
        failureCount: 10,
        skippedCount: 0,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    const { container } = render(<DataLoadingNotification />)
    expect(container.firstChild).toBeNull()
  })

  it('renders partial failure warning when some requests failed', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 7,
        failureCount: 3,
        skippedCount: 0,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    expect(screen.getByText('Partial Data Load Warning')).toBeInTheDocument()
    expect(
      screen.getByText(
        '3 out of 10 monitor requests were affected: 3 failed. Some data may be missing from the dashboard.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('renders partial warning when some requests were skipped', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 7,
        failureCount: 0,
        skippedCount: 3,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    expect(screen.getByText('Partial Data Load Warning')).toBeInTheDocument()
    expect(
      screen.getByText(
        '3 out of 10 monitor requests were affected: 3 skipped to optimize performance. Some data may be missing from the dashboard.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Skipped requests prevent excessive API calls when timestamp ranges consistently fail, reducing load times.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('renders combined warning when some requests failed and some were skipped', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 5,
        failureCount: 3,
        skippedCount: 2,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    expect(screen.getByText('Partial Data Load Warning')).toBeInTheDocument()
    expect(
      screen.getByText(
        '5 out of 10 monitor requests were affected: 3 failed, 2 skipped to optimize performance. Some data may be missing from the dashboard.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Skipped requests prevent excessive API calls when timestamp ranges consistently fail, reducing load times.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('renders nothing when all requests were skipped (complete skip)', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 0,
        failureCount: 0,
        skippedCount: 10,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    const { container } = render(<DataLoadingNotification />)
    expect(container.firstChild).toBeNull()
  })

  // Cache functionality tests
  it('renders cache notification when data is from cache', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 10,
        failureCount: 0,
        skippedCount: 0,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: true,
        cacheAge: 5,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    expect(screen.getByText('Cached Data')).toBeInTheDocument()
    expect(screen.getByText('Data loaded from cache (5 minutes old) for instant display')).toBeInTheDocument()
  })

  it('renders cache notification when data is being updated', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 10,
        failureCount: 0,
        skippedCount: 0,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: true,
        cacheAge: 20,
        isUpdating: true,
      },
    })

    render(<DataLoadingNotification />)

    expect(screen.getByText('Updating Data')).toBeInTheDocument()
    expect(
      screen.getByText('Showing cached data (20 minutes old) while fetching fresh data in background')
    ).toBeInTheDocument()
    expect(screen.getByText('Updating')).toBeInTheDocument()
  })

  it('renders both cache and issues notifications together', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 7,
        failureCount: 3,
        skippedCount: 0,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: true,
        cacheAge: 10,
        isUpdating: true,
      },
    })

    render(<DataLoadingNotification />)

    // Cache notification should be present
    expect(screen.getByText('Updating Data')).toBeInTheDocument()
    expect(
      screen.getByText('Showing cached data (10 minutes old) while fetching fresh data in background')
    ).toBeInTheDocument()

    // Issues notification should also be present
    expect(screen.getByText('Partial Data Load Warning')).toBeInTheDocument()
    expect(
      screen.getByText(
        '3 out of 10 monitor requests were affected: 3 failed. Some data may be missing from the dashboard.'
      )
    ).toBeInTheDocument()
  })

  it('renders only cache notification when no issues exist', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: null,
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: true,
        cacheAge: 8,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    expect(screen.getByText('Cached Data')).toBeInTheDocument()
    expect(screen.getByText('Data loaded from cache (8 minutes old) for instant display')).toBeInTheDocument()

    // Should not show issues notification
    expect(screen.queryByText('Partial Data Load Warning')).not.toBeInTheDocument()
  })

  // Minimize and Clear functionality tests
  it('allows minimizing and expanding cache notification', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: null,
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: true,
        cacheAge: 5,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    // Initially should show full notification
    expect(screen.getByText('Data loaded from cache (5 minutes old) for instant display')).toBeInTheDocument()

    // Click minimize button
    const minimizeButton = screen.getByTitle('Minimize cache notification')
    fireEvent.click(minimizeButton)

    // Detail text should be hidden
    expect(
      screen.queryByText('Data loaded from cache (5 minutes old) for instant display')
    ).not.toBeInTheDocument()

    // Click expand button
    const expandButton = screen.getByTitle('Expand cache notification')
    fireEvent.click(expandButton)

    // Detail text should be visible again
    expect(screen.getByText('Data loaded from cache (5 minutes old) for instant display')).toBeInTheDocument()
  })

  it('allows dismissing cache notification', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: null,
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: true,
        cacheAge: 5,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    // Initially should show notification
    expect(screen.getByText('Cached Data')).toBeInTheDocument()

    // Click dismiss button
    const dismissButton = screen.getByTitle('Dismiss cache notification')
    fireEvent.click(dismissButton)

    // Notification should be hidden
    expect(screen.queryByText('Cached Data')).not.toBeInTheDocument()
  })

  it('allows minimizing and expanding issues notification', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 7,
        failureCount: 3,
        skippedCount: 0,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    // Initially should show full notification
    expect(
      screen.getByText(
        '3 out of 10 monitor requests were affected: 3 failed. Some data may be missing from the dashboard.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()

    // Click minimize button
    const minimizeButton = screen.getByTitle('Minimize issues notification')
    fireEvent.click(minimizeButton)

    // Detail text and retry button should be hidden
    expect(
      screen.queryByText(
        '3 out of 10 monitor requests were affected: 3 failed. Some data may be missing from the dashboard.'
      )
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()

    // But title should still be visible
    expect(screen.getByText('Partial Data Load Warning')).toBeInTheDocument()

    // Click expand button
    const expandButton = screen.getByTitle('Expand issues notification')
    fireEvent.click(expandButton)

    // Detail text and retry button should be visible again
    expect(
      screen.getByText(
        '3 out of 10 monitor requests were affected: 3 failed. Some data may be missing from the dashboard.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('allows dismissing issues notification', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: {
        totalRequested: 10,
        successCount: 7,
        failureCount: 3,
        skippedCount: 0,
      },
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })

    render(<DataLoadingNotification />)

    // Initially should show notification
    expect(screen.getByText('Partial Data Load Warning')).toBeInTheDocument()

    // Click dismiss button
    const dismissButton = screen.getByTitle('Dismiss issues notification')
    fireEvent.click(dismissButton)

    // Notification should be hidden
    expect(screen.queryByText('Partial Data Load Warning')).not.toBeInTheDocument()
  })

  it('hides updating indicator when cache notification is minimized', () => {
    mockUseDataStore.mockReturnValue({
      apiMetadata: null,
      refreshMonitorData: jest.fn(),
      cacheStatus: {
        isFromCache: true,
        cacheAge: 20,
        isUpdating: true,
      },
    })

    render(<DataLoadingNotification />)

    // Initially should show updating indicator
    expect(screen.getByText('Updating')).toBeInTheDocument()

    // Click minimize button
    const minimizeButton = screen.getByTitle('Minimize cache notification')
    fireEvent.click(minimizeButton)

    // Updating indicator should be hidden
    expect(screen.queryByText('Updating')).not.toBeInTheDocument()
  })
})
