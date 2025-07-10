'use client'

import moment, { Moment } from 'moment'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { debounce } from 'lodash'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { BATCH_URL_COUNT } from '@/lib/constants'
import { MonitorDataShape, ApiMetadata } from '@/lib/types'
import { canRerenderData, concatArraysSortByDateStatus, CacheManager } from './reduxMethods'

// Create the monitor data slice
const createMonitorDataSlice: StateCreator<MonitorDataState> = (set, get) => ({
  monitorData: [],
  isLoading: false, // Start as false, will be set to true when fetch begins
  loadingProgress: 0,
  error: {
    hasError: false,
    message: '',
    statusCode: 0,
  },
  lastFetchTimestamp: '', // Empty string indicates no previous fetch
  apiMetadata: null,
  cacheStatus: {
    isFromCache: false,
    cacheAge: 0,
    isUpdating: false,
  },
  refreshMonitorData: () => {
    get().getMonitorData()
  },
  clearCache: () => {
    CacheManager.clearCache()
    set({
      cacheStatus: {
        isFromCache: false,
        cacheAge: 0,
        isUpdating: false,
      },
    })
  },
  getMonitorData: async () => {
    // Prevent concurrent calls
    if (get().isLoading) {
      console.log('Already loading, skipping duplicate call')
      return
    }

    // Step 1: Try to load from cache first for instant UI
    const cachedData = CacheManager.loadFromCache()

    if (cachedData) {
      const cacheAge = CacheManager.getCacheAge(cachedData.timestamp)
      console.log(`Loading cached data (${cacheAge} minutes old)`)

      // Load cached data immediately
      set({
        monitorData: cachedData.monitorData,
        apiMetadata: cachedData.apiMetadata,
        lastFetchTimestamp: cachedData.timestamp,
        isLoading: false,
        loadingProgress: 100,
        cacheStatus: {
          isFromCache: true,
          cacheAge,
          isUpdating: false,
        },
        error: { hasError: false, message: '', statusCode: 0 },
      })

      // Check if cache is still fresh (< 15 minutes)
      if (CacheManager.isCacheFresh(cachedData.timestamp)) {
        console.log('Cache is fresh, no need to fetch')
        return
      }

      // Cache is stale, update in background
      console.log('Cache is stale, fetching fresh data in background')
      set((state) => ({
        cacheStatus: {
          ...state.cacheStatus,
          isUpdating: true,
        },
      }))
    } else {
      // No cache available, show loading state
      console.log('No cached data, fetching fresh data')
      set({
        isLoading: true,
        loadingProgress: 0,
        apiMetadata: null,
        cacheStatus: {
          isFromCache: false,
          cacheAge: 0,
          isUpdating: false,
        },
        error: { hasError: false, message: '', statusCode: 0 },
      })
    }

    // Step 2: Fetch fresh data from API

    try {
      const promises = Array.from({ length: BATCH_URL_COUNT }, (_, i) =>
        fetch(`/api/v1/get_monitor_data?timestampindex=${i}`)
          .then(async (resp) => {
            if (!resp.ok) {
              console.log('error', resp)
              throw new Error(`Oops! We failed to fetch from AlertSite`)
            }
            return resp.json()
          })
          .then((responseData) => {
            set((state) => ({
              loadingProgress: Math.min(state.loadingProgress + (1 / BATCH_URL_COUNT) * 100, 95), // Cap at 95% to leave room for processing
            }))
            // Handle new API response format
            return responseData
          })
      )

      const results = await Promise.all(promises)
      const validResults = results.filter(
        (result) => result && (result.data || (Array.isArray(result) && result.length > 0))
      )

      // Extract data and metadata from API responses
      const allData = []
      const allMetadata = []

      for (const result of validResults) {
        if (result.data) {
          // New API format with metadata
          allData.push(...result.data)
          allMetadata.push(result.metadata)
        } else if (Array.isArray(result)) {
          // Legacy format
          allData.push(...result)
        }
      }

      const concatenatedData = concatArraysSortByDateStatus(...allData)

      if (concatenatedData.length === 0) {
        throw new Error('No data found')
      }

      // Aggregate metadata for user feedback
      const aggregatedMetadata =
        allMetadata.length > 0
          ? {
              totalRequested: allMetadata.reduce((sum, meta) => sum + meta.totalRequested, 0),
              successCount: allMetadata.reduce((sum, meta) => sum + meta.successCount, 0),
              failureCount: allMetadata.reduce((sum, meta) => sum + meta.failureCount, 0),
              skippedCount: allMetadata.reduce((sum, meta) => sum + (meta.skippedCount || 0), 0),
              timestamp: new Date().toISOString(),
              timeRangeKey: 'aggregated',
              failedRequests: allMetadata.flatMap((meta) => meta.failedRequests || []),
              skippedRequests: allMetadata.flatMap((meta) => meta.skippedRequests || []),
            }
          : null

      const currentTimestamp = moment().format('YYYY-MM-DD HH:mm:ss')

      // Save fresh data to cache
      CacheManager.saveToCache(concatenatedData, aggregatedMetadata)

      set({
        monitorData: concatenatedData,
        isLoading: false,
        loadingProgress: 100, // Set to 100% only when completely done
        lastFetchTimestamp: currentTimestamp,
        apiMetadata: aggregatedMetadata,
        cacheStatus: {
          isFromCache: false,
          cacheAge: 0,
          isUpdating: false,
        },
      })

      // Log warnings for partial failures and skipped requests
      if (
        aggregatedMetadata &&
        (aggregatedMetadata.failureCount > 0 || aggregatedMetadata.skippedCount > 0)
      ) {
        const messages = []

        if (aggregatedMetadata.failureCount > 0) {
          messages.push(`${aggregatedMetadata.failureCount} requests failed`)
        }

        if (aggregatedMetadata.skippedCount > 0) {
          messages.push(`${aggregatedMetadata.skippedCount} requests skipped due to consistent errors`)
        }

        console.warn(
          `Some monitor data was not loaded: ${messages.join(', ')} out of ${
            aggregatedMetadata.totalRequested
          } total requests`
        )

        // Log detailed information about skipped requests
        if (aggregatedMetadata.skippedCount > 0) {
          console.info(
            `Skipped requests help reduce unnecessary API calls when timestamp ranges consistently fail`
          )
        }
      }
    } catch (error: any) {
      console.error('Error fetching monitor data:', error)
      // On error, preserve cached data if available
      const currentState = get()
      const hasValidCache = currentState.cacheStatus.isFromCache && currentState.monitorData.length > 0

      set({
        error: {
          hasError: true,
          statusCode: error instanceof Error ? 500 : error.status,
          message: error instanceof Error ? error.message : 'An unknown error occurred',
        },
        isLoading: false,
        loadingProgress: hasValidCache ? 100 : 0, // Keep progress if we have cached data
        apiMetadata: hasValidCache ? currentState.apiMetadata : null,
        cacheStatus: {
          ...currentState.cacheStatus,
          isUpdating: false, // Stop updating indicator
        },
      })
    }
  },
})

// Create the login slice
const createLoginSlice: StateCreator<LoginStoreStates> = (set, get) => ({
  // Login States
  loginStatus: false,
  loginLoading: false,
  loginDataProgress: 0,

  // Selected Device List States
  selectedDeviceList: [],
  handleSelectedDeviceList: (selectedDeviceList: string[]) => {
    get().fetchMonitorData(selectedDeviceList)
    set({ selectedDeviceList })
  },

  //User Input States
  userDeviceList: [],
  userInput: {
    email: '',
    password: '',
    customerNum: '',
  },

  // Debounced User Input Handler
  handleUserInput: debounce((e: any) => {
    const name = e.target.id
    const value = e.target.value
    set((state) => ({
      userInput: {
        ...state.userInput,
        [name]: value,
      },
    }))
  }, 300),

  // Login Fetch Monitor States
  isFetchError: false,
  isLoginFetchMonitorLoading: false,
  loginFetchMonitorProgress: 0,
  loginMonitorData: [],

  // Login Error States
  loginErrorStatus: false,
  loginErrorMessage: '',
  loginErrorStatusCode: 0,

  // Toggle Rerender - Reset Login States
  loginRerender: () => {
    set({ loginDataProgress: 0, loginErrorStatus: false, loginErrorMessage: '', loginErrorStatusCode: 0 })
  },
  // Logout User
  LogoutUser: () => {
    set({
      loginStatus: false,
      userDeviceList: [],
      loginMonitorData: [],
      userInput: { email: '', password: '', customerNum: '' },
      isFetchError: false,
      loginErrorStatus: false,
      loginErrorStatusCode: 0,
      loginErrorMessage: '',
    })
  },
  // Login User
  LoginUserSubmit: async () => {
    set({ loginLoading: true })
    const { email, password, customerNum } = get().userInput
    try {
      const response = await fetch(
        `/api/v1/user_devices?customerID=${encodeURIComponent(customerNum)}&email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(JSON.stringify(password))}`
      )
      if (!response.ok) {
        throw new Error(`${response.status} \n Oops! We failed to fetch AlertSite monitors`)
      }
      const data = await response.json()
      // Map the monitor data to a device list
      //TODO: filter by monitor["monitor"] === "y"
      const deviceList = data.map((monitor: any) => ({
        id: monitor['obj_device'],
        name: monitor['device_name'],
      }))
      set({
        userDeviceList: deviceList,
        loginLoading: false,
        loginStatus: true,
        loginErrorStatus: false,
        loginErrorStatusCode: 0,
        loginErrorMessage: '',
      })
    } catch (error: any) {
      console.error('Login User Error - @LoginUserSubmit:', error)
      set({
        isFetchError: false,
        loginErrorStatus: true,
        loginErrorStatusCode: error.status,
        loginErrorMessage: error.message,
        loginLoading: false,
        loginStatus: false,
      })
    }
  },
  fetchMonitorData: async (selectedDeviceList: string[]) => {
    set({
      isFetchError: false,
      loginErrorStatus: false,
      isLoginFetchMonitorLoading: true,
      loginFetchMonitorProgress: 0,
      loginLoading: true,
    })
    const { email, password, customerNum } = get().userInput
    try {
      const promises = Array.from({ length: 6 }, (_, i) =>
        fetch(
          `/api/v1/get_user_monitor_data?timestampindex=${i}&email=${encodeURIComponent(
            email
          )}&customer_id=${encodeURIComponent(customerNum)}&password=${encodeURIComponent(
            JSON.stringify(password)
          )}&device_array=${selectedDeviceList}`
        )
          .then(async (resp) => {
            if (!resp.ok) {
              throw new Error(
                ` Oops! We failed to fetch from AlertSite \n HTTP error! status: ${resp.status}`
              )
            }
            return resp.json()
          })
          .then((responseData) => {
            set((state) => ({
              loginFetchMonitorProgress: Math.min(state.loginFetchMonitorProgress + (1 / 6) * 100, 100),
            }))
            // Handle new API response format
            return responseData.data || responseData
          })
      )

      // Wait for all promises to resolve
      const results = await Promise.all(promises)
      const validResults = results.filter((result) => result && result.length > 0)
      const concatenatedData = concatArraysSortByDateStatus(...validResults)

      if (concatenatedData.length === 0) {
        throw new Error('No data found')
      }
      set({
        loginMonitorData: concatenatedData,
        loginLoading: false,
        isLoginFetchMonitorLoading: false,
        isFetchError: false,
        loginErrorStatus: false,
        loginErrorStatusCode: 0,
        loginErrorMessage: '',
      })
    } catch (error: any) {
      console.error('Fetch Monitor Error - @fetchMonitorData:', error)
      set({
        loginLoading: false,
        isLoginFetchMonitorLoading: false,
        isFetchError: true,
        loginErrorStatus: false,
        loginErrorStatusCode: error.status,
        loginErrorMessage: error.message,
      })
    }
  },
})

// Create the location select slice
const createLocationSelectSlice: StateCreator<LocationSelectState> = (set, get) => ({
  // Selected Location
  selectedLocation: '20',
  setSelectedLocation: (value: string) => {
    set({ selectedLocation: value })
  },
  // Available Locations
  availableLocations: [],
  setAvailableLocations: (value: string[]) => {
    set({ availableLocations: value })
  },
  // User Selected Location
  userSelectedLocation: '-', // Default location
  setUserSelectedLocation: (value: string) => {
    set({ userSelectedLocation: value })
  },
})

// Create the store
export const useDataStore = create<DataStoreState>((...a) => ({
  ...createMonitorDataSlice(...a),
  ...createLoginSlice(...a),
  ...createLocationSelectSlice(...a),
}))

// Define the store interface
export interface DataStoreState extends MonitorDataState, LoginStoreStates, LocationSelectState {}

// Define the monitor data state interface
interface MonitorDataState {
  monitorData: MonitorDataShape[] // Replace 'any' with a more specific type
  isLoading: boolean
  loadingProgress: number
  error: {
    hasError: boolean
    message: string
    statusCode: number
  }
  lastFetchTimestamp: string
  apiMetadata: ApiMetadata | null
  cacheStatus: {
    isFromCache: boolean
    cacheAge: number
    isUpdating: boolean
  }
  refreshMonitorData: () => void
  getMonitorData: () => Promise<void>
  clearCache: () => void
}

// Define the device state interface
type DeviceStates = {
  id: string
  name: string
}

// Define the login store interface
interface LoginStoreStates {
  loginStatus: boolean
  loginLoading: boolean
  loginDataProgress: number
  selectedDeviceList: string[] | []
  handleSelectedDeviceList: (selectedDeviceList: string[]) => void
  userDeviceList: DeviceStates[]
  userInput: {
    email: string
    password: string
    customerNum: string
  }
  handleUserInput: (e: any) => void // Debounced function
  isFetchError: boolean
  isLoginFetchMonitorLoading: boolean
  loginFetchMonitorProgress: number
  loginMonitorData: MonitorDataShape[]
  loginErrorStatus: boolean
  loginErrorMessage: string
  loginErrorStatusCode: number
  loginRerender: Function
  LogoutUser: () => void
  LoginUserSubmit: () => void
  fetchMonitorData: (selectedDeviceList: string[]) => void
}

// Define the location select state interface
interface LocationSelectState {
  selectedLocation: string
  setSelectedLocation: (value: string) => void
  availableLocations: string[]
  setAvailableLocations: (value: string[]) => void
  userSelectedLocation: string
  setUserSelectedLocation: (value: string) => void
}
// Subscribe to the useDataStore looking for changes in the loginMonitorData
useDataStore.subscribe((state) => {
  if (state.loginMonitorData.length > 0 && state.userSelectedLocation === '-') {
    state.userSelectedLocation = state.loginMonitorData[0].obj_location
  }
})
