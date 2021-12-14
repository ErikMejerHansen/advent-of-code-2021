import * as fs from 'fs'

import { parsePolymerizationInstructions, part1, polymerize, runPolymerization } from '../14'

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
      expect(parsePolymerizationInstructions(sampleData).template).toBe('NNCB')
      expect(parsePolymerizationInstructions(sampleData).insertions.get('BB')).toBe('N')
      expect(parsePolymerizationInstructions(sampleData).insertions.get('CN')).toBe('C')
      expect(parsePolymerizationInstructions(sampleData).insertions.get('CH')).toBe('B')
    })

    it.each([
      ['CH', 'CBH'],
      ['HH', 'HNH'],
      ['CB', 'CHB'],
      ['NH', 'NCH'],
      ['HB', 'HCB'],
      ['HC', 'HBC'],
      ['HN', 'HCN'],
      ['NN', 'NCN'],
      ['BH', 'BHH'],
      ['NC', 'NBC'],
      ['NB', 'NBB'],
      ['BN', 'BBN'],
      ['BB', 'BNB'],
      ['BC', 'BBC'],
      ['CC', 'CNC'],
      ['CN', 'CCN'],
    ])('can compute the insertions', (input, expectedPolymer) => {
      const instructions = parsePolymerizationInstructions(sampleData)
      expect(polymerize(input, instructions.insertions)).toBe(expectedPolymer)
    })

    it('leaves the polymer intact if there are no matching insertions', () => {
      const instructions = parsePolymerizationInstructions(sampleData)
      expect(polymerize('ZZ', instructions.insertions)).toBe('ZZ')
    })

    it.each([
      [1, 'NCNBCHB'],
      [2, 'NBCCNBBBCBHCB'],
      [3, 'NBBBCNCCNBBNBNBBCHBHHBCHB'],
      [4, 'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB'],
    ])('after %d steps it builds %s', (steps, expectedPolymer) => {
      const instructions = parsePolymerizationInstructions(sampleData)
      expect(runPolymerization(instructions, steps)).toBe(expectedPolymer)
    })

    it('Part 1 solution is 2967', () => {
      const data = fs.readFileSync('./src/14/data/data.txt').toString()
      const instructions = parsePolymerizationInstructions(data)
      const polymer = runPolymerization(instructions, 10)

      expect(part1(polymer)).toBe(2967)
    })
  })
  describe('Part 2', () => {
    //
  })
})
