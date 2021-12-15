import * as fs from 'fs'

import {
  frequencyCount,
  PairCounts,
  parsePolymerizationInstructions,
  mostMinusLeast,
  polymerize,
  runPolymerization,
  stringToPairCount,
} from '../14'

describe('Dec 14', () => {
  describe('Part 1', () => {
    const sampleData =
      'NNCB\n' +
      '\n' +
      'CH -> B\n' +
      'HH -> N\n' +
      'CB -> H\n' +
      'NH -> C\n' +
      'HB -> C\n' +
      'HC -> B\n' +
      'HN -> C\n' +
      'NN -> C\n' +
      'BH -> H\n' +
      'NC -> B\n' +
      'NB -> B\n' +
      'BN -> B\n' +
      'BB -> N\n' +
      'BC -> B\n' +
      'CC -> N\n' +
      'CN -> C'

    it('can parse the sample input', () => {
      expect(parsePolymerizationInstructions(sampleData).template).toStrictEqual(stringToPairCount('NNCB'))

      expect(parsePolymerizationInstructions(sampleData).insertions.get('CH')).toStrictEqual(['CB', 'BH'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('HH')).toStrictEqual(['HN', 'NH'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('CB')).toStrictEqual(['CH', 'HB'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('NH')).toStrictEqual(['NC', 'CH'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('HB')).toStrictEqual(['HC', 'CB'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('HN')).toStrictEqual(['HC', 'CN'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('NN')).toStrictEqual(['NC', 'CN'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('BH')).toStrictEqual(['BH', 'HH'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('NC')).toStrictEqual(['NB', 'BC'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('NB')).toStrictEqual(['NB', 'BB'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('BN')).toStrictEqual(['BB', 'BN'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('BB')).toStrictEqual(['BN', 'NB'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('BC')).toStrictEqual(['BB', 'BC'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('CC')).toStrictEqual(['CN', 'NC'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('BB')).toStrictEqual(['BN', 'NB'])
      expect(parsePolymerizationInstructions(sampleData).insertions.get('CN')).toStrictEqual(['CC', 'CN'])
    })

    it.each([
      ['CH', ['CB', 'BH']],
      ['HH', ['HN', 'NH']],
      ['CB', ['CH', 'HB']],
      ['NH', ['NC', 'CH']],
      ['HB', ['HC', 'CB']],
      ['HC', ['HB', 'BC']],
      ['HN', ['HC', 'CN']],
      ['NN', ['NC', 'CN']],
      ['NC', ['NB', 'BC']],
      ['BB', ['BN', 'NB']],
      ['CC', ['CN', 'NC']],
    ])('can compute the insertions', (input, expectedPolymer) => {
      const instructions = parsePolymerizationInstructions(sampleData)
      const expectedPairCount = new Map(expectedPolymer.map(pair => [pair, 1]))
      expect(polymerize(new Map([[input, 1]]), instructions.insertions)).toStrictEqual(expectedPairCount)
    })

    it('leaves the polymer intact if there are no matching insertions', () => {
      const instructions = parsePolymerizationInstructions(sampleData)
      const polymer = stringToPairCount('ZZ')
      expect(polymerize(polymer, instructions.insertions)).toStrictEqual(polymer)
    })

    it.each([
      [1, stringToPairCount('NCNBCHB')],
      [2, stringToPairCount('NBCCNBBBCBHCB')],
      [3, stringToPairCount('NBBBCNCCNBBNBNBBCHBHHBCHB')],
      [4, stringToPairCount('NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB')],
    ])('after %d steps it builds %s', (steps: number, expectedPolymer: PairCounts) => {
      const instructions = parsePolymerizationInstructions(sampleData)
      const polymer = runPolymerization(instructions, steps)
      const expectedEntries = [...expectedPolymer.entries()]
      expectedEntries.forEach(([pair, count]) => {
        expect(polymer.get(pair)).toBe(count)
      })
    })

    it('can count letter frequencies correctly', () => {
      let expectedFrequencies = Array(26).fill(0)
      expectedFrequencies['B'.charCodeAt(0) - 65] = 1
      expectedFrequencies['C'.charCodeAt(0) - 65] = 1
      expectedFrequencies['N'.charCodeAt(0) - 65] = 2
      expect(frequencyCount(stringToPairCount('NNCB'))).toStrictEqual(expectedFrequencies)

      expectedFrequencies.fill(0)
      expectedFrequencies['B'.charCodeAt(0) - 65] = 2
      expectedFrequencies['C'.charCodeAt(0) - 65] = 2
      expectedFrequencies['H'.charCodeAt(0) - 65] = 1
      expectedFrequencies['N'.charCodeAt(0) - 65] = 2
      expect(frequencyCount(stringToPairCount('NCNBCHB'))).toStrictEqual(expectedFrequencies)

      expectedFrequencies.fill(0)
      expectedFrequencies['B'.charCodeAt(0) - 65] = 6
      expectedFrequencies['C'.charCodeAt(0) - 65] = 4
      expectedFrequencies['H'.charCodeAt(0) - 65] = 1
      expectedFrequencies['N'.charCodeAt(0) - 65] = 2
      expect(frequencyCount(stringToPairCount('NBCCNBBBCBHCB'))).toStrictEqual(expectedFrequencies)

      expectedFrequencies.fill(0)
      expectedFrequencies['B'.charCodeAt(0) - 65] = 11
      expectedFrequencies['C'.charCodeAt(0) - 65] = 5
      expectedFrequencies['H'.charCodeAt(0) - 65] = 4
      expectedFrequencies['N'.charCodeAt(0) - 65] = 5
      expect(frequencyCount(stringToPairCount('NBBBCNCCNBBNBNBBCHBHHBCHB'))).toStrictEqual(expectedFrequencies)

      expectedFrequencies.fill(0)
      expectedFrequencies['B'.charCodeAt(0) - 65] = 23
      expectedFrequencies['C'.charCodeAt(0) - 65] = 10
      expectedFrequencies['H'.charCodeAt(0) - 65] = 5
      expectedFrequencies['N'.charCodeAt(0) - 65] = 11
      expect(frequencyCount(stringToPairCount('NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB'))).toStrictEqual(
        expectedFrequencies
      )
    })

    it('calculates the correct part 1 product on the sample data after 10 steps', () => {
      const sample = parsePolymerizationInstructions(sampleData)
      const polymer = runPolymerization(sample, 10)
      const freqs = frequencyCount(polymer)
      console.log(freqs)
      const result = mostMinusLeast(polymer)
      expect(result).toBe(1588)
    })

    it('Part 1 solution is 2967', () => {
      const data = fs.readFileSync('./src/14/data/data.txt').toString()
      const instructions = parsePolymerizationInstructions(data)
      const polymer = runPolymerization(instructions, 10)

      expect(mostMinusLeast(polymer)).toBe(2967)
    })
  })
  describe('Part 2', () => {
    it('Part 2 solution is 3692219987038', () => {
      const data = fs.readFileSync('./src/14/data/data.txt').toString()
      const instructions = parsePolymerizationInstructions(data)
      const polymer = runPolymerization(instructions, 40)

      expect(mostMinusLeast(polymer)).toBe(3692219987038)
    })
  })
})
