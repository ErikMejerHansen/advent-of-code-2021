import * as fs from 'fs'

type Coordinate = [number, number]

export const parseHeightMap = (data: string): number[][] => {
  return data.split('\n').map(line => line.split('').map(height => parseInt(height, 10)))
}

export const findLowPoints = (heightMap: number[][]): Coordinate[] => {
  const lowPoints = new Array<Array<number>>()
  for (let rowIndex = 0; rowIndex < heightMap.length; rowIndex++) {
    const row = heightMap[rowIndex]
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const height = heightMap[rowIndex][columnIndex]
      const neighbors = getNeighborCoordinates([rowIndex, columnIndex], heightMap)
      const neighborsAreHigher = neighbors.every(coord => height < heightMap[coord[0]][coord[1]])

      if (neighborsAreHigher) {
        lowPoints.push([rowIndex, columnIndex])
      }
    }
  }

  return lowPoints as Coordinate[]
}

const getNeighborCoordinates = ([x, y]: Coordinate, array: number[][]): Coordinate[] => {
  const neighbors: [number, number][] = new Array<[number, number]>()

  // add upwards neighbor
  if (x > 0) {
    neighbors.push([x - 1, y])
  }

  // add downwards neighbor
  if (x < array.length - 1) {
    neighbors.push([x + 1, y])
  }

  // add leftwards neighbor
  if (y > 0) {
    neighbors.push([x, y - 1])
  }
  // add leftwards neighbor
  if (y < array[x].length - 1) {
    neighbors.push([x, y + 1])
  }

  return neighbors
}

const filterCoordinatesByValue = (coordinates: Coordinate[], array: number[][], exclude: number): Coordinate[] =>
  coordinates.filter(([x, y]) => array[x][y] !== exclude)

export const calculateRiskScore = (lowPoints: Coordinate[], heightMap: number[][]): number =>
  lowPoints.reduce((riskScore, lowPoint) => riskScore + 1 + heightMap[lowPoint[0]][lowPoint[1]], 0)

const findBasinSize = (coordinate: Coordinate, heightMap: number[][]): number => {
  const basin = new Set<string>()
  // Find the first round of neighbors
  const neighbors = getNeighborCoordinates(coordinate, heightMap)
  // Filter out any neighbor with a height of 9
  let nextNeighbors = filterCoordinatesByValue(neighbors, heightMap, 9)

  // Now that we have our first rounds of candidates let's keep going until we can't find anymore
  while (nextNeighbors.length !== 0) {
    // First save the current neighbors. We convert the coordinates to strings to make equality checks simple
    nextNeighbors.forEach(coordinate => basin.add(`${coordinate[0]},${coordinate[1]}`))

    // Get the neighbors of the cells we're currently looking at
    const nextCandidates = nextNeighbors.flatMap(coordinate => getNeighborCoordinates(coordinate, heightMap))

    // Filter out the ones we already know
    const newCandidates = nextCandidates.filter(coordinate => !basin.has(`${coordinate[0]},${coordinate[1]}`))

    // Once we filter out the ones with hight 9 we have our next rounds of candidates
    nextNeighbors = filterCoordinatesByValue(newCandidates, heightMap, 9)
  }

  // The basin size is then just the size of the Set of unique coordinates
  return basin.size
}
export const findBasinSizes = (lowPoints: Coordinate[], heightMap: number[][]): number[] =>
  lowPoints.map(coordinate => findBasinSize(coordinate, heightMap))

export const calculateBasinProduct = (basinSizes: number[]): number => {
  const result = basinSizes
    .sort((a, b) => a - b)
    .reverse()
    .splice(0, 3)
    .reduce((product, size) => product * size, 1)

  return result
}

const data = fs.readFileSync('./src/09/data/data.txt').toString()
const heightMap = parseHeightMap(data)
const lowPoints = findLowPoints(heightMap)

const basinSizes = findBasinSizes(lowPoints, heightMap)

console.log('Risk score:', calculateRiskScore(lowPoints, heightMap))
console.log('Basin product:', calculateBasinProduct(basinSizes))
