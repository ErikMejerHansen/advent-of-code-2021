import * as fs from 'fs'

export type Matrix<T> = T[][]
export interface Fold {
  x?: number
  y?: number
}

interface Coordinate {
  x: number
  y: number
}
export interface Instruction {
  dots: Matrix<boolean>
  folds: Fold[]
}

const transpose = <T>(matrix: Matrix<T>): Matrix<T> => matrix[0].map((x, i) => matrix.map(x => x[i]))
// Horizontal flip performed by: Transposing to switch rows for columns. Doing a vertical flip and then transposing back
export const flipHorizontal = <T>(matrix: Matrix<T>): Matrix<T> => transpose(flipVertical(transpose(matrix)))
export const flipVertical = <T>(matrix: Matrix<T>): Matrix<T> => matrix.map(row => row.reverse())

export const overlay = <T>(a: Matrix<T>, b: Matrix<T>, dotMarker: T) =>
  a.map((row, rowIndex) => {
    // If "a" has a dot in this position then keep it. Otherwise just overwrite with the value from "b" - which may or may not be a dot
    return row.map((cell, colIndex) => (cell === dotMarker ? cell : b[rowIndex][colIndex]))
  })

const horizontalFold = (y: number, matrix: Matrix<boolean>) => {
  const topHalf = matrix.slice(0, y)
  const bottomHalf = matrix.slice(y)
  const flippedBottom = flipHorizontal(bottomHalf)

  return overlay(topHalf, flippedBottom, true)
}

export const fold = (fold: Fold, matrix: Matrix<boolean>): Matrix<boolean> => {
  if (fold.y) {
    // Perform a vertical fold
    return horizontalFold(fold.y!, matrix)
  } else if (fold.x) {
    // Perform a horizontal fold
    // A horizontal fold is just a vertical fold on the transposed matrix
    const transposed = transpose(matrix)
    // Fold it
    const foldedAndTransposed = horizontalFold(fold.x, transposed)
    // And transpose it back
    return transpose(foldedAndTransposed)
  } else {
    throw new Error('Fold had nineither nor y ')
  }
}

export const parseInstructions = (data: string): Instruction => {
  const reducer = (
    parseResult: { dotCoordinates: Coordinate[]; folds: Fold[] },
    line: string
  ): { dotCoordinates: Coordinate[]; folds: Fold[] } => {
    if (line.startsWith('fold along y=')) {
      // We've found a vertical fold
      parseResult.folds.push({ y: parseInt(line.substring(13), 10) })
      return parseResult
    } else if (line.startsWith('fold along x=')) {
      // We've found a horizontal fold
      parseResult.folds.push({ x: parseInt(line.substring(13), 10) })
      return parseResult
    } else if (line.trim().length === 0) {
      // We have hit the blank line between the dots and folds sections
      return parseResult
    } else {
      // Its not a fold, its not a newline, must be a dot
      const [x, y] = line.split(',').map(raw => parseInt(raw, 10))
      parseResult.dotCoordinates.push({ x, y })
      return parseResult
    }
  }

  const { dotCoordinates, folds } = data.split('\n').reduce(reducer, { dotCoordinates: [], folds: [] })

  // Find the width and heights of the dots matrix..
  const width = dotCoordinates.reduce((max, current) => Math.max(max, current.x), Number.MIN_SAFE_INTEGER) + 1
  const height = dotCoordinates.reduce((max, current) => Math.max(max, current.y), Number.MIN_SAFE_INTEGER) + 1
  // .. and create a dots array of the appropriate size
  const dots = Array(height)
    .fill([])
    .map(_ => Array(width).fill(false))

  // Flip cells to true in places where there is a dot
  dotCoordinates.forEach(({ x, y }) => (dots[y][x] = true))
  return { dots, folds }
}

const stringifyMatrix = <T>(matrix: Matrix<T>, dotMarker: T, printedDot: string, printedBlank: string): string => {
  let out = ''
  matrix.forEach(row => {
    row.forEach(cell => {
      out += cell === dotMarker ? printedDot : printedBlank
    })
    out += '\n'
  })

  return out
}

const foldInstructions = (instructions: Instruction) => {
  const folded = instructions.folds.reduce((paper, currentFold) => {
    return fold(currentFold, paper)
  }, instructions.dots)
  return stringifyMatrix(folded, true, '#', '.')
}

const data = fs.readFileSync('./src/13/data/data.txt').toString()

const parsed = parseInstructions(data)
const folded = fold(parsed.folds[0], parsed.dots)
const points = folded.flat(1).filter(it => it).length
console.log('Number of dots after first fold', points)

console.log('The folded instructions look like this:')
console.log(foldInstructions(parsed))
