import { parseAges, simulate, schoolSize } from '../06'

describe('Dec 6', () => {
  let sampleData = '3,4,3,1,2'
  describe('Part 1', () => {
    it('can parse the sample data', () => {
      expect(parseAges(sampleData)).toStrictEqual([3, 4, 3, 1, 2])
    })
    it('decreases internal timers by one for each day', () => {
      let ages = parseAges(sampleData)
      let day1 = simulate(ages, 1)

      expect(day1).toStrictEqual([1, 1, 2, 1, 0, 0, 0, 0, 0, 0])
    })
    it('adds a new lanternfish when a counter reaches 0', () => {
      let ages = [0]
      let day1 = simulate(ages, 1)

      expect(day1[8]).toBe(1)
    })

    it('resets the internal timer of a lanternfish 6 after it reaches zero', () => {
      let ages = [0]
      let day1 = simulate(ages, 1)

      expect(day1[6]).toBe(1)
    })

    it('will add new lanternfish with an internal timer of 8', () => {
      let ages = [0]
      let day1 = simulate(ages, 1)

      expect(day1[8]).toBe(1)
    })

    it('correctly simulates the sample data for 80 days', () => {
      let ages = parseAges(sampleData)
      let day80 = simulate(ages, 80)

      expect(schoolSize(day80)).toBe(5934)
    })
  })
  describe('Part 2', () => {
    it('correctly simulates the sample data for 256 days', () => {
      let ages = parseAges(sampleData)
      let day80 = simulate(ages, 80)

      expect(day80).toHaveLength(26984457539)
    })
  })
})
