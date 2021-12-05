import { countOverlaps, Line, parseLines } from '../05_01'

describe('Dec 5', () => {
  describe('Part 1', () => {
    const sampleData =
      '0,9 -> 5,9\n' +
      '8,0 -> 0,8\n' +
      '9,4 -> 3,4\n' +
      '2,2 -> 2,1\n' +
      '7,0 -> 7,4\n' +
      '6,4 -> 2,0\n' +
      '0,9 -> 2,9\n' +
      '3,4 -> 1,4\n' +
      '0,0 -> 8,8\n' +
      '5,5 -> 8,2'
    it('can parse line segments', () => {
      const line: Line = { start: { x: 6, y: 4 }, end: { x: 2, y: 0 } }
      expect(parseLines(sampleData)[5]).toStrictEqual(line)
    })

    it('can count the correct number of overlaps for the sample data', () => {
      const lines = parseLines(sampleData)

      expect(countOverlaps(lines)).toBe(5)
    })
  })
})
