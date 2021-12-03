import { calculateRates } from '../03_01'

describe('Dec 3', () => {
  describe('Part 1', () => {
    const sampleData = '00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010'
    it('calculates the the gamma rate as 22 for the sample data', () => {
      expect(calculateRates(sampleData)[0]).toBe(22)
    })

    it('calculates the the epsilon rate as 9 for the sample data', () => {
      expect(calculateRates(sampleData)[1] & 0b000000011111).toBe(9)
    })
  })
})
