import { MonitorDataShape } from '@/lib/types'
import moment from 'moment'

// Concatenate arrays and remove duplicates
function sortByDateStatus(a: MonitorDataShape, b: MonitorDataShape): number {
  const momentA = moment(a.dt_status, 'YYYY-MM-DD HH:mm:ss')
  const momentB = moment(b.dt_status, 'YYYY-MM-DD HH:mm:ss')
  return momentA.diff(momentB)
}

export function concatArraysSortByDateStatus(...arrays: MonitorDataShape[]): MonitorDataShape[] {
  const combinedArray = arrays.flat()
  return Array.from(combinedArray).sort(sortByDateStatus)
}

const RERENDER_THRESHOLD_MINUTES = 5

export function canRerenderData(lastRenderTime: string): boolean {
  const lastRenderTimestamp = moment(lastRenderTime)
  const currentTime = moment()
  const diffInMinutes = currentTime.diff(lastRenderTimestamp, 'minutes')

  return Math.abs(diffInMinutes) <= RERENDER_THRESHOLD_MINUTES
}
