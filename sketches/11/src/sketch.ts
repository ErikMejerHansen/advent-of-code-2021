const RECT_SIZE = 20
const MAX_ENERGY = 200
const ENERGY_TRANSFER = 20
let ARRAY_SIZE = 100

let octopi = [[0]]

function setup() {
  createCanvas(windowWidth, windowHeight)
  noStroke()
  frameRate(60)
  rectMode(RADIUS)
  ARRAY_SIZE = Math.floor(Math.min(windowWidth, windowHeight) / RECT_SIZE)
  octopi = Array(ARRAY_SIZE)
    .fill(Array(ARRAY_SIZE).fill(0))
    .map(row => row.map((_: number) => map(random(), 0, 1, 0, MAX_ENERGY)))
}

function draw() {
  console.log('draw')
  translate(RECT_SIZE / 2, RECT_SIZE / 2)
  background(0)
  octopi = step(octopi).octopi
  octopi.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      // console.log('Drawing at:', row, cell)
      fill(map(cell, 0, 9, 0, 255))
      const size = map(cell, 0, MAX_ENERGY, 0, RECT_SIZE)
      rect(rowIndex * RECT_SIZE * 2, colIndex * RECT_SIZE * 2, size, size)
      // circle(rowIndex * CIRCLE_SIZE, colIndex * CIRCLE_SIZE, CIRCLE_SIZE)
    })
  })
}

type Coordinate = [number, number]

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
  // add rightwards neighbor
  if (y < array[x].length - 1) {
    neighbors.push([x, y + 1])
  }

  // Up and to the left
  if (x > 0 && y > 0) {
    neighbors.push([x - 1, y - 1])
  }
  // Up and to the right
  if (x > 0 && y < array[x].length - 1) {
    neighbors.push([x - 1, y + 1])
  }
  // Down and to the left

  // add downwards neighbor
  if (x < array.length - 1 && y > 0) {
    neighbors.push([x + 1, y - 1])
  }

  // Down and to the right
  if (x < array.length - 1 && y < array[x].length - 1) {
    neighbors.push([x + 1, y + 1])
  }

  return neighbors
}

const increaseEnergy = (octopi: number[][]): number[][] => {
  return octopi.map(row => {
    return row.map(octopus => {
      return octopus + 1
    })
  })
}
/**
 * Finds the coordinates of the octopi energy levels that are above 9
 * @param octopi The list of octopi energy levels
 * @returns the list of coordinates where the energy level is greater than 9
 */
const findFlashpoints = (octopi: number[][]): Coordinate[] => {
  const flashpoints: Coordinate[] = []
  for (let rowIndex = 0; rowIndex < octopi.length; rowIndex++) {
    for (let colIdex = 0; colIdex < octopi[rowIndex].length; colIdex++) {
      if (octopi[rowIndex][colIdex] > MAX_ENERGY) {
        flashpoints.push([rowIndex, colIdex])
      }
    }
  }

  return flashpoints
}

/**
 * Runs trough the list of flashpoints and applies flashes to the octopi.
 * A flash is applied by:
 * Increasing the energy level of neighbors by 1 and then resetting the energy level of the flashing octopus back to zero
 *
 * Warning: the octopi argument gets mutated.
 * @param octopi The list of octopi energy levels
 * @param flashpoints The list of cells that should flash
 */
const triggerFlashpoints = (octopi: number[][], flashpoints: Coordinate[]) => {
  flashpoints.forEach(flashpoint => {
    const neighbors = getNeighborCoordinates(flashpoint, octopi)
    neighbors.forEach(([x, y]) => (octopi[x][y] = octopi[x][y] + ENERGY_TRANSFER))
    octopi[flashpoint[0]][flashpoint[1]] = Number.MIN_SAFE_INTEGER // Marks point as already flashed
  })
}

const zeroOutNegatives = (array: number[][]): number[][] => array.map(row => row.map(cell => (cell < 0 ? 0 : cell)))

interface StepResult {
  flashes: number
  octopi: number[][]
}

const step = (octopi: number[][]): StepResult => {
  const energyIncreased = increaseEnergy(octopi)
  let flashes = 0
  let flashPoints = findFlashpoints(energyIncreased)
  while (flashPoints.length > 0) {
    flashes += flashPoints.length
    triggerFlashpoints(energyIncreased, flashPoints)
    flashPoints = findFlashpoints(energyIncreased)
  }

  // No more flashes, change all negative entries back to zero
  const zeroed = zeroOutNegatives(energyIncreased)

  return { flashes, octopi: zeroed }
}
