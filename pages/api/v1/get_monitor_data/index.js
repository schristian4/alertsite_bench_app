import { timestampPairs } from '../../methods'
import { monitorIDs } from '@/lib/constants'

// Create authentication token
const credentials = `${process.env.NEXT_PUBLIC_ALERT_USERNAME}:${process.env.NEXT_PUBLIC_ALERT_PASSWORD}`
const encodedCredentials = Buffer.from(credentials).toString('base64')
const authToken = `Basic ${encodedCredentials}`

/**
 * Fetches monitor data for a specific device
 * @param {string} deviceId - The ID of the monitor/device
 * @param {string} timeRangeKey - Key to access start and end timestamps
 * @returns {Promise<Response>} The fetch response
 */
async function fetchMonitorData(deviceId, timeRangeKey) {
  const { startTimestamp, endTimestamp } = timestampPairs[timeRangeKey]
  const dateRange = `&start_date=${startTimestamp}&end_date=${endTimestamp}`

  const apiUrl = `https://www.alertsite.com/report-api/detail/C134490?devices=${deviceId}${dateRange}&api_version=2&format=json`

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

// get_monitor_data | /api/v1/get_monitor_data
export default async function handler(req, res) {
  const { timestampindex: timeRangeKey } = req.query

  if (timeRangeKey === undefined) {
    return res.status(400).json({
      error: 'Missing timeRangeKey',
      message: 'Please provide a valid timestampindex parameter',
    })
  }

  try {
    const monitorDataPromises = monitorIDs.map((deviceId) =>
      fetchMonitorData(deviceId, timeRangeKey).then((response) => response.json())
    )

    const monitorData = await Promise.all(monitorDataPromises)
    const flattenedData = monitorData.flat(1)

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
