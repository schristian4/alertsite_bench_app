import moment from 'moment-timezone'

export const monitorIDs = [
  '613072',
  '606458',
  '613080',
  '610382',
  '613088',
  '610378',
  '613070',
  '613076',
  '610380',
]

export const batch_urls = [
  '/api/monitor_batch_0',
  // '/api/monitor_batch_1',
  // '/api/monitor_batch_2',
  // '/api/monitor_batch_3',
  // '/api/monitor_batch_4',
  // '/api/monitor_batch_5',
  // '/api/monitor_batch_6',
  // '/api/monitor_batch_7',
  // '/api/monitor_batch_8',
  // '/api/monitor_batch_9',
  // '/api/monitor_batch_10',
  // '/api/monitor_batch_11',
]

const plainText = `${process.env.NEXT_PUBLIC_ALERT_USERNAME}:${process.env.NEXT_PUBLIC_ALERT_PASSWORD}`
const BufferSession = Buffer.from(plainText).toString('base64')
export const bufferSessionOutput = `Basic ` + BufferSession

export function generate_batch_timestamp(startDifference) {
  let timestamps = []
  const currentTimestamp = moment().subtract(startDifference * 5, 'minutes')
  const endTimestamp = currentTimestamp.format('YYYY-MM-DD+hh:mm:ss')
  const startTimestamp = currentTimestamp
    .subtract(startDifference * 5 + 5, 'minutes')
    .format('YYYY-MM-DD+hh:mm:ss')
  timestamps.push({ startTimestamp, endTimestamp })
  return timestamps[0]
}

export function generateBackwardTimestampPairs(intervalMinutes, numberOfIntervals, offsetMinutes) {
  let timestamps = []
  //offset moment end by the offsetMinutes
  let momentEnd = moment().tz('America/New_York') // Current timestamp in Eastern Time
  momentEnd.subtract(offsetMinutes, 'minutes')

  for (let i = 0; i < numberOfIntervals; i++) {
    let endTimestamp = momentEnd.format('YYYY-MM-DD+HH:mm:ss')
    let startTimestamp = momentEnd.subtract(intervalMinutes, 'minutes').format('YYYY-MM-DD+HH:mm:ss')
    // Push to ensure the array is ordered from present to past
    timestamps.push({ startTimestamp, endTimestamp })
  }

  return timestamps
}

//Generate timestamp pairs for the last 45 minutes
const intervalMinutes = 5 // Interval of 5 minutes
const numberOfIntervals = 12 // Number of intervals
const offsetMinutes = 60 // Offset in minutes
const timestampPairs = generateBackwardTimestampPairs(intervalMinutes, numberOfIntervals, offsetMinutes)

export { timestampPairs }

// function generateTimestampPairs(startDateTime, intervalMinutes, numberOfIntervals) {
//   let timestamps = []
//   let momentStart = moment.tz(startDateTime, 'YYYY-MM-DD+HH:mm:ss', 'UTC')

//   for (let i = 0; i < numberOfIntervals; i++) {
//     let startTimestamp = momentStart.format('YYYY-MM-DD+HH:mm:ss')
//     let endTimestamp = momentStart.add(intervalMinutes, 'minutes').format('YYYY-MM-DD+HH:mm:ss')

//     timestamps.push({ startTimestamp, endTimestamp })
//   }

//   return timestamps
// }

// // Example usage:
// const startDateTime = '2024-01-29+00:00:00' // Starting datetime in UTC
// const intervalMinutes = 10 // Interval of 10 minutes
// const numberOfIntervals = 3 // Number of intervals

// const timestampPairs = generateTimestampPairs(startDateTime, intervalMinutes, numberOfIntervals)
