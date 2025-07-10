interface MinMax {
  minValue: number
  maxValue: number
}

export const findMinMax = (arr: string[]) => {
  // Initial state with min and max set to Infinity and -Infinity respectively
  const initialState: MinMax = { minValue: Infinity, maxValue: -Infinity }

  // If the current number is less than the minValue, set it to the current number`
  // If the current number is greater than the maxValue, set it to the current number
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
