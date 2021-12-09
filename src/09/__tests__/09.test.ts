import { calculateRiskScore, findLowPoints, parseHeightMap } from '../09'

describe('Dec 09', () => {
  const sampleData = '2199943210\n' + '3987894921\n' + '9856789892\n' + '8767896789\n' + '9899965678'
  describe('Part 1', () => {
    it('can parse the height-map data', () => {
      expect(parseHeightMap(sampleData)[2]).toStrictEqual([9, 8, 5, 6, 7, 8, 9, 8, 9, 2])
    })

    it('finds the low-points in the sample data', () => {
      const heightMap = parseHeightMap(sampleData)
      expect(findLowPoints(heightMap)).toStrictEqual([1, 0, 5, 5])
    })

    it('calculates the correct risk level on the sample data', () => {
      const heightMap = parseHeightMap(sampleData)
      const lowPoints = findLowPoints(heightMap)

      expect(calculateRiskScore(lowPoints)).toBe(15)
    })
  })

  describe('Part 2', () => {
    //
  })
})
