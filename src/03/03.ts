import * as fs from 'fs'

const COLUM_COUNT = 12

const toNumberArray = (input: string): number[] => {
  return input.split('\n').map(line => parseInt(line, 2))
}

export const calculateRates = (diagnosticData: string): [number, number] => {
  const data = toNumberArray(diagnosticData)

  // These masks will keep taps on which digit was in majority/minority for each column
  let majorityMask = 0b000000000000
  let minorityMask = 0b000000000000

  for (let col = 0; col < COLUM_COUNT; col++) {
    const majorityBit = findMajorityBitAt(col, data)
    // If the column sum is greater than half the length of the data then there were more 1s than zeros
    majorityMask = majorityMask + (majorityBit << col)
    if (majorityBit === 0) {
      minorityMask = minorityMask + (1 << col)
    }
  }
  return [majorityMask, minorityMask]
}

const findMajorityBitAt = (column: number, data: number[]): 0 | 1 => {
  let columnSum = 0
  for (let row = 0; row < data.length; row++) {
    // Right shift so that we have the current column moved all the way to the right
    let x = data[row] >> column
    // Mask out everything except the first column
    x = x & 1
    // Add the result to the column sum
    columnSum += x
  }
  // If the column sum is greater than half the length of the data then there were more 1s than zeros
  if (columnSum === data.length / 2) {
    return 1
  } else if (columnSum > data.length / 2) {
    return 1
  } else {
    return 0
  }
}

const filterByMajorityBit = (data: number[], column = 11): number[] => {
  const majorityBit = findMajorityBitAt(column, data)
  const filtered = data.filter(value => {
    value = value >> column
    value = value & 1

    return value === majorityBit
  })

  if (filtered.length <= 1) {
    return filtered
  } else {
    return filterByMajorityBit(filtered, column - 1)
  }
}

const filterByMinorityBit = (data: number[], column = 11): number[] => {
  const minorityBit = findMajorityBitAt(column, data) ^ 1

  const filtered = data.filter(value => {
    value = value >> column
    value = value & 1

    const result = value === minorityBit
    return result
  })

  if (filtered.length <= 1) {
    return filtered
  } else {
    return filterByMinorityBit(filtered, column - 1)
  }
}

export const calculateOxygenGeneratorRating = (diagnosticData: string): number => {
  const data = toNumberArray(diagnosticData)
  return filterByMajorityBit(data)[0]
}

export const calculateC02ScrubberRating = (diagnosticData: string, columns = 11): number => {
  const data = toNumberArray(diagnosticData)
  return filterByMinorityBit(data, columns)[0]
}
const data = fs.readFileSync('./src/03/data/diagnostic_report.txt').toString()
const [gamma, epsilon] = calculateRates(data)
console.log('Power consumption', gamma * epsilon)

const oxygen = calculateOxygenGeneratorRating(data)
const c02 = calculateC02ScrubberRating(data)
console.log('Life support rating:', oxygen * c02)
