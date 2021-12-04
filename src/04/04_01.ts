import * as fs from 'fs'

type BingoRow = [number | true, number | true, number | true, number | true, number | true]
/**
 * A Bingo plate contains 5 rows and 5 columns
 * Each cell can be either a number or `true` if the number in the cell has been drawn
 */
export type BingoPlate = [BingoRow, BingoRow, BingoRow, BingoRow, BingoRow]

export const parseDraws = (data: string): number[] =>
  data
    .split('\n')[0]
    .split(',')
    .map(x => parseInt(x, 10))

const parseBingoRow = (row: string): BingoRow =>
  row
    .trim()
    .split(/\D+/)
    .map(cell => parseInt(cell, 10)) as BingoRow

const parseBingoPlate = (rows: [string, string, string, string, string]) => rows.map(parseBingoRow) as BingoPlate

export const parseBingoPlates = (data: string): BingoPlate[] => {
  const lines = data.split('\n')
  lines.shift() // Discard the line with the draws

  const plates = new Array<BingoPlate>()
  while (lines.length !== 0) {
    lines.shift() // Discard the newline that precedes each bingo plate...
    const rows = [
      lines.shift() as string, // ... then pop the five rows of the plate
      lines.shift() as string,
      lines.shift() as string,
      lines.shift() as string,
      lines.shift() as string,
    ]

    const plate = parseBingoPlate(rows as [string, string, string, string, string])
    plates.push(plate)
  }

  return plates
}

/**
 * Marks a cell on the plate if it contains the drawn number
 * Warning: Mutates the plate argument!
 */
const markPlate = (draw: number, plate: BingoPlate) => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (plate[row][col] === draw) {
        plate[row][col] = true
      }
    }
  }
}

/**
 * Marks the plates with the drawn number
 * Warning: Input gets mutated!
 * @param drawing The number that has just been drawn
 * @param plates The bingo plates that are in play
 */
export const draw = (drawing: number, plates: BingoPlate[]) => {
  plates.forEach(plate => {
    markPlate(drawing, plate)
  })
}

const checkForRowBingo = (plate: BingoPlate): boolean =>
  plate.filter((row: BingoRow) => {
    return row.every(cell => cell === true)
  }).length > 0

const checkForColumnBingo = (plate: BingoPlate): boolean => {
  // Column bingo is row bingo if we transpose the plate
  const transposedPlate = plate[0].map((x, i) => plate.map(x => x[i]))
  return checkForRowBingo(transposedPlate as BingoPlate)
}

/**
 * Checks plates for Bingo
 * @param plates The plates to check for bingo
 * @returns The bingo plates that have Bingo
 */
export const checkForBingo = (plates: BingoPlate[]): BingoPlate[] => {
  return plates.filter((plate: BingoPlate) => checkForRowBingo(plate) || checkForColumnBingo(plate))
}

const calculatePlateScore = (winningNumber: number, plate: BingoPlate) =>
  plate
    // Filter out the 'true' cells...
    .flatMap((row: BingoRow) => {
      return row.filter(cell => typeof cell === 'number')
    })
    // .. and sum the numbers up
    .reduce((sum: number, cell) => {
      if (typeof cell === 'number') {
        return sum + cell
      } else {
        // The flatMap and filter above prevents this from happening
        return sum
      }
    }, 0) * winningNumber

/**
 * Calculates the bingo score for a game
 */
export const calculateGameScore = (data: string): number => {
  const draws = parseDraws(data)
  const plates = parseBingoPlates(data)

  let winningPlates: BingoPlate[] = []
  let winningNumber = -1

  while (winningPlates.length === 0) {
    const draw = draws.shift()!
    plates.forEach(plate => markPlate(draw, plate))
    winningPlates = checkForBingo(plates)
    winningNumber = draw
  }

  if (winningPlates.length > 1) {
    throw Error(`Found more than one winning plates ${winningPlates}`)
  }

  return calculatePlateScore(winningNumber, winningPlates[0])
}

const data = fs.readFileSync('./src/04/data/bingo_game.txt').toString()
console.log('The winning score is:', calculateGameScore(data))
