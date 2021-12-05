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

export const countOverlaps = (lines: Line[]): number => {
  const map = new Array<number>(COLUM_COUNT * COLUM_COUNT)
  map.fill(0)

  lines.forEach((line: Line) => {
    const { x: x1, y: y1 } = line.start
    const { x: x2, y: y2 } = line.end
    if (x1 === x2) {
      // Vertical line
      const min = Math.min(y1, y2) // Lines are not necessarily given in a top to down direction
      const max = Math.max(y1, y2)

      for (let i = min; i <= max; i++) {
        const cellIndex = x1 + i * COLUM_COUNT
        map[cellIndex] = map[cellIndex] + 1
      }
    } else if (y1 === y2) {
      // Horizontal line
      const min = Math.min(x1, x2) // Lines are not necessarily given in a left to right direction
      const max = Math.max(x1, x2)

      for (let i = min; i <= max; i++) {
        const cellIndex = i + y1 * COLUM_COUNT
        map[cellIndex] = map[cellIndex] + 1
      }
    }
  })

  return map.filter(cell => cell > 1).length
}

const data = fs.readFileSync('./src/05/data/vents.txt').toString()
const lines = parseLines(data)
console.log('The number of overlaps is:', countOverlaps(lines))
