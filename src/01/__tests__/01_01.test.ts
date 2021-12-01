import { countNumberOfIncreases } from '../01_01'

describe('Dec 1', () => {
  describe('Part 1', () => {
    const sampleData = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]
    it('should not mark the first index as increasing', () => {
      expect(countNumberOfIncreases([0, 10])).toBe(1)
    })
    it('should find 7 measurements that are increasing', () => {
      expect(countNumberOfIncreases(sampleData)).toBe(7)
    })
  })
})
