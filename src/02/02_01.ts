import * as fs from 'fs'

export interface Command {
  direction: 'forward' | 'up' | 'down'
  amount: number
}

interface Position {
  x: number
  y: number
}

export const parseCommand = (line: string): Command => {
  const [direction, amount] = line.split(' ')
  switch (direction) {
    case 'forward':
      return { direction: 'forward', amount: parseInt(amount) }
    case 'down':
      return { direction: 'down', amount: parseInt(amount) }
    case 'up':
      return { direction: 'up', amount: parseInt(amount) }
    default:
      console.error('Could not parse:', line, 'as Command')
      process.exit(-1)
  }
}

export const calculatePosition = (commands: Command[], initialPosition = { x: 0, y: 0 }): Position => {
  const reducer = (previousPosition: Position, currentCommand: Command): Position => {
    const amount = currentCommand.amount
    switch (currentCommand.direction) {
      case 'forward':
        return { x: previousPosition.x + amount, y: previousPosition.y }
      case 'down':
        return { x: previousPosition.x, y: previousPosition.y + amount }
      case 'up':
        return { x: previousPosition.x, y: previousPosition.y - amount }
    }
  }

  return commands.reduce(reducer, initialPosition)
}

export const calculatePositionProduct = (commands: string): number => {
  const parsedCommands = commands.split('\n').map(parseCommand)
  const { x, y } = calculatePosition(parsedCommands)

  return x * y
}

const commands = fs.readFileSync('./src/02/data/partOne.txt').toString()
const positionProduct = calculatePositionProduct(commands)
console.log('Prodduct of position:', positionProduct)
