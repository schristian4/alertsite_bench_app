import { timestampPairs } from '../methods'
import { monitorIDs } from '@/lib/constants'

const plainText = `${process.env.NEXT_PUBLIC_ALERT_USERNAME}:${process.env.NEXT_PUBLIC_ALERT_PASSWORD}`
const BufferSession = Buffer.from(plainText).toString('base64')
const BufferText = `Basic ` + BufferSession

/* Method to get monitor data
  - id: monitor ID
  - timestampIndex index start | end: YYYY-MM-DD+hh:mm:ss
*/
async function get_monitor_data(id, timestampIndex) {
  // Get timestamps
  const { startTimestamp, endTimestamp } = timestampPairs[timestampIndex]
  let requestDate = `&start_date=${startTimestamp}&end_date=${endTimestamp}`
  const monitorURL = `${process.env.NEXT_PUBLIC_ALERT_URL}?devices=${id}${requestDate}&api_version=2&format=json`

  const getMonitorData = await fetch(monitorURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: BufferText,
    },
  })

  if (!getMonitorData.ok) {
    throw new Error('Get monitor data failed')
  }

  return getMonitorData
}

export default async function handler(req, res) {
  // Monitor Data Promise Generator
  const monitorDataPromises = monitorIDs.map((id) =>
    get_monitor_data(id, req.query.timestampIndex).then((data) => data.json())
  )
  const monitorData = await Promise.all(monitorDataPromises)

  const data = await monitorData.flat(1)
  res.status(200).json(data)
}

export const config = {
  api: {
    responseLimit: false,
  },
}
