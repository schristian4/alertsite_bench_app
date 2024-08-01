import { MonitorDataShape } from '@/lib/types'

interface MinMax {
  minValue: number
  maxValue: number
}
export const findMinMax = (arr: string[]) => {
  // Initial state with min and max set to Infinity and -Infinity respectively
  const initialState: MinMax = { minValue: Infinity, maxValue: -Infinity }
  // Reducer function
  const reducer = (acc: MinMax, curr: string) => {
    const num = parseFloat(curr) // Convert the current string number to a float
    return {
      minValue: num < acc.minValue ? num : acc.minValue,
      maxValue: num > acc.maxValue ? num : acc.maxValue,
    }
  }

  // Apply the reducer to the array
  const result = arr.reduce(reducer, initialState)
  return result
}

interface ParameterArrays {
  status: string[]
  dt_status: string[]
  resptime: string[]
}

export interface SiteObject<T> {
  [location: number]: {
    [key: string]: {
      [param: string]: T
    }
  }
}

let BLOCK_IP_RANGE = ['18.67.65.129', '999.999.999.999']
export function createMultiParameterArrays(
  location: number,
  majorSiteName: string,
  siteObject: SiteObject<MonitorDataShape>
): ParameterArrays {
  let filters = siteObject[location]
  let result: ParameterArrays = {
    status: [],
    dt_status: [],
    resptime: [],
  }
  if (majorSiteName === undefined || majorSiteName === null) {
    for (let i in filters) {
      for (let key in filters[i]) {
        result.status.push(filters[i][key].status)
        result.dt_status.push(filters[i][key].dt_status)
        result.resptime.push(filters[i][key].resptime)
      }
    }
  } else {
    for (let key in filters[majorSiteName]) {
      if (!BLOCK_IP_RANGE.includes(filters[majorSiteName][key].fullip)) {
        result.status.push(filters[majorSiteName][key].status)
        result.dt_status.push(filters[majorSiteName][key].dt_status)
        result.resptime.push(filters[majorSiteName][key].resptime)
      }
    }
  }

  return result
}

export function concatArraysRemoveDuplicates(...arrays: any[]) {
  const combinedArray = [].concat(...arrays)
  const uniqueObjects = new Map()

  combinedArray.forEach((obj: any) => {
    const ctlDevlogValue = obj['ctl_devlog']
    if (!uniqueObjects.has(ctlDevlogValue)) {
      uniqueObjects.set(ctlDevlogValue, obj)
    }
  })
}
