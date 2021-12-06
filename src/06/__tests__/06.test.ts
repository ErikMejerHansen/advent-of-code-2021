import { parseAges, simulate } from '../06'

describe('Dec 6', () => {
  describe('Part 1', () => {
    let sampleData = '3,4,3,1,2'
    it('can parse the sample data', () => {
      expect(parseAges(sampleData)).toStrictEqual([3, 4, 3, 1, 2])
    })
    it('decreases internal timers by one for each day', () => {
      let ages = parseAges(sampleData)
      let day1 = simulate(ages, 1)

      expect(day1).toStrictEqual([2, 3, 2, 0, 1])
    })
    it('adds a new lanternfish when a counter reaches 0', () => {
      let ages = [0]
      let day1 = simulate(ages, 1)

      expect(day1).toHaveLength(2)
    })

    it('resets the internal timer of a lanternfish 6 after it reaches zero', () => {
      let ages = [0]
      let day1 = simulate(ages, 1)

      expect(day1[0]).toBe(6)
    })

    it('will add new lanternfish with an internal timer of 8', () => {
      let ages = [0]
      let day1 = simulate(ages, 1)

      expect(day1[1]).toBe(8)
    })

    it('correctly simulates the sample data for 80 days', () => {
      let ages = parseAges(sampleData)
      let day80 = simulate(ages, 80)

      expect(day80).toHaveLength(5934)
    })
  })
})
