import { generate_batch_timestamp, timestampPairs } from '../methods'
const monitorIDs = ['613072', '606458', '613080', '610382', '613088', '610378', '613070', '613076', '610380']

const plainText = `${process.env.NEXT_PUBLIC_ALERT_USERNAME}:${process.env.NEXT_PUBLIC_ALERT_PASSWORD}`
const BufferSession = Buffer.from(plainText).toString('base64')
const BufferText = `Basic ` + BufferSession

async function get_monitor_data(id, rdate) {
  const { startTimestamp, endTimestamp } = timestampPairs[2]

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

  return await getMonitorData
}

export default async function handler(req, res) {
  const monitorDataPromises = monitorIDs.map((id) =>
    get_monitor_data(id, 'LastOneHour').then((data) => data.json())
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
