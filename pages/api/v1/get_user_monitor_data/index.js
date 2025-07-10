import { timestampPairs } from '../../methods'
export const BATCH_URL_COUNT = 12
// Configuration for batching and retry logic
const BATCH_SIZE = 3 // Process 3 monitors at a time to avoid large payloads
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second base delay

/**
 * Fetches monitor data for a specific device with retry logic
 * @param {string} deviceId - The ID of the monitor/device
 * @param {string} timeRangeKey - Key to access start and end timestamps
 * @param {string} customer_id - Customer ID
 * @param {string} authToken - Authentication token
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Object>} The monitor data or error object
 */
async function fetchMonitorDataWithRetry(deviceId, timeRangeKey, customer_id, authToken, retryCount = 0) {
  const { startTimestamp, endTimestamp } = timestampPairs[timeRangeKey]
  const dateRange = `&start_date=${startTimestamp}&end_date=${endTimestamp}`
  const apiUrl = `https://www.alertsite.com/report-api/detail/${customer_id}?devices=${deviceId}${dateRange}&api_version=2&format=json`

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
    console.error(
      `Error fetching user monitor data for device ${deviceId} (attempt ${retryCount + 1}):`,
      error
    )

    // Retry logic with exponential backoff
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchMonitorDataWithRetry(deviceId, timeRangeKey, customer_id, authToken, retryCount + 1)
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
 * Process user monitors in batches to avoid overwhelming the API
 * @param {string[]} deviceIds - Array of device IDs to process
 * @param {string} timeRangeKey - Key to access start and end timestamps
 * @param {string} customer_id - Customer ID
 * @param {string} authToken - Authentication token
 * @returns {Promise<Object>} Object containing successful data and failed requests
 */
async function processBatchedUserMonitors(deviceIds, timeRangeKey, customer_id, authToken) {
  const results = {
    successfulData: [],
    failedRequests: [],
    totalRequested: deviceIds.length,
    successCount: 0,
    failureCount: 0,
  }

  // Process monitors in batches
  for (let i = 0; i < deviceIds.length; i += BATCH_SIZE) {
    const batch = deviceIds.slice(i, i + BATCH_SIZE)

    // Process current batch in parallel
    const batchPromises = batch.map((deviceId) =>
      fetchMonitorDataWithRetry(deviceId, timeRangeKey, customer_id, authToken)
    )

    const batchResults = await Promise.all(batchPromises)

    // Process batch results
    batchResults.forEach((result) => {
      if (result.success) {
        results.successfulData.push(...result.data)
        results.successCount++
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

// get_user_monitor_data | /api/v1/get_user_monitor_data
export default async function handler(req, res) {
  // Extract query parameters
  const { device_array, email, password, customer_id, timestampindex: timeRangeKey } = req.query

  // Validate required parameters
  if (!device_array || !email || !password || !customer_id) {
    return res.status(400).json({
      error: 'Missing required parameters',
      message: 'Please provide device_array, email, password, and customer_id',
    })
  }

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
    // Parse password and create authentication token
    let parsedPassword = JSON.parse(password)
    let credentials = `${email}:${parsedPassword}`
    let encodedCredentials = Buffer.from(credentials).toString('base64')
    let authToken = `Basic ${encodedCredentials}`

    // Split device array and process in batches
    const deviceIds = device_array
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0)

    if (deviceIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid device array',
        message: 'Please provide a valid device_array parameter',
      })
    }

    const results = await processBatchedUserMonitors(deviceIds, timeRangeKey, customer_id, authToken)

    // Always return data, even if some requests failed
    const response = {
      data: results.successfulData,
      metadata: {
        totalRequested: results.totalRequested,
        successCount: results.successCount,
        failureCount: results.failureCount,
        timestamp: new Date().toISOString(),
        timeRangeKey: timeRangeKey,
        customer_id: customer_id,
      },
    }

    // Include failed requests info if any
    if (results.failedRequests.length > 0) {
      response.metadata.failedRequests = results.failedRequests
      console.warn(`${results.failureCount} out of ${results.totalRequested} user monitor requests failed`)
    }

    // Return partial success (200) if we have some data, otherwise 207 (Multi-Status)
    const statusCode = results.successCount > 0 ? 200 : 207
    res.status(statusCode).json(response)
  } catch (error) {
    console.error('Critical error in get_user_monitor_data:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'A critical error occurred while fetching user monitor data',
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
