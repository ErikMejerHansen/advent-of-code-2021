import * as fs from 'fs'

export interface Point {
  x: number
  y: number
}

export interface Line {
  start: Point
  end: Point
}

const parsePoint = (point: string): Point => {
  const [x, y] = point.split(',').map(p => parseInt(p, 10))
  return { x, y }
}

const parseLine = (line: string): Line => {
  const [start, end] = line.split(' -> ').map(parsePoint)
  return { start, end }
}

export const parseLines = (data: string): Line[] => data.split('\n').map(parseLine)

const COLUM_COUNT = 1000

const markHorizontal = ({ start, end }: Line, ventMap: number[]) => {
  const min = Math.min(start.x, end.x) // Lines are not necessarily given in a left to right direction
  const max = Math.max(start.x, end.x)

  for (let i = min; i <= max; i++) {
    const cellIndex = i + start.y * COLUM_COUNT
    ventMap[cellIndex] = ventMap[cellIndex] + 1
  }
}

const markVertical = ({ start, end }: Line, ventMap: number[]) => {
  const min = Math.min(start.y, end.y) // Lines are not necessarily given in a top to down direction
  const max = Math.max(start.y, end.y)

  for (let i = min; i <= max; i++) {
    const cellIndex = start.x + i * COLUM_COUNT
    ventMap[cellIndex] = ventMap[cellIndex] + 1
  }
}

const markDiagonal = (line: Line, ventMap: number[]) => {
  // Find left-most start - ie the point with the lowest x value
  let leftMostStart = line.start.x < line.end.x ? line.start : line.end
  // And find the right-most end
  let rightMostEnd = line.start.x > line.end.x ? line.start : line.end

  let pointingDown = leftMostStart.y < rightMostEnd.y
  if (pointingDown) {
    let currentX = leftMostStart.x
    let currentY = leftMostStart.y
    while (currentX <= rightMostEnd.x && currentY <= rightMostEnd.y) {
      const cellIndex = currentX + currentY * COLUM_COUNT
      ventMap[cellIndex] = ventMap[cellIndex] + 1
      currentX++
      currentY++
    }
  } else {
    let currentX = leftMostStart.x
    let currentY = leftMostStart.y
    while (currentX <= rightMostEnd.x && currentY >= rightMostEnd.y) {
      const cellIndex = currentX + currentY * COLUM_COUNT
      ventMap[cellIndex] = ventMap[cellIndex] + 1
      currentX++
      currentY--
    }
  }
}

export const countOverlaps = (lines: Line[], ignoreDiagonals = false): number => {
  const map = new Array<number>(COLUM_COUNT * COLUM_COUNT)
  map.fill(0)

  lines.forEach((line: Line) => {
    const { x: x1, y: y1 } = line.start
    const { x: x2, y: y2 } = line.end
    if (x1 === x2) {
      markVertical(line, map)
    } else if (y1 === y2) {
      markHorizontal(line, map)
    } else if (!ignoreDiagonals) {
      markDiagonal(line, map)
    }
  })

  return map.filter(cell => cell > 1).length
}

const data = fs.readFileSync('./src/05/data/vents.txt').toString()
const lines = parseLines(data)
console.log('The number of overlaps, ignoring diagonals, is:', countOverlaps(lines, true))
console.log('The number of overlaps is:', countOverlaps(lines))
