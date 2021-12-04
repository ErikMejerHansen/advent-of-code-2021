import { BingoPlate, calculateGameScore, checkForBingo, draw, parseBingoPlates, parseDraws } from '../04_01'

describe('Dec 4', () => {
  describe('Part 1', () => {
    const sampleData =
      '7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1\n' +
      '\n' +
      '22 13 17 11  0\n' +
      '8  2 23  4 24\n' +
      '21  9 14 16  7\n' +
      '6 10  3 18  5\n' +
      '1 12 20 15 19\n' +
      '\n' +
      '3 15  0  2 22\n' +
      '9 18 13 17  5\n' +
      '19  8  7 25 23\n' +
      '20 11 10 24  4\n' +
      '14 21 16 12  6\n' +
      '\n     ' +
      '14 21 17 24  4\n' +
      '10 16 15  9 19\n' +
      '18  8 23 26 20\n' +
      '22 11 13  6  5\n' +
      '2  0 12  3  7'
    it('can parse draw numbers from sample data', () => {
      expect(parseDraws(sampleData)).toStrictEqual([
        7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1,
      ])
    })
    it('can parse bingo plates from sample data', () => {
      expect(parseBingoPlates(sampleData)[2]).toStrictEqual([
        [14, 21, 17, 24, 4],
        [10, 16, 15, 9, 19],
        [18, 8, 23, 26, 20],
        [22, 11, 13, 6, 5],
        [2, 0, 12, 3, 7],
      ])
    })

    it('can detect bingo in a row', () => {
      const plate: BingoPlate = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ]

      draw(6, [plate])
      draw(7, [plate])
      draw(8, [plate])
      draw(9, [plate])
      draw(4, [plate])
      expect(checkForBingo([plate])).toStrictEqual([])
      draw(10, [plate]) // There should be BINGO! now
      expect(checkForBingo([plate])).toHaveLength(1)
    })
    it('can detect bingo in a column', () => {
      const plate: BingoPlate = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ]

      draw(4, [plate])
      draw(9, [plate])
      draw(14, [plate])
      draw(19, [plate])
      draw(18, [plate])
      expect(checkForBingo([plate])).toStrictEqual([])
      draw(24, [plate]) // There should be BINGO! now
      expect(checkForBingo([plate])).toHaveLength(1)
    })

    it('can calculate the correct score for the winning board for the sample data', () => {
      expect(calculateGameScore(sampleData)).toBe(4512)
    })
  })
})
