import { calculateBasinProduct, calculateRiskScore, findBasinSizes, findLowPoints, parseHeightMap } from '../09'

describe('Dec 09', () => {
  const sampleData = '2199943210\n' + '3987894921\n' + '9856789892\n' + '8767896789\n' + '9899965678'
  describe('Part 1', () => {
    it('can parse the height-map data', () => {
      expect(parseHeightMap(sampleData)[2]).toStrictEqual([9, 8, 5, 6, 7, 8, 9, 8, 9, 2])
    })

    it('finds the low-points in the sample data', () => {
      const heightMap = parseHeightMap(sampleData)
      expect(findLowPoints(heightMap)).toStrictEqual([
        [0, 1],
        [0, 9],
        [2, 2],
        [4, 6],
      ])
    })

    it('calculates the correct risk level on the sample data', () => {
      const heightMap = parseHeightMap(sampleData)
      const lowPoints = findLowPoints(heightMap)

      expect(calculateRiskScore(lowPoints, heightMap)).toBe(15)
    })
  })

  describe('Part 2', () => {
    it('finds the 4 basin scores for the sample data', () => {
      const heightMap = parseHeightMap(sampleData)
      const lowPoints = findLowPoints(heightMap)

      expect(findBasinSizes(lowPoints, heightMap)).toStrictEqual([3, 9, 14, 9])
    })

    it('calculates the correct basin product from the sample data', () => {
      const heightMap = parseHeightMap(sampleData)
      const lowPoints = findLowPoints(heightMap)
      const basisSizes = findBasinSizes(lowPoints, heightMap)

      expect(calculateBasinProduct(basisSizes)).toBe(1134)
    })
  })
})
