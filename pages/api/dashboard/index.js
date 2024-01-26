import moment from 'moment'
const monitorIDs = ['613072', '606458', '613080', '610382', '613088', '610378', '613070', '613076', '610380']

const plainText = `${process.env.NEXT_PUBLIC_ALERT_USERNAME}:${process.env.NEXT_PUBLIC_ALERT_PASSWORD}`
const BufferSession = Buffer.from(plainText).toString('base64')
const BufferText = `Basic ` + BufferSession

// https://www.alertsite.com/report-api/detail/C99999?devices=76981,94332&start_date=2013-01-20+00:00:00&end_date=2013-01-22+23:59:59&api_version=2&format=json
const now = moment()
const newNow = now.subtract(5, 'minutes')
const formattedTime = newNow.format('YYYY-MM-DD+hh:mm:ss')
const newTime = now.subtract(5, 'minutes')
const formattedNewTime = newTime.format('YYYY-MM-DD+hh:mm:ss')
// console.log('first', first)
let newDate = `&start_date=${formattedNewTime}&end_date=${formattedTime}`
console.log('formatedDateRange:', newDate)
async function get_monitor_data(id, rdate) {
  // &rdate=${rdate}
  const monitorURL = `${process.env.NEXT_PUBLIC_ALERT_URL}?devices=${id}${newDate}&api_version=2&format=json`
  console.log('monitorURL', monitorURL)
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

  return await getMonitorData.json()
}

export default async function handler(req, res) {
  const monitorDataPromises = monitorIDs.map((id) => get_monitor_data(id, 'LastOneHour'))
  const monitorData = await Promise.all(monitorDataPromises)

  const data = await monitorData.flat(1)
  res.status(200).json(data)
}

export const config = {
  api: {
    responseLimit: false,
  },
}
