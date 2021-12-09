import * as fs from 'fs'
import { calculateGameScore } from 'src/04/04'

export const parseHeightMap = (data: string): number[][] => {
  return data.split('\n').map(line => line.split('').map(height => parseInt(height, 10)))
}

export const findLowPoints = (heightMap: number[][]): number[] => {
  const lowPoints = new Array<number>()
  for (let rowIndex = 0; rowIndex < heightMap.length; rowIndex++) {
    const row = heightMap[rowIndex]
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const height = heightMap[rowIndex][columnIndex]
      // check up
      const smallerThanNeighborUp = rowIndex > 0 ? height < heightMap[rowIndex - 1][columnIndex] : true
      // check down
      const smallerThanNeighborDown =
        rowIndex < heightMap.length - 1 ? height < heightMap[rowIndex + 1][columnIndex] : true
      // check left
      const smallerThanNeighborLeft = columnIndex > 0 ? height < heightMap[rowIndex][columnIndex - 1] : true
      // check right
      const smallerThanNeighborRight =
        columnIndex < row.length - 1 ? height < heightMap[rowIndex][columnIndex + 1] : true

      if (smallerThanNeighborUp && smallerThanNeighborDown && smallerThanNeighborLeft && smallerThanNeighborRight) {
        lowPoints.push(height)
      }
    }
  }
  return lowPoints
}

export const calculateRiskScore = (lowPoints: number[]): number =>
  lowPoints.reduce((riskScore, height) => riskScore + 1 + height, 0)

const data = fs.readFileSync('./src/09/data/data.txt').toString()
const heightMap = parseHeightMap(data)
const lowPoints = findLowPoints(heightMap)

console.log('Risk score:', calculateRiskScore(lowPoints))
