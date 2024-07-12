import moment from 'moment-timezone'

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
const numberOfIntervals = 10 // Number of intervals
const offsetMinutes = 60 // Offset in minutes
const timestampPairs = generateBackwardTimestampPairs(intervalMinutes, numberOfIntervals, offsetMinutes)

export { timestampPairs }
