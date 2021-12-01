import { countNumberOfIncreases, countNumberOfIncreasingWindows } from '../01'

describe('Dec 1', () => {
  const sampleData = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]
  describe('Part 1', () => {
    it('should not mark the first index as increasing', () => {
      expect(countNumberOfIncreases([0, 10])).toBe(1)
    })
    it('should find 7 measurements that are increasing', () => {
      expect(countNumberOfIncreases(sampleData)).toBe(7)
    })
  })

  describe('Part 2', () => {
    it('should find 5 windows that are increasing', () => {
      expect(countNumberOfIncreasingWindows(sampleData)).toBe(5)
    })
  })
})
