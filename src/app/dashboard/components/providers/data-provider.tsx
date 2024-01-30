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
}

type MonitorDataShape = {
  [key: string]: any
}

const initialState: DataProviderState = {
  loading: true,
  monitorData: [],
  rerender: () => {},
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
  const [error, setError] = useState<Error | null>(null)
  const [count, setCount] = useState(undefined)

  function rerender() {
    getMonitorData()
  }

  async function getMonitorData() {
    try {
      const monitorData = await Promise.all(
        batch_urls.map(async (url) => {
          const resp = await fetch(url)
          return resp.json()
        })
      )
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
  }
  return <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>
}
