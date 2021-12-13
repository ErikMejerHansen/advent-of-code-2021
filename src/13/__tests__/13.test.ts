import * as fs from 'fs'
import { flipHorizontal, flipVertical, fold, Fold, Matrix, overlay, parseInstructions } from '../13'

describe('Dec 13', () => {
  describe('Part 1', () => {
    const sampleData =
      '6,10\n' +
      '0,14\n' +
      '9,10\n' +
      '0,3\n' +
      '10,4\n' +
      '4,11\n' +
      '6,0\n' +
      '6,12\n' +
      '4,1\n' +
      '0,13\n' +
      '10,12\n' +
      '3,4\n' +
      '3,0\n' +
      '8,4\n' +
      '1,10\n' +
      '2,14\n' +
      '8,10\n' +
      '9,0\n' +
      '\n' +
      'fold along y=7\n' +
      'fold along x=5'

    it('can flip a matrix horizontally', () => {
      const example = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]

      const expectedFlip = [
        [7, 8, 9],
        [4, 5, 6],
        [1, 2, 3],
      ]

      expect(flipHorizontal(example)).toStrictEqual(expectedFlip)
    })

    it('can flip a matrix vertically', () => {
      const example = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]

      const expectedFlip = [
        [3, 2, 1],
        [6, 5, 4],
        [9, 8, 7],
      ]

      expect(flipVertical(example)).toStrictEqual(expectedFlip)
    })

    it('can overlay two boolean matrixes', () => {
      const a = [
        [true, false, true],
        [false, false, false],
        [true, false, false],
      ]

      const b = [
        [false, false, true],
        [false, true, false],
        [false, false, true],
      ]

      const expectedOverlay = [
        [true, false, true],
        [false, true, false],
        [true, false, true],
      ]

      expect(overlay(a, b, true)).toStrictEqual(expectedOverlay)
    })

    it('can parse a simple example', () => {
      const example = '0,0\n' + '1,1\n' + '2,2\n' + '\n' + 'fold along x=1\n' + 'fold along y=1'

      const parsed = parseInstructions(example)
      expect(parsed.dots[0][0]).toBe(true)
    })

    it('can parse the example input', () => {
      const expectedMatrix: Matrix<boolean> = [
        [false, false, false, true, false, false, true, false, false, true, false],
        [false, false, false, false, true, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false],
        [true, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, true, false, false, false, false, true, false, true],
        [false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false],
        [false, true, false, false, false, false, true, false, true, true, false],
        [false, false, false, false, true, false, false, false, false, false, false],
        [false, false, false, false, false, false, true, false, false, false, true],
        [true, false, false, false, false, false, false, false, false, false, false],
        [true, false, true, false, false, false, false, false, false, false, false],
      ]

      const expectedFolds: Fold[] = [{ y: 7 }, { x: 5 }]
      expect(parseInstructions(sampleData)).toStrictEqual({ folds: expectedFolds, dots: expectedMatrix })
    })

    it('finds the correct number of dots after the first fold', () => {
      const parsed = parseInstructions(sampleData)
      const folded = fold(parsed.folds[0], parsed.dots)

      expect(folded.flat(1).filter(it => it)).toHaveLength(17)
    })

    it('find the correct anwser to part 1', () => {
      const data = fs.readFileSync('./src/13/data/data.txt').toString()
      const parsed = parseInstructions(data)
      const foldedOnce = fold(parsed.folds[0], parsed.dots)

      expect(foldedOnce.flat(1).filter(it => it)).toHaveLength(710)
    })
  })

  describe('Part 2', () => {
    //
  })
})
