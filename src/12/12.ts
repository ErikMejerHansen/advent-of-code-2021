import * as fs from 'fs'
export enum CaveSize {
  Large,
  Small,
}

export interface Cave {
  size: CaveSize
  isStart: boolean
  isEnd: boolean
}

export interface Tunnel {
  from: Cave
  to: Cave
}

export interface CaveSystem {
  caves: Cave[]
  tunnels: Map<Cave, Cave>
}

type Path = Tunnel[]

export const parseCaveSystem = (_data: string): CaveSystem => {
  const caves = [
    { isStart: true, isEnd: false, size: CaveSize.Small },
    { isStart: false, isEnd: true, size: CaveSize.Small },
  ]
  const tunnels = new Map([
    [caves[0], caves[1]],
    [caves[1], caves[0]],
  ])

  return {
    caves,
    tunnels,
  }
}

export const findPaths = (caveSystem: CaveSystem): Path[] => []

const data = fs.readFileSync('./src/12/data/data.txt').toString()
