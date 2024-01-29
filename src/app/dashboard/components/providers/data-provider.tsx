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

const batch_urls: string[] = [
  '/api/monitor_batch_0',
  '/api/monitor_batch_1',
  '/api/monitor_batch_2',
  '/api/monitor_batch_3',
  '/api/monitor_batch_4',
  '/api/monitor_batch_5',
]
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
    // var promises = batch_urls.map((url) => fetch(url))

    const monitorData = await Promise.all(
      batch_urls.map(async (url) => {
        const resp = await fetch(url)
        return resp.json()
      })
    )

    const data = concatArraysRemoveDuplicates(...monitorData)
    setMonitorData(data)
    setLastUpdated(moment().format('MMMM Do YYYY, h:mm:ss a'))
    setLoadingState(false)
    // fetch('/api/monitor_batch_1') // Adjust the URL as needed
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setMonitorData(data)
    //     setLastUpdated(moment().format('MMMM Do YYYY, h:mm:ss a'))
    //     setLoadingState(false)
    //   })
    //   .catch((error) => {
    //     console.error('Fetch error:', error)
    //     setError(error)
    //   })
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
