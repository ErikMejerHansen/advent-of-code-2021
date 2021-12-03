import * as fs from 'fs'

const COLUM_COUNT = 12

const toNumberArray = (input: string): number[] => {
  return input.split('\n').map(line => parseInt(line, 2))
}

export const calculateRates = (diagnosticData: string): [number, number] => {
  // These masks will keep taps on which digit was in majority/minority for each column
  let majorityMask = 0b000000000000
  let minorityMask = 0b000000000000
  const data = toNumberArray(diagnosticData)
  for (let col = 0; col < COLUM_COUNT; col++) {
    let columnSum = 0
    for (let row = 0; row < data.length; row++) {
      // Right shift so that we have the current column moved all the way to the right
      let x = data[row] >> col
      // Mask out everything except the first column
      x = x & 1
      // Add the result to the column sum
      columnSum += x
    }
    // If the column sum is greater than half the length of the data then there were more 1s than zeros
    if (columnSum > data.length / 2) {
      majorityMask = majorityMask + (1 << col)
    } else {
      minorityMask = minorityMask + (1 << col)
    }
  }
  return [majorityMask, minorityMask]
}

const data = fs.readFileSync('./src/03/data/diagnostic_report.txt').toString()
const [gamma, epsilon] = calculateRates(data)
console.log('Power consumption', gamma * epsilon)
