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

const measurements = parseData('./src/01/data/partOne.txt')
console.log('Number on increases:', countNumberOfIncreases(measurements))
