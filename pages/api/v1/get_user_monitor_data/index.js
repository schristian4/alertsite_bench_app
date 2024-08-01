import { timestampPairs } from '../../methods'

/**
 * Fetches monitor data for a specific device
 * @param {string} deviceId - The ID of the monitor/device
 * @param {string} timeRangeKey - Key to access start and end timestamps
 * @param {string} customer_id - Customer ID
 * @param {string} authToken - Authentication token
 * @returns {Promise<Response>} The fetch response
 */

async function fetchMonitorData(deviceId, timeRangeKey, customer_id, authToken) {
  const { startTimestamp, endTimestamp } = timestampPairs[timeRangeKey]
  const dateRange = `&start_date=${startTimestamp}&end_date=${endTimestamp}`
  // Format API URL
  const apiUrl = `${process.env.NEXT_PUBLIC_ALERT_URL}/${customer_id}?devices=${deviceId}${dateRange}&api_version=2&format=json`

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch monitor data: ${response.statusText}`)
    }

    return response
  } catch (error) {
    console.error('Error fetching monitor data:', error)
    throw error
  }
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

  try {
    // Parse password and create authentication token
    let parsedPassword = JSON.parse(password)
    let credentials = `${email}:${parsedPassword}`
    let encodedCredentials = Buffer.from(credentials).toString('base64')
    let authToken = `Basic ${encodedCredentials}`

    // Split device array and fetch data for each device
    const deviceIds = device_array.split(',')
    const monitorDataPromises = deviceIds.map((deviceId) =>
      fetchMonitorData(deviceId, timeRangeKey, customer_id, authToken).then((response) => response.json())
    )

    const monitorData = await Promise.all(monitorDataPromises)
    const flattenedData = await monitorData.flat(1)

    res.status(200).json(flattenedData)
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    })
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
}
