import { timestampPairs } from '../../methods'
import { monitorIDs } from '@/lib/constants'

// Create authentication token
const credentials = `${process.env.NEXT_PUBLIC_ALERT_USERNAME}:${process.env.NEXT_PUBLIC_ALERT_PASSWORD}`
const encodedCredentials = Buffer.from(credentials).toString('base64')
const authToken = `Basic ${encodedCredentials}`

// Configuration for batching and retry logic
const BATCH_SIZE = 3 // Process 3 monitors at a time to avoid large payloads
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second base delay

// Track timestamp-level errors to prevent excessive retries
const timestampErrorTracker = new Map()

/**
 * Checks if a timestamp range should be skipped due to consistent errors
 * @param {string} timeRangeKey - The timestamp range key
 * @param {string} errorType - The type of error encountered
 * @returns {boolean} Whether to skip this timestamp range
 */
function shouldSkipTimestampRange(timeRangeKey, errorType) {
  const key = `${timeRangeKey}`
  const errorInfo = timestampErrorTracker.get(key) || { count: 0, errorType: null, firstError: null }

  // If this is the first error for this timestamp, track it
  if (errorInfo.count === 0) {
    timestampErrorTracker.set(key, {
      count: 1,
      errorType,
      firstError: errorType,
    })
    return false
  }

  // If the same error type occurs again, increment count
  if (errorInfo.errorType === errorType || errorInfo.firstError === errorType) {
    errorInfo.count++
    timestampErrorTracker.set(key, errorInfo)

    // Skip if we've seen this error type 2 or more times for this timestamp
    if (errorInfo.count >= 2) {
      console.warn(
        `Skipping timestamp range ${timeRangeKey} due to consistent ${errorType} errors (${errorInfo.count} occurrences)`
      )
      return true
    }
  }

  return false
}

/**
 * Extracts error type from error message for categorization
 * @param {string} errorMessage - The error message
 * @returns {string} Categorized error type
 */
function getErrorType(errorMessage) {
  if (
    errorMessage.includes('HTTP 400') ||
    errorMessage.includes('HTTP 401') ||
    errorMessage.includes('HTTP 403')
  ) {
    return 'AUTH_ERROR'
  }
  if (errorMessage.includes('HTTP 404')) {
    return 'NOT_FOUND'
  }
  if (
    errorMessage.includes('HTTP 500') ||
    errorMessage.includes('HTTP 502') ||
    errorMessage.includes('HTTP 503')
  ) {
    return 'SERVER_ERROR'
  }
  if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
    return 'TIMEOUT'
  }
  if (errorMessage.includes('network') || errorMessage.includes('NETWORK')) {
    return 'NETWORK_ERROR'
  }
  return 'UNKNOWN_ERROR'
}

/**
 * Fetches monitor data for a specific device with retry logic
 * @param {string} deviceId - The ID of the monitor/device
 * @param {string} timeRangeKey - Key to access start and end timestamps
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Object>} The monitor data or error object
 */
async function fetchMonitorDataWithRetry(deviceId, timeRangeKey, retryCount = 0) {
  const { startTimestamp, endTimestamp } = timestampPairs[timeRangeKey]

  // Check if we should skip this timestamp range due to previous errors
  if (retryCount === 0) {
    const errorInfo = timestampErrorTracker.get(timeRangeKey)
    if (errorInfo && errorInfo.count >= 2) {
      console.warn(`Skipping device ${deviceId} for timestamp range ${timeRangeKey} due to consistent errors`)
      return {
        success: false,
        error: `Timestamp range ${timeRangeKey} skipped due to consistent errors`,
        deviceId,
        retryCount: 0,
        skipped: true,
      }
    }
  }

  const dateRange = `&start_date=${startTimestamp}&end_date=${endTimestamp}`
  const apiUrl = `https://www.alertsite.com/report-api/detail/C134490?devices=${deviceId}${dateRange}&api_version=2&format=json`

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
      timeout: 30000, // 30 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data, deviceId }
  } catch (error) {
    console.error(`Error fetching monitor data for device ${deviceId} (attempt ${retryCount + 1}):`, error)

    const errorType = getErrorType(error.message)

    // Check if this timestamp range should be skipped due to consistent errors
    if (shouldSkipTimestampRange(timeRangeKey, errorType)) {
      return {
        success: false,
        error: `Timestamp range ${timeRangeKey} failed consistently with ${errorType}`,
        deviceId,
        retryCount: retryCount + 1,
        skipped: true,
      }
    }

    // Retry logic with exponential backoff
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchMonitorDataWithRetry(deviceId, timeRangeKey, retryCount + 1)
    }

    // Return error object instead of throwing
    return {
      success: false,
      error: error.message,
      deviceId,
      retryCount: retryCount + 1,
    }
  }
}

/**
 * Process monitors in batches to avoid overwhelming the API
 * @param {string[]} deviceIds - Array of device IDs to process
 * @param {string} timeRangeKey - Key to access start and end timestamps
 * @returns {Promise<Object>} Object containing successful data and failed requests
 */
async function processBatchedMonitors(deviceIds, timeRangeKey) {
  const results = {
    successfulData: [],
    failedRequests: [],
    skippedRequests: [],
    totalRequested: deviceIds.length,
    successCount: 0,
    failureCount: 0,
    skippedCount: 0,
  }

  // Early termination: if timestamp range is already marked as problematic, skip all remaining monitors
  const errorInfo = timestampErrorTracker.get(timeRangeKey)
  if (errorInfo && errorInfo.count >= 2) {
    console.warn(`Skipping all monitors for timestamp range ${timeRangeKey} due to consistent errors`)
    deviceIds.forEach((deviceId) => {
      results.skippedRequests.push({
        deviceId,
        error: `Timestamp range ${timeRangeKey} skipped due to consistent errors`,
        reason: 'Timestamp range pre-marked as problematic',
      })
      results.skippedCount++
    })
    return results
  }

  // Process monitors in batches
  for (let i = 0; i < deviceIds.length; i += BATCH_SIZE) {
    const batch = deviceIds.slice(i, i + BATCH_SIZE)

    // Check if timestamp range has become problematic during processing
    const currentErrorInfo = timestampErrorTracker.get(timeRangeKey)
    if (currentErrorInfo && currentErrorInfo.count >= 2) {
      console.warn(`Stopping batch processing for timestamp range ${timeRangeKey} due to consistent errors`)
      // Mark remaining devices as skipped
      const remainingDevices = deviceIds.slice(i)
      remainingDevices.forEach((deviceId) => {
        results.skippedRequests.push({
          deviceId,
          error: `Timestamp range ${timeRangeKey} skipped due to consistent errors`,
          reason: 'Timestamp range marked as problematic during batch processing',
        })
        results.skippedCount++
      })
      break
    }

    // Process current batch in parallel
    const batchPromises = batch.map((deviceId) => fetchMonitorDataWithRetry(deviceId, timeRangeKey))

    const batchResults = await Promise.all(batchPromises)

    // Process batch results
    batchResults.forEach((result) => {
      if (result.success) {
        results.successfulData.push(...result.data)
        results.successCount++
      } else if (result.skipped) {
        results.skippedRequests.push({
          deviceId: result.deviceId,
          error: result.error,
          reason: 'Timestamp range skipped due to consistent errors',
        })
        results.skippedCount++
      } else {
        results.failedRequests.push({
          deviceId: result.deviceId,
          error: result.error,
          retryCount: result.retryCount,
        })
        results.failureCount++
      }
    })

    // Add small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < deviceIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return results
}

// get_monitor_data | /api/v1/get_monitor_data
export default async function handler(req, res) {
  const { timestampindex: timeRangeKey } = req.query

  if (timeRangeKey === undefined) {
    return res.status(400).json({
      error: 'Missing timeRangeKey',
      message: 'Please provide a valid timestampindex parameter',
    })
  }

  if (!timestampPairs[timeRangeKey]) {
    return res.status(400).json({
      error: 'Invalid timeRangeKey',
      message: `timestampindex must be between 0 and ${timestampPairs.length - 1}`,
    })
  }

  try {
    // Clear error tracker at the beginning of each API call to prevent state carry-over
    timestampErrorTracker.clear()

    console.log(
      `Starting monitor data fetch for timestamp range ${timeRangeKey} with ${monitorIDs.length} monitors`
    )

    const results = await processBatchedMonitors(monitorIDs, timeRangeKey)

    // Always return data, even if some requests failed
    const response = {
      data: results.successfulData,
      metadata: {
        totalRequested: results.totalRequested,
        successCount: results.successCount,
        failureCount: results.failureCount,
        skippedCount: results.skippedCount,
        timestamp: new Date().toISOString(),
        timeRangeKey: timeRangeKey,
      },
    }

    // Include failed requests info if any
    if (results.failedRequests.length > 0) {
      response.metadata.failedRequests = results.failedRequests
      console.warn(`${results.failureCount} out of ${results.totalRequested} monitor requests failed`)
    }

    // Include skipped requests info if any
    if (results.skippedRequests.length > 0) {
      response.metadata.skippedRequests = results.skippedRequests
      console.warn(
        `${results.skippedCount} out of ${results.totalRequested} monitor requests skipped due to consistent errors`
      )
    }

    // Log summary
    console.log(
      `Monitor data fetch completed: ${results.successCount} successful, ${results.failureCount} failed, ${results.skippedCount} skipped`
    )

    // Return partial success (200) if we have some data, otherwise 207 (Multi-Status)
    const statusCode = results.successCount > 0 ? 200 : 207
    res.status(statusCode).json(response)
  } catch (error) {
    console.error('Critical error in get_monitor_data:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'A critical error occurred while fetching monitor data',
      details: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

export const config = {
  api: {
    responseLimit: false,
    externalResolver: true,
  },
}
