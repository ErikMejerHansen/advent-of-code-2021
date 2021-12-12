import { Cave, CaveSize, findPaths, parseCaveSystem, Tunnel } from '../12'

describe('Dec 12', () => {
  const firstExample = 'start-A\n' + 'start-b\n' + 'A-c\n' + 'A-b\n' + 'b-d\n' + 'A-end\n' + 'b-end'
  const secondExample =
    'dc-end\n' +
    'HN-start\n' +
    'start-kj\n' +
    'dc-start\n' +
    'dc-HN\n' +
    'LN-dc\n' +
    'HN-end\n' +
    'kj-sa\n' +
    'kj-HN\n' +
    'kj-dc'

  const thirdExample =
    'fs-end\n' +
    'he-DX\n' +
    'fs-he\n' +
    'start-DX\n' +
    'pj-DX\n' +
    'end-zg\n' +
    'zg-sl\n' +
    'zg-pj\n' +
    'pj-he\n' +
    'RW-he\n' +
    'fs-DX\n' +
    'pj-RW\n' +
    'zg-RW\n' +
    'start-pj\n' +
    'he-WI\n' +
    'zg-he\n' +
    'pj-fs\n' +
    'start-RW'
  describe('Part 1', () => {
    it('parses cave system consisting of only start and end nodes', () => {
      const cave = 'start-end'
      const caveSystem = parseCaveSystem(cave)

      const expectedStart: Cave = { name: 'start', size: CaveSize.Small }
      const expectedEnd: Cave = { name: 'end', size: CaveSize.Small }
      expect(caveSystem.caves[0]).toStrictEqual(expectedStart)
      expect(caveSystem.caves[1]).toStrictEqual(expectedEnd)

      const expectedStartToEndTunnel: Tunnel = { from: expectedStart, to: expectedEnd }
      const expectedEndToStart: Tunnel = { from: expectedEnd, to: expectedStart }

      expect(caveSystem.tunnels.get(caveSystem.caves[0].name)?.pop()).toStrictEqual(expectedStartToEndTunnel)
      expect(caveSystem.tunnels.get(caveSystem.caves[1].name)?.pop()).toStrictEqual(expectedEndToStart)
    })

    it('parses cave sizes correctly', () => {
      const cave1 = 'A-b'
      const caveSystem1 = parseCaveSystem(cave1)
      const cave2 = 'b-DF'
      const caveSystem2 = parseCaveSystem(cave2)

      expect(caveSystem1.caves[0].size).toBe(CaveSize.Large)
      expect(caveSystem1.caves[1].size).toBe(CaveSize.Small)

      expect(caveSystem2.caves[0].size).toBe(CaveSize.Small)
      expect(caveSystem2.caves[1].size).toBe(CaveSize.Large)
    })

    it('finds 10 paths trough the first example', () => {
      const caveSystem = parseCaveSystem(firstExample)
      expect(findPaths(caveSystem)).toHaveLength(10)
    })

    it('finds 19 paths trough the second example', () => {
      const caveSystem = parseCaveSystem(secondExample)
      expect(findPaths(caveSystem)).toHaveLength(19)
    })

    it('finds 226 paths trough the third example', () => {
      const caveSystem = parseCaveSystem(thirdExample)
      expect(findPaths(caveSystem)).toHaveLength(226)
    })
  })

  describe('Part 2', () => {
    it('finds 10 paths trough the first example', () => {
      const caveSystem = parseCaveSystem(firstExample)
      expect(findPaths(caveSystem, true)).toHaveLength(36)
    })

    it('finds 19 paths trough the second example', () => {
      const caveSystem = parseCaveSystem(secondExample)
      expect(findPaths(caveSystem, true)).toHaveLength(103)
    })

    it('finds 226 paths trough the third example', () => {
      const caveSystem = parseCaveSystem(thirdExample)
      expect(findPaths(caveSystem, true)).toHaveLength(3509)
    })
  })
})
