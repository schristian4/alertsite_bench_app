import { MonitorDataShape, ApiMetadata } from '@/lib/types'
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

export const RERENDER_THRESHOLD_MINUTES = 15

export function canRerenderData(lastRenderTime: string): boolean {
  // If no previous render time, always allow rendering
  if (!lastRenderTime || lastRenderTime === '') {
    console.log('No previous render time, allowing rerender')
    return true
  }

  const lastRenderTimestamp = moment(lastRenderTime)
  const currentTime = moment()
  const diffInMinutes = currentTime.diff(lastRenderTimestamp, 'minutes')
  const canRerender = Math.abs(diffInMinutes) >= RERENDER_THRESHOLD_MINUTES

  console.log('Time since last render:', diffInMinutes, 'minutes, can rerender:', canRerender)

  return canRerender
}

// Cache management utilities
interface CachedData {
  monitorData: MonitorDataShape[]
  apiMetadata: ApiMetadata | null
  timestamp: string
  cacheVersion: string
}

const CACHE_KEY = 'alertsite-monitor-data'
const CACHE_VERSION = '1.0'

export const CacheManager = {
  // Save data to browser cache
  saveToCache(monitorData: MonitorDataShape[], apiMetadata: ApiMetadata | null): void {
    try {
      const cacheData: CachedData = {
        monitorData,
        apiMetadata,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        cacheVersion: CACHE_VERSION,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
      console.log('Data cached successfully at', cacheData.timestamp)
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  },

  // Load data from browser cache
  loadFromCache(): CachedData | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const cacheData: CachedData = JSON.parse(cached)

      // Check cache version compatibility
      if (cacheData.cacheVersion !== CACHE_VERSION) {
        console.log('Cache version mismatch, clearing old cache')
        this.clearCache()
        return null
      }

      console.log('Loaded cached data from', cacheData.timestamp)
      return cacheData
    } catch (error) {
      console.warn('Failed to load cached data:', error)
      this.clearCache()
      return null
    }
  },

  // Check if cached data is still fresh (within threshold)
  isCacheFresh(cacheTimestamp: string): boolean {
    return !canRerenderData(cacheTimestamp)
  },

  // Clear browser cache
  clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY)
      console.log('Cache cleared')
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  },

  // Get cache age in minutes
  getCacheAge(cacheTimestamp: string): number {
    const cacheTime = moment(cacheTimestamp)
    const currentTime = moment()
    return currentTime.diff(cacheTime, 'minutes')
  },
}
