'use client'
import moment from 'moment'
import { useEffect, useState, createContext, useReducer, useRef } from 'react'

type DataProviderProps = {
  children: React.ReactNode
}
type DataProviderState = {
  loading: true | false
  monitorData: any[]
  lastUpdated: string
  rerender: Function
}

type MonitorDataShape = {
  [key: string]: any
}

const initialState: DataProviderState = {
  loading: true,
  monitorData: [],
  lastUpdated: '',
  rerender: () => {},
}
export const DataProviderContext = createContext<DataProviderState>(initialState)
export function DataProvider({ children }: DataProviderProps) {
  const debounceTimer = useRef<number | null>(null)

  const [loadingState, setLoadingState] = useState<boolean>(true)
  const [monitorData, setMonitorData] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('none')
  const [error, setError] = useState<Error | null>(null)
  const [count, setCount] = useState(undefined)

  function rerender() {
    getMonitorData()
  }

  async function getMonitorData() {
    console.log('GET MONITOR DATA')
    fetch('/api/dashboard') // Adjust the URL as needed
      .then((response) => response.json())
      .then((data) => {
        setMonitorData(data)
        setLastUpdated(moment().format('MMMM Do YYYY, h:mm:ss a'))
        setLoadingState(false)
      })
      .catch((error) => {
        console.error('Fetch error:', error)
        setError(error)
      })
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
    lastUpdated: lastUpdated,
    rerender: rerender,
  }
  return <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>
}
