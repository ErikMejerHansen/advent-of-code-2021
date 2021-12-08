import * as fs from 'fs'

export interface SevenSegmentLine {
  input: string[]
  output: string[]
}

export const parseSevenSegmentData = (data: string): SevenSegmentLine[] =>
  data.split('\n').map(line => {
    const [rawInput, rawOutput] = line.split(' | ')
    const input = rawInput.split(' ')
    const output = rawOutput.split(' ')

    return { input, output }
  })

export const countIdentifiableOutputs = (lines: SevenSegmentLine[]): number => {
  return lines.reduce((sum, line) => {
    const filtered = line.output.filter(segment => [2, 4, 3, 7].includes(segment.length))
    return sum + filtered.length
  }, 0)
}

const identifyUniqueDigitSequences = (line: SevenSegmentLine): [string, string, string, string] => {
  const oneSequence = line.input.find(s => s.length === 2)
  const fourSequence = line.input.find(s => s.length === 4)
  const sevenSequence = line.input.find(s => s.length === 3)
  const eightSequence = line.input.find(s => s.length === 7)

  if (!oneSequence || !fourSequence || !sevenSequence || !eightSequence) {
    throw Error('Could not find sequences for all uniquely identifiable digits')
  }
  return [oneSequence, fourSequence, sevenSequence, eightSequence]
}

const numberArrayEquals = (a: number[], b: number[]) => {
  return a.every((_, index) => b[index] === a[index])
}

const decodeDigit = (digit: string, [a, b, c, d]: [string, string, string, string]): number => {
  // Some digits we can identiy by just looking at their lengths
  if (digit.length === 2) {
    return 1
  } else if (digit.length === 4) {
    return 4
  } else if (digit.length === 3) {
    return 7
  } else if (digit.length === 7) {
    return 8
  }

  // The rest of the digits are identifiable by how much they overlap with the unique digits
  // If we build arrays [a,b,c,d] where 'a' is the number of overlaps with 1, 'b' is number of overlaps with 4 and so forth
  // 2 is identified by the array [1, 2, 2, 5]
  // 3 is identified by the array [2, 3, 3, 5]
  // 5 is identified by the array [1, 3, 2, 5]
  // 6 is identified by the array [1, 3, 2, 6]
  // 9 is identified by the array [2, 4, 3, 6]
  // 0 is identified by the array [2, 3, 3, 6]
  const overlaps = Array.from(digit).reduce(
    ([overlapA, overlapB, overlapC, overlapD], character) => {
      overlapA = a.includes(character) ? overlapA + 1 : overlapA
      overlapB = b.includes(character) ? overlapB + 1 : overlapB
      overlapC = c.includes(character) ? overlapC + 1 : overlapC
      overlapD = d.includes(character) ? overlapD + 1 : overlapD
      return [overlapA, overlapB, overlapC, overlapD]
    },
    [0, 0, 0, 0]
  )

  if (numberArrayEquals(overlaps, [1, 2, 2, 5])) {
    return 2
  } else if (numberArrayEquals(overlaps, [2, 3, 3, 5])) {
    return 3
  } else if (numberArrayEquals(overlaps, [1, 3, 2, 5])) {
    return 5
  } else if (numberArrayEquals(overlaps, [1, 3, 2, 6])) {
    return 6
  } else if (numberArrayEquals(overlaps, [2, 4, 3, 6])) {
    return 9
  } else if (numberArrayEquals(overlaps, [2, 3, 3, 6])) {
    return 0
  } else {
    throw new Error(`Could not decode: ${digit}`)
  }
}

export const decodeOutput = (line: SevenSegmentLine): number => {
  // First identify the characters for the unique digits
  // 1, 4, 7, 8 are uniquely identifiable by their lengths
  const pattersOfUniques = identifyUniqueDigitSequences(line)
  const outputs = line.output.map(digit => decodeDigit(digit, pattersOfUniques))
  const result = outputs[0] * 1000 + outputs[1] * 100 + outputs[2] * 10 + outputs[3]

  return result
}

export const sumOfOutputs = (lines: SevenSegmentLine[]): number =>
  lines.reduce((sum, line) => sum + decodeOutput(line), 0)

const data = fs.readFileSync('./src/08/data/data.txt').toString()
const parsedData = parseSevenSegmentData(data)
const numberOfIdentifiableOutputs = countIdentifiableOutputs(parsedData)
console.log('Number of identifiable outputs:', numberOfIdentifiableOutputs)
console.log('Sum of outputs:', sumOfOutputs(parsedData))
