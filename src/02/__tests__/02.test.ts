import * as part1 from '../02_01'
import * as part2 from '../02_02'
import { parseCommand } from '../command_parser'

describe('Dec 2', () => {
  const sampleData = 'forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2'
  describe('parsing commands', () => {
    it('can parse "forward" commands', () => {
      expect(parseCommand('forward 1')).toStrictEqual({ direction: 'forward', amount: 1 })
    })
    it('can parse "down" commands', () => {
      expect(parseCommand('down 4')).toStrictEqual({ direction: 'down', amount: 4 })
    })
    it('can parse "up" commands', () => {
      expect(parseCommand('up 42')).toStrictEqual({ direction: 'up', amount: 42 })
    })
  })
  describe('Part 1', () => {
    it('should increase the x position when moving forwards', () => {
      expect(part1.calculatePosition([{ direction: 'forward', amount: 10 }])).toStrictEqual({ x: 10, y: 0 })
    })
    it('should increase the y position when moving down', () => {
      expect(part1.calculatePosition([{ direction: 'down', amount: 9 }])).toStrictEqual({ x: 0, y: 9 })
    })
    it('should decrease the y position when moving up', () => {
      expect(part1.calculatePosition([{ direction: 'up', amount: 2 }])).toStrictEqual({ x: 0, y: -2 })
    })
    it('should calculate the correct position product for the sample data', () => {
      expect(part1.calculatePositionProduct(sampleData)).toBe(150)
    })
  })
  describe('Part 2', () => {
    it('should only increase the x position when moving forwards when aim is zero', () => {
      expect(part2.calculatePosition([{ direction: 'forward', amount: 10 }])).toStrictEqual({ x: 10, y: 0, aim: 0 })
    })
    it('should increase the x and y positions when moving forwards when aim is positive', () => {
      expect(part2.calculatePosition([{ direction: 'forward', amount: 10 }], { x: 0, y: 0, aim: 2 })).toStrictEqual({
        x: 10,
        y: 20,
        aim: 2,
      })
    })
    it('should increase the x and decrease y positions when moving forwards when aim is negative', () => {
      expect(part2.calculatePosition([{ direction: 'forward', amount: 10 }], { x: 0, y: 0, aim: -5 })).toStrictEqual({
        x: 10,
        y: -50,
        aim: -5,
      })
    })
    it('should increase the aim position when moving down', () => {
      expect(part2.calculatePosition([{ direction: 'down', amount: 9 }])).toStrictEqual({ x: 0, y: 0, aim: 9 })
    })
    it('should decrease the aim position when moving up', () => {
      expect(part2.calculatePosition([{ direction: 'up', amount: 2 }])).toStrictEqual({ x: 0, y: 0, aim: -2 })
    })
    it('should calculate the correct position product for the sample data', () => {
      expect(part2.calculatePositionProduct(sampleData)).toBe(900)
    })
  })
})
