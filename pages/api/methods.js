import moment from 'moment-timezone'
import { BATCH_URL_COUNT } from '@/lib/constants'

// Generate Start and End Timestamps
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

// Generate timestamp pairs for the last 50 minutes
const intervalMinutes = 10 // ----------------- Interval of 5 minutes
const numberOfIntervals = BATCH_URL_COUNT //-- Number of intervals
const offsetMinutes = 60 // ------------------ Offset in minutes
const timestampPairs = generateBackwardTimestampPairs(intervalMinutes, numberOfIntervals, offsetMinutes)

export { timestampPairs }
