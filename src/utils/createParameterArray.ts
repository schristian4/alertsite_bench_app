interface SiteObject {
  [location: number]: {
    [key: string]: {
      [param: string]: any
    }
  }
}

/* Create Parameter Array */
export function createParameterArray(
  location: number,
  param: string,
  majorSiteName: string,
  siteObject: SiteObject
) {
  let filters = siteObject[location]
  let tempArray = []
  if (majorSiteName === undefined || majorSiteName === null) {
    for (let i in filters) {
      for (let key in filters[i]) {
        tempArray.push(filters[i][key][param])
      }
    }
  } else {
    for (let i in filters) {
      if (i === majorSiteName) {
        for (let key in filters[i]) {
          tempArray.push(filters[majorSiteName][key][param])
        }
      }
    }
  }
  return tempArray
}

/*
 * Generate an object of parameter arrays for each major site
 * - Based on the location and parameters provided
 * @param location
 * @param params
 * @param majorSiteName
 * @param siteObject
 * @returns
 */

export function generatorParameterArrayObject(
  location: number,
  params: string[],
  majorSiteName: string,
  siteObject: SiteObject
): Record<string, any[]> {
  // Get the filters object for the specified location
  const filters = siteObject[location]

  // Initialize an empty object to store the parameter arrays
  const result: Record<string, any[]> = {}

  // If majorSiteName is undefined or null, iterate through the filters object
  if (majorSiteName === undefined || majorSiteName === null) {
    for (let i in filters) {
      for (let key in filters[i]) {
        for (let param of params) {
          if (!result[param]) {
            result[param] = []
          }
          result[param].push(filters[i][key][param])
        }
      }
    }
  } else {
    for (let i in filters) {
      if (i === majorSiteName) {
        for (let key in filters[i]) {
          for (let param of params) {
            if (!result[param]) {
              result[param] = []
            }
            result[param].push(filters[majorSiteName][key][param])
          }
        }
      }
    }
  }

  return result
}
