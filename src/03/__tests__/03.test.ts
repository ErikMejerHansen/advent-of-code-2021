import { calculateC02ScrubberRating, calculateOxygenGeneratorRating, calculateRates } from '../03'

describe('Dec 3', () => {
  const sampleData = '00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010'
  describe('Part 1', () => {
    it('calculates the the gamma rate as 22 for the sample data', () => {
      expect(calculateRates(sampleData)[0]).toBe(22)
    })

    it('calculates the the epsilon rate as 9 for the sample data', () => {
      expect(calculateRates(sampleData)[1] & 0b000000011111).toBe(9)
    })
  })

  describe('Part 2', () => {
    it('calculates the oxygen generator rating on the sample data as 23', () => {
      expect(calculateOxygenGeneratorRating(sampleData)).toBe(23)
    })
    it('calculates the C02 scrubber rating on the sample data as 10', () => {
      expect(calculateC02ScrubberRating(sampleData, 4)).toBe(10)
    })
  })
})
