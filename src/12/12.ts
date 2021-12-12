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
  tunnels: Map<string, Tunnel[]>
}

interface Path {
  path: Cave[]
  /**
   * Dead ends occur when the only path forward goes trough a small cave already visited
   */
  isDeadEnd: boolean

  /**
   * A ExitPath is complete when the path starts at the start cave and ends at the end cave
   */
  isComplete: boolean
}

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

  if (caveSystem.tunnels.has(leftCave.name)) {
    caveSystem.tunnels.get(leftCave.name)!.push(leftToRight)
  } else {
    caveSystem.tunnels.set(leftCave.name, [leftToRight])
  }

  if (caveSystem.tunnels.has(rightCave.name)) {
    caveSystem.tunnels.get(rightCave.name)!.push(rightToLeft)
  } else {
    caveSystem.tunnels.set(rightCave.name, [rightToLeft])
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

const pathContains = ({ path }: Path, cave: Cave): boolean => path.filter(it => it.name === cave.name).length > 0

const findExits = (cave: Cave, pathTaken: Path, caveSystem: CaveSystem): Path[] => {
  console.log('In:', cave.name, 'Via:', stringifyPath(pathTaken))
  if (cave.name === 'end') {
    console.log('end')
    // We have reached the end. No need to proceed
    return [{ ...pathTaken, path: [...pathTaken.path], isComplete: true }]
  }

  if (cave.size === CaveSize.Small && pathContains(pathTaken, cave)) {
    console.log('dead end')
    // We're at a dead end because we have visited this small cave before
    return [{ ...pathTaken, path: [...pathTaken.path], isDeadEnd: true }]
  }

  // Avoid mutating input
  const workingPath = [...pathTaken.path]
  // We're not finished or at a dead end. Add this cave to the path
  //   workingPath.push(cave)

  const tunnels = caveSystem.tunnels.get(cave.name)!
  const nextSteps = tunnels.flatMap(t => {
    return findExits(t.to, { ...pathTaken, path: [...workingPath, cave] }, caveSystem)
  })

  return nextSteps
}

const stringifyPath = (path: Path): string => path.path.map(({ name }) => name).join('->')

export const findPaths = (caveSystem: CaveSystem): Path[] => {
  const start = caveSystem.caves.filter(cave => cave.name === 'start')[0]
  const paths = findExits(start, { path: [], isDeadEnd: false, isComplete: false }, caveSystem)
  const legalPaths = paths.filter(({ isDeadEnd }) => !isDeadEnd)

  legalPaths.forEach(p => console.log('Path:', stringifyPath(p)))

  return legalPaths
}

const data = fs.readFileSync('./src/12/data/data.txt').toString()
const parsed = parseCaveSystem(data)
console.log('uf', findPaths(parsed).length)
