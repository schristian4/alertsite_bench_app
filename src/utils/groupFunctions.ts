import { MonitorDataShape } from '@/lib/types'

/**
 * Group objects by property.
 * `nestGroupsBy` helper method.
 *
 *  This function takes an array of objects and a list of properties,
 *   and returns an object where each property is a key and the value is
 *   an array of objects that have the same property value.
 *
 * @param {T[]} arr - The array of objects to group
 * @param {Array<keyof T>} properties - The list of properties to group by
 * @returns {Record<string, any>} - An object where each property is a key and the value is an array of objects that have the same property value.
 * @example
 * const data = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 35 }
 * ]
 * const grouped = groupBy(data, 'age')
 *
 * Output:
 * {
 *    25: [{ name: 'Alice', age: 25 }],
 *    30: [{ name: 'Bob', age: 30 }],
 *    35: [{ name: 'Charlie', age: 35 }]
 *  }
 */

export function nestGroupsBy<T>(arr: T[], properties: Array<keyof T>): Record<string, any> {
  if (properties.length === 1) {
    return groupBy(arr, properties[0])
  }
  const property = properties.shift()
  if (!property) return {} // handle cases where properties array is empty

  const grouped: Record<string, any> = groupBy(arr, property)
  for (let key in grouped) {
    grouped[key] = nestGroupsBy(grouped[key], Array.from(properties))
  }
  return grouped
}

function groupBy<T>(arr: T[], property: keyof T): Record<string, T[]> {
  return arr.reduce((acc: Record<string, T[]>, obj: T) => {
    const key = obj[property] as string
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

interface looseObject {
  [key: string]: any
}
