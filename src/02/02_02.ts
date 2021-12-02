import * as fs from 'fs'
import { Command, parseCommand } from './02_01'

interface Attitude {
  x: number
  y: number
  aim: number
}

export const calculatePosition = (commands: Command[], initialAttitude = { x: 0, y: 0, aim: 0 }): Attitude => {
  const reducer = (previousAttitude: Attitude, currentCommand: Command): Attitude => {
    const amount = currentCommand.amount
    switch (currentCommand.direction) {
      case 'forward':
        return {
          x: previousAttitude.x + amount,
          y: previousAttitude.y + previousAttitude.aim * amount,
          aim: previousAttitude.aim,
        }
      case 'down':
        return { x: previousAttitude.x, y: previousAttitude.y, aim: previousAttitude.aim + amount }
      case 'up':
        return { x: previousAttitude.x, y: previousAttitude.y, aim: previousAttitude.aim - amount }
    }
  }

  return commands.reduce(reducer, initialAttitude)
}

export const calculatePositionProduct = (commands: string): number => {
  const parsedCommands = commands.split('\n').map(parseCommand)
  const { x, y } = calculatePosition(parsedCommands)

  return x * y
}

const commands = fs.readFileSync('./src/02/data/commands.txt').toString()
const positionProduct = calculatePositionProduct(commands)
console.log('Product of position:', positionProduct)
