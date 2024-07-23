'use client'
import { batch_url_count } from '@/lib/constants'
import moment from 'moment'
import { createContext, useEffect, useState } from 'react'
type DataProviderProps = {
  children: React.ReactNode
}
export type DataProviderState = {
  loading: true | false
  monitorData: any[]
  rerender: Function
  progress: number
  errorStatus: boolean
  errorMessage: string
  errorStatusCode: number
}

const initialState: DataProviderState = {
  loading: true,
  monitorData: [],
  rerender: () => {},
  progress: 0,
  errorStatus: false,
  errorMessage: '',
  errorStatusCode: 0,
}

export const DataProviderContext = createContext<DataProviderState>(initialState)

export function DataProvider({ children }: DataProviderProps) {
  const [loadingState, setLoadingState] = useState<boolean>(true)
  const [monitorData, setMonitorData] = useState<any[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [errorStatus, setErrorStatus] = useState<boolean>(false)
  const [errorStatusCode, setErrorStatusCode] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>('')
  function rerender() {
    getMonitorData()
  }
  async function getMonitorData() {
    setProgress(0) // progress starts at 0 and increments to 100 for each batch
    setLoadingState(true) // Ensure loading state is set at the start
    setErrorStatus(false) // Reset error status
    setErrorMessage('') // Reset error message
    try {
      const promises = []
      for (let i = 0; i < batch_url_count; i++) {
        promises.push(
          fetch(`/api/monitor_batch?timestampIndex=${i}`)
            .then((resp) => {
              if (!resp.ok) {
                throw new Error(
                  `${resp.status} \n Oops! We failed to fetch from AlertSite. \n /api/monitor_batch?timestampIndex=${i}`
                )
                // throw new Error()
              }
              return resp.json()
            })
            .then((data) => {
              // Update progress after each fetch completes
              setProgress((currentProgress) => {
                const newProgress = currentProgress + (1 / batch_url_count) * 100
                return Math.min(newProgress, 100) // Ensure progress doesn't exceed 100%
              })
              return data
            })
            .catch((error) => {
              console.log(error)
              setErrorStatus(true)
              setErrorMessage(error.message)
              return null // Returning null to keep the array length consistent
            })
        )
      }

      const monitorData = await Promise.all(promises)
      const validData = monitorData.filter((data) => data !== null) // Filter out failed fetches
      const concatenatedData = concatArraysRemoveDuplicates(...validData)
      setMonitorData(concatenatedData)
      setLoadingState(false)
    } catch (error: any) {
      setErrorStatus(true)
      setLoadingState(false)
      console.error('Overall fetch error:', error)
    }
  }

  useEffect(() => {
    loadingState && getMonitorData()
  }, [loadingState])

  const value: DataProviderState = {
    loading: loadingState,
    monitorData: monitorData,
    rerender: rerender,
    progress: progress,
    errorStatus: errorStatus,
    errorMessage: errorMessage,
    errorStatusCode: errorStatusCode,
  }
  return <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>
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
