'use client'
import React, { useState } from 'react'
import { useDataStore } from '@/app/redux/useDataStore'
import { AlertTriangle, RefreshCw, Info, Minimize2, X, ChevronDown } from 'lucide-react'

export function DataLoadingNotification() {
  const { apiMetadata, refreshMonitorData, cacheStatus } = useDataStore()

  // State for notification visibility controls
  const [cacheMinimized, setCacheMinimized] = useState(false)
  const [cacheDismissed, setCacheDismissed] = useState(false)
  const [issuesMinimized, setIssuesMinimized] = useState(false)
  const [issuesDismissed, setIssuesDismissed] = useState(false)

  // Determine which notifications to show
  const showCacheNotification = (cacheStatus.isFromCache || cacheStatus.isUpdating) && !cacheDismissed
  const showIssuesNotification =
    apiMetadata &&
    (apiMetadata.failureCount > 0 || apiMetadata.skippedCount > 0) &&
    apiMetadata.successCount > 0 &&
    !issuesDismissed

  // Don't show anything if no notifications needed
  if (!showCacheNotification && !showIssuesNotification) {
    return null
  }

  const totalIssues = apiMetadata ? apiMetadata.failureCount + apiMetadata.skippedCount : 0
  const hasFailures = apiMetadata ? apiMetadata.failureCount > 0 : false
  const hasSkips = apiMetadata ? apiMetadata.skippedCount > 0 : false

  return (
    <div className='mb-4 space-y-2'>
      {/* Cache Status Notification */}
      {showCacheNotification && (
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg'>
          <div className='flex items-center gap-3 p-3'>
            <Info className='h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                {cacheStatus.isUpdating ? 'Updating Data' : 'Cached Data'}
              </p>
              {!cacheMinimized && (
                <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
                  {cacheStatus.isUpdating
                    ? `Showing cached data (${cacheStatus.cacheAge} minutes old) while fetching fresh data in background`
                    : `Data loaded from cache (${cacheStatus.cacheAge} minutes old) for instant display`}
                </p>
              )}
            </div>
            {cacheStatus.isUpdating && !cacheMinimized && (
              <div className='flex items-center gap-1 px-2 py-1 text-xs text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/30 rounded'>
                <RefreshCw className='h-3 w-3 animate-spin' />
                Updating
              </div>
            )}
            <div className='flex items-center gap-1'>
              <button
                onClick={() => setCacheMinimized(!cacheMinimized)}
                className='flex items-center justify-center p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded transition-colors'
                title={cacheMinimized ? 'Expand cache notification' : 'Minimize cache notification'}
              >
                {cacheMinimized ? <ChevronDown className='h-4 w-4' /> : <Minimize2 className='h-4 w-4' />}
              </button>
              <button
                onClick={() => setCacheDismissed(true)}
                className='flex items-center justify-center p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded transition-colors'
                title='Dismiss cache notification'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issues Notification */}
      {showIssuesNotification && (
        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg'>
          <div className='flex items-center gap-3 p-3'>
            <AlertTriangle className='h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                Partial Data Load Warning
              </p>
              {!issuesMinimized && (
                <>
                  <p className='text-xs text-yellow-700 dark:text-yellow-300 mt-1'>
                    {totalIssues} out of {apiMetadata?.totalRequested} monitor requests were affected:{' '}
                    {hasFailures && `${apiMetadata?.failureCount} failed`}
                    {hasFailures && hasSkips && ', '}
                    {hasSkips && `${apiMetadata?.skippedCount} skipped to optimize performance`}. Some data
                    may be missing from the dashboard.
                  </p>
                  {hasSkips && (
                    <div className='flex items-center gap-2 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded'>
                      <Info className='h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0' />
                      <p className='text-xs text-blue-700 dark:text-blue-300'>
                        Skipped requests prevent excessive API calls when timestamp ranges consistently fail,
                        reducing load times.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className='flex items-center gap-1'>
              {!issuesMinimized && (
                <button
                  onClick={refreshMonitorData}
                  className='flex items-center gap-1 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-800/30 border border-yellow-300 dark:border-yellow-600 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700/30 transition-colors'
                >
                  <RefreshCw className='h-3 w-3' />
                  Retry
                </button>
              )}
              <button
                onClick={() => setIssuesMinimized(!issuesMinimized)}
                className='flex items-center justify-center p-1 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800/30 rounded transition-colors'
                title={issuesMinimized ? 'Expand issues notification' : 'Minimize issues notification'}
              >
                {issuesMinimized ? <ChevronDown className='h-4 w-4' /> : <Minimize2 className='h-4 w-4' />}
              </button>
              <button
                onClick={() => setIssuesDismissed(true)}
                className='flex items-center justify-center p-1 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800/30 rounded transition-colors'
                title='Dismiss issues notification'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
