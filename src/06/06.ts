import * as fs from 'fs'

export const parseAges = (data: string): number[] => data.split(',').map(x => parseInt(x, 10))

export const simulate = (ages: number[], daysToSimulate: number): number[] => {
  // Initial state: 3,4,3,1,2
  // After  1 day:  2,3,2,0,1
  // After  2 days: 1,2,1,6,0,8
  for (let day = 0; day < daysToSimulate; day++) {
    // Decrease everything
    ages = ages.map(x => x - 1)
    // Check for -1s, push 8's
    ages.filter(x => x === -1).forEach(_ => ages.push(8))
    // Reset -1s to 6
    ages = ages.map(x => (x === -1 ? 6 : x))
  }

  return ages
}

const data = fs.readFileSync('./src/06/data/ages.txt').toString()
console.log('The size of the lanternfish school is:', simulate(parseAges(data), 80).length)
