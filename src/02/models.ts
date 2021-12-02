export interface Command {
  direction: 'forward' | 'up' | 'down'
  amount: number
}

export interface Position {
  x: number
  y: number
}

export interface Attitude extends Position {
  aim: number
}
