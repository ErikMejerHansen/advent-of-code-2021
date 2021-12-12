import * as fs from 'fs'
export enum CaveSize {
  Large,
  Small,
}

export interface Cave {
  name: string
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
  tunnels: Map<Cave, Tunnel[]>
}

type Path = Tunnel[]

const parseCave = (caveName: string): Cave => {
  const bigCaveRegex = /^[A-Z]+$/

  if (caveName === 'start') {
    return {
      name: caveName,
      size: CaveSize.Small,
      isStart: true,
      isEnd: false,
    }
  } else if (caveName === 'end') {
    return {
      name: caveName,
      size: CaveSize.Small,
      isStart: false,
      isEnd: true,
    }
  } else {
    return {
      name: caveName,
      size: bigCaveRegex.test(caveName) ? CaveSize.Large : CaveSize.Small,
      isStart: false,
      isEnd: false,
    }
  }
}

const addCaveToCaveSystem = (caveSystem: CaveSystem, line: string): CaveSystem => {
  const [left, right] = line.split('-')

  // Parse and add caves to the cave system
  const leftCave = parseCave(left)
  const rightCave = parseCave(right)
  caveSystem.caves.push(leftCave)
  caveSystem.caves.push(rightCave)

  // Parse and add tunnels to the cave system.
  // Caves are bidirectional, but the CaveSystem models them unidirectional, so we add two tunnels
  const leftToRight: Tunnel = { from: leftCave, to: rightCave }
  const rightToLeft: Tunnel = { from: rightCave, to: leftCave }

  if (caveSystem.tunnels.has(leftCave)) {
    caveSystem.tunnels.get(leftCave)?.push(leftToRight)
  } else {
    caveSystem.tunnels.set(leftCave, [leftToRight])
  }

  if (caveSystem.tunnels.has(rightCave)) {
    caveSystem.tunnels.get(rightCave)?.push(rightToLeft)
  } else {
    caveSystem.tunnels.set(rightCave, [rightToLeft])
  }

  return caveSystem
}

export const parseCaveSystem = (data: string): CaveSystem => {
  const emptyCaveSystem: CaveSystem = {
    caves: [],
    tunnels: new Map(),
  }
  return data.split('\n').reduce(addCaveToCaveSystem, emptyCaveSystem)
}

export const findPaths = (caveSystem: CaveSystem): Path[] => []

const data = fs.readFileSync('./src/12/data/data.txt').toString()
