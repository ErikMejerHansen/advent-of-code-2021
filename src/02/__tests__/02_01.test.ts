import { calculatePosition, calculatePositionProduct, parseCommand } from '../02_01'

describe('Dec 2', () => {
  describe('Part 1', () => {
    const sampleData = 'forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2'

    it('can parse "forward" commands', () => {
      expect(parseCommand('forward 1')).toStrictEqual({ direction: 'forward', amount: 1 })
    })
    it('can parse "down" commands', () => {
      expect(parseCommand('down 4')).toStrictEqual({ direction: 'down', amount: 4 })
    })
    it('can parse "up" commands', () => {
      expect(parseCommand('up 42')).toStrictEqual({ direction: 'up', amount: 42 })
    })

    it('should increase the x position when moving forwards', () => {
      expect(calculatePosition([{ direction: 'forward', amount: 10 }])).toStrictEqual({ x: 10, y: 0 })
    })
    it('should increase the y position when moving down', () => {
      expect(calculatePosition([{ direction: 'down', amount: 9 }])).toStrictEqual({ x: 0, y: 9 })
    })
    it('should decrease the y position when moving up', () => {
      expect(calculatePosition([{ direction: 'up', amount: 2 }])).toStrictEqual({ x: 0, y: -2 })
    })
    it('should calculate the correct position product for the sample data', () => {
      expect(calculatePositionProduct(sampleData)).toBe(150)
    })
  })
})
