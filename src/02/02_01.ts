import * as fs from 'fs'
import { parseCommand } from './command_parser'
import { Command, Position } from './models'

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

const commands = fs.readFileSync('./src/02/data/commands.txt').toString()
const positionProduct = calculatePositionProduct(commands)
console.log('Prodduct of position:', positionProduct)
