export function createParameterArray(location: number, param: string, majorSiteName: any, siteObject: any) {
  let filters = siteObject[location]
  let tempArray: object[] = []
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
