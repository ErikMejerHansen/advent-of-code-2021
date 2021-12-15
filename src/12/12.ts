import * as fs from 'fs'
export enum CaveSize {
  Small,
  Large,
}

export interface Cave {
  name: string
  size: CaveSize
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

  duplicateTaken: boolean
}

const parseCave = (caveName: string): Cave => {
  const bigCaveRegex = /^[A-Z]+$/

  if (caveName === 'start') {
    return {
      name: caveName,
      size: CaveSize.Small,
    }
  } else if (caveName === 'end') {
    return {
      name: caveName,
      size: CaveSize.Small,
    }
  } else {
    return {
      name: caveName,
      size: bigCaveRegex.test(caveName) ? CaveSize.Large : CaveSize.Small,
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

const clonePath = (original: Path, overrides?: Partial<Path>): Path => {
  return { ...original, path: [...original.path], ...overrides }
}

const findExits = (cave: Cave, pathTaken: Path, caveSystem: CaveSystem, allowDuplicate: boolean): Path[] => {
  const extendedPath = clonePath(pathTaken, { path: [...pathTaken.path, cave] })
  if (cave.name === 'end') {
    // We're at the end. Finish path
    const clone = clonePath(extendedPath, { isComplete: true })
    return [clone]
  }

  if (cave.size === CaveSize.Small && pathContains(pathTaken, cave)) {
    // We've hit a small cave for the second time
    if (cave.name === 'start') {
      // This is the second time we see the start cave. This is a dead end
      const clone = clonePath(extendedPath, { isDeadEnd: true })
      return [clone]
    } else if (allowDuplicate && extendedPath.duplicateTaken) {
      // We allow traversing a small cave twice, but have already done so. This is a dead end
      const clone = clonePath(extendedPath, { isDeadEnd: true })
      return [clone]
    } else if (allowDuplicate && !extendedPath.duplicateTaken) {
      // We're at this small cave for the second time. Flip the duplicateTaken flag and proceed
      extendedPath.duplicateTaken = true
    } else {
      // We don't allow traversing a small cave twice. This is a dead end.
      const clone = clonePath(extendedPath, { isDeadEnd: true })
      return [clone]
    }
  }

  const tunnels = caveSystem.tunnels.get(cave.name)!
  let paths: Path[] = []
  tunnels.forEach(tunnel => {
    const newPaths = findExits(tunnel.to, extendedPath, caveSystem, allowDuplicate)
    paths = [...paths, ...newPaths]
  })

  return paths
}

export const findPaths = (caveSystem: CaveSystem, allowDuplicate = false): Path[] => {
  const start = caveSystem.caves.filter(cave => cave.name === 'start')[0]
  const paths = findExits(
    start,
    { path: [], isDeadEnd: false, isComplete: false, duplicateTaken: false },
    caveSystem,
    allowDuplicate
  )

  return paths.filter(p => !(p as Path).isDeadEnd)
}

const data = fs.readFileSync('./src/12/data/data.txt').toString()
const parsed = parseCaveSystem(data)
console.log('Number of paths:', findPaths(parsed).length)
console.log('Number of paths - with duplicate allowed:', findPaths(parsed, true).length)
