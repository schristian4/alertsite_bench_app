import { cityDataType } from '@/app/dashboard/components/shapes'

export function groupBy(conversions: cityDataType[], property: string | undefined) {
  return conversions.reduce((acc: any, obj: looseObject) => {
    if (property !== undefined) {
      let key = obj[property]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
    }
    return acc
  }, {})
}

export function nestGroupsBy(arr: cityDataType[], properties: string[]) {
  var property: (string[] | string) | undefined = properties
  if (properties.length === 1) {
    return groupBy(arr, properties[0])
  }
  property = properties.shift()
  var grouped = groupBy(arr, property)
  for (let key in grouped) {
    grouped[key] = nestGroupsBy(grouped[key], Array.from(properties))
  }
  return grouped
}
/**
 * Group objects by property.
 * `nestGroupsBy` helper method.
 * @param {String} property
 * @param {Object[]} conversions
 * @returns {Object}
 */

interface looseObject {
  [key: string]: any
}
