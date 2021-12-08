import * as fs from 'fs'

export const parseAges = (data: string): number[] => data.split(',').map(x => parseInt(x, 10))

export const simulate = (ages: number[], daysToSimulate: number): number[] => {
  // Build initial histogram of ages
  const agesHistogram = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ages.forEach(age => (agesHistogram[age] = agesHistogram[age] + 1))

  for (let day = 0; day < daysToSimulate; day++) {
    const newBorns = agesHistogram[0]
    agesHistogram[0] = agesHistogram[1]
    agesHistogram[1] = agesHistogram[2]
    agesHistogram[2] = agesHistogram[3]
    agesHistogram[3] = agesHistogram[4]
    agesHistogram[4] = agesHistogram[5]
    agesHistogram[5] = agesHistogram[6]
    agesHistogram[6] = agesHistogram[7]
    agesHistogram[7] = agesHistogram[8]
    agesHistogram[8] = newBorns
    agesHistogram[6] = agesHistogram[6] + newBorns
  }

  return agesHistogram
}

export const schoolSize = (ages: number[]): number => ages.reduce((sum, ageCount) => sum + ageCount, 0)

const data = fs.readFileSync('./src/06/data/ages.txt').toString()
console.log('The size of the lanternfish school after 80 days is:', schoolSize(simulate(parseAges(data), 80)))
console.log('The size of the lanternfish school after 256 days is:', schoolSize(simulate(parseAges(data), 256)))
