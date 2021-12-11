import { parseData, performSteps, step } from '../11'

describe('Dec 11', () => {
  describe('Part 1', () => {
    const sampleData =
      '5483143223\n' +
      '2745854711\n' +
      '5264556173\n' +
      '6141336146\n' +
      '6357385478\n' +
      '4167524645\n' +
      '2176841721\n' +
      '6882881134\n' +
      '4846848554\n' +
      '5283751526'
    it('increases all cells by one for each step', () => {
      const example = [
        [0, 0],
        [0, 0],
      ]

      expect(step(example).octopi).toStrictEqual([
        [1, 1],
        [1, 1],
      ])
    })

    it('a flash causes neighbor cells to increase by 1', () => {
      const example = [
        [9, 0],
        [0, 0],
      ]

      expect(step(example).octopi).toStrictEqual([
        [0, 2],
        [2, 2],
      ])
    })

    it('only neighbors are affected by flashes', () => {
      const example = [
        [9, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]

      expect(step(example).octopi).toStrictEqual([
        [0, 2, 1],
        [2, 2, 1],
        [1, 1, 1],
      ])
    })

    it('flashes may cause chain effects', () => {
      const example = [
        [9, 8, 8],
        [0, 0, 7],
        [8, 7, 8],
      ]

      expect(step(example).octopi).toStrictEqual([
        [1, 2, 1],
        [5, 8, 2],
        [0, 1, 1],
      ])
    })

    it.each([
      [10, 204],
      [100, 1656],
    ])('after step %d the sum of flashes is %d', (stepCount, numberOfFlashes) => {
      const energyLevels = parseData(sampleData)
      expect(performSteps(stepCount, energyLevels).flashes).toBe(numberOfFlashes)
    })
  })
})
