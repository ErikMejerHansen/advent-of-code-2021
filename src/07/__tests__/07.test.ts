import { findMinimalFuelConsumption, findMinimalNonLinearFuelConsumption, parsePositions } from '../07'

describe('Dec 7', () => {
  const sampleData = '16,1,2,0,4,2,7,1,2,14'
  describe('Part 1', () => {
    it('parses positions correctly', () => {
      expect(parsePositions(sampleData)).toStrictEqual([16, 1, 2, 0, 4, 2, 7, 1, 2, 14])
    })
    it('calculates the minimal fuel consumption for the sample data', () => {
      const positions = parsePositions(sampleData)
      expect(findMinimalFuelConsumption(positions)).toBe(37)
    })
  })
  describe('Part 2', () => {
    it('calculates the minimal fuel consumption for the sample data', () => {
      const positions = parsePositions(sampleData)
      expect(findMinimalNonLinearFuelConsumption(positions)).toBe(170)
    })
  })
})
