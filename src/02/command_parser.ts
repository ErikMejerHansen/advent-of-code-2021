import { Command } from './models'

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
