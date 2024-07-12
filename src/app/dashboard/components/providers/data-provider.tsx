'use client'
import moment from 'moment'
import { useEffect, useState, createContext, useReducer, useRef } from 'react'
import { batch_urls } from '@/lib/constants'
type DataProviderProps = {
  children: React.ReactNode
}
type DataProviderState = {
  loading: true | false
  monitorData: any[]
  rerender: Function
  progress: number
}

type MonitorDataShape = {
  [key: string]: any
}

const initialState: DataProviderState = {
  loading: true,
  monitorData: [],
  rerender: () => {},
  progress: 0,
}
function concatArraysRemoveDuplicates(...arrays: any[]) {
  const combinedArray = [].concat(...arrays)
  const uniqueObjects = new Map()

  combinedArray.forEach((obj: any) => {
    const ctlDevlogValue = obj['ctl_devlog']
    if (!uniqueObjects.has(ctlDevlogValue)) {
      uniqueObjects.set(ctlDevlogValue, obj)
    }
  })

  return Array.from(uniqueObjects.values()).sort((a, b) => {
    const momentA = moment(a.dt_status, 'YYYY-MM-DD HH:mm:ss')
    const momentB = moment(b.dt_status, 'YYYY-MM-DD HH:mm:ss')
    return momentA.diff(momentB)
  })
}

export const DataProviderContext = createContext<DataProviderState>(initialState)
export function DataProvider({ children }: DataProviderProps) {
  const debounceTimer = useRef<number | null>(null)

  const [loadingState, setLoadingState] = useState<boolean>(true)
  const [monitorData, setMonitorData] = useState<any[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<Error | null>(null)
  const [count, setCount] = useState(undefined)

  function rerender() {
    getMonitorData()
  }

  async function getMonitorData() {
    setProgress(0)

    try {
      const promises = batch_urls.map(async (url, index) => {
        const resp = await fetch(url)
        const data = await resp.json()

        // Update progress after each fetch completes
        setProgress((currentProgress) => {
          const newProgress = currentProgress + (1 / batch_urls.length) * 100
          return Math.min(newProgress, 100) // Ensure progress doesn't exceed 100%
        })

        return data
      })
      const monitorData = await Promise.all(promises)

      const data = concatArraysRemoveDuplicates(...monitorData)
      setMonitorData(data)
      setLoadingState(false)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    if (debounceTimer.current !== null) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      getMonitorData()
    }, 5000) as unknown as number
    return () => {
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [loadingState, count])

  const value: DataProviderState = {
    loading: loadingState,
    monitorData: monitorData,
    rerender: rerender,
    progress: progress,
  }
  return <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>
}
