'use client'

import moment, { Moment } from 'moment'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { debounce } from 'lodash'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { BATCH_URL_COUNT } from '@/lib/constants'
import { MonitorDataShape } from '@/lib/types'
import { canRerenderData, concatArraysSortByDateStatus } from './reduxMethods'

// Create the monitor data slice
const createMonitorDataSlice: StateCreator<MonitorDataState> = (set, get) => ({
  monitorData: [],
  isLoading: true,
  loadingProgress: 0,
  // Error States

  error: {
    hasError: false,
    message: '',
    statusCode: 0,
  },

  lastFetchTimestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
  // Rerender Monitor Data
  refreshMonitorData: () => {
    // set({ progress: 0, errorStatus: false, errorMessage: '', errorStatusCode: 0 })
    get().getMonitorData()
  },
  getMonitorData: async () => {
    set({ isLoading: true, loadingProgress: 0, error: { hasError: false, message: '', statusCode: 0 } })

    if (get().monitorData.length > 0 && canRerenderData(get().lastFetchTimestamp)) {
      set({ isLoading: false, loadingProgress: 100 })
      return
    }

    try {
      const promises = Array.from({ length: BATCH_URL_COUNT }, (_, i) =>
        fetch(`/api/v1/get_monitor_data?timestampindex=${i}`)
          .then(async (resp) => {
            if (!resp.ok) {
              const errorBody = await resp.text()
              throw new Error(`HTTP error! status: ${resp.status}, body: ${errorBody}`)
            }
            return resp.json()
          })
          .then((data) => {
            set((state) => ({
              loadingProgress: Math.min(state.loadingProgress + (1 / BATCH_URL_COUNT) * 100, 100),
            }))
            return data
          })
      )

      const results = await Promise.all(promises)
      const concatenatedData = concatArraysSortByDateStatus(...results)

      if (concatenatedData.length === 0) {
        throw new Error('No data found')
      }

      set({
        monitorData: concatenatedData,
        isLoading: false,
        lastFetchTimestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
    } catch (error: any) {
      console.error('Error fetching monitor data:', error)
      set({
        error: {
          hasError: true,
          statusCode: error instanceof Error ? 500 : error.status,
          message: error instanceof Error ? error.message : 'An unknown error occurred',
        },
        isLoading: false,
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
        loginErrorStatus: true,
        loginErrorStatusCode: error.status,
        loginErrorMessage: error.message,
        loginLoading: false,
        loginStatus: false,
      })
    }
  },
  fetchMonitorData: async (selectedDeviceList: string[]) => {
    set({ isLoginFetchMonitorLoading: true, loginFetchMonitorProgress: 0, loginLoading: true })
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
              const errorBody = await resp.text()
              throw new Error(
                ` Oops! We failed to fetch from AlertSite\nHTTP error! status: ${resp.status}, body: ${errorBody}`
              )
            }
            return resp.json()
          })
          .then((data) => {
            set((state) => ({
              loginFetchMonitorProgress: Math.min(state.loginFetchMonitorProgress + (1 / 6) * 100, 100),
            }))
            return data
          })
      )

      // Wait for all promises to resolve
      const results = await Promise.all(promises)
      // const validData = results.filter((data) => data !== null)
      const concatenatedData = concatArraysSortByDateStatus(...results)
      if (concatenatedData.length === 0) {
        throw new Error('No data found')
      }
      set({
        loginMonitorData: concatenatedData,
        loginLoading: false,
        isLoginFetchMonitorLoading: false,
        loginErrorStatus: false,
        loginErrorStatusCode: 0,
        loginErrorMessage: '',
      })
    } catch (error: any) {
      console.error('Fetch Monitor Error - @fetchMonitorData:', error)
      set({
        loginLoading: false,
        isLoginFetchMonitorLoading: false,
        loginErrorStatus: true,
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
  refreshMonitorData: () => void
  getMonitorData: () => Promise<void>
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
