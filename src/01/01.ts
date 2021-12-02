import * as fs from 'fs'

const parseData = (fileName: string) => {
  const buffer = fs.readFileSync(fileName)
  return buffer
    .toString()
    .split('\n')
    .map(it => parseInt(it))
}

export const countNumberOfIncreases = (measurements: number[]): number => {
  return measurements.filter((value, index) => {
    // Never count the first index as increasing
    if (index === 0) {
      return false
    }

    return measurements[index - 1] < value
  }).length
}

export const countNumberOfIncreasingWindows = (measurements: number[]): number => {
  return measurements.filter((value, index) => {
    // Don't start counting until we have enough to make the window
    if (index < 2) {
      return false
    }

    const a = measurements[index - 2] + measurements[index - 1] + measurements[index]
    const b = measurements[index - 1] + measurements[index] + measurements[index + 1]

    return a < b
  }).length
}

const measurements = parseData('./src/01/data/partOne.txt')
console.log('Number on increases:', countNumberOfIncreases(measurements))
console.log('Number on increasing windows:', countNumberOfIncreasingWindows(measurements))
