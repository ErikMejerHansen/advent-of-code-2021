import { countIdentifiableOutputs, decodeOutput, parseSevenSegmentData, SevenSegmentLine, sumOfOutputs } from '../08'

describe('Dec 08', () => {
  const sampleData =
    'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe\n' +
    'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc\n' +
    'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg\n' +
    'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb\n' +
    'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea\n' +
    'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb\n' +
    'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe\n' +
    'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef\n' +
    'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb\n' +
    'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce'
  describe('Part 1', () => {
    it('can parses to input and output structure', () => {
      expect(parseSevenSegmentData(sampleData)[0]).toStrictEqual({
        input: ['be', 'cfbegad', 'cbdgef', 'fgaecd', 'cgeb', 'fdcge', 'agebfd', 'fecdb', 'fabcd', 'edb'],
        output: ['fdgacbe', 'cefdb', 'cefbgd', 'gcbe'],
      })
    })

    it('counts 26 instances of 1, 4, 7, 8 in the sample data outputs', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(sampleData)

      expect(countIdentifiableOutputs(lines)).toBe(26)
    })
  })

  describe('Part 2', () => {
    it('should decode a outputs of 5353 on the simple example', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(
        'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'
      )
      expect(decodeOutput(lines[0])).toBe(5353)
    })
    it('should decode 1, 4, 6, 8 correctly', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(
        'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | ab eafb dab acedgfb'
      )
      expect(decodeOutput(lines[0])).toBe(1478)
    })

    it('should decode 2 correctly', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(
        'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | gcdfa gcdfa gcdfa gcdfa'
      )
      expect(decodeOutput(lines[0])).toBe(2222)
    })

    it('should decode 3 correctly', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(
        'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | fbcad fbcad fbcad fbcad'
      )
      expect(decodeOutput(lines[0])).toBe(2222)
    })

    it('should decode 5 correctly', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(
        'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfbe cdfbe cdfbe cdfbe'
      )
      expect(decodeOutput(lines[0])).toBe(5555)
    })

    it('should decode 6 correctly', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(
        'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfgeb cdfgeb cdfgeb cdfgeb'
      )
      expect(decodeOutput(lines[0])).toBe(6666)
    })

    it('should decode 9 correctly', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(
        'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cefabd cefabd cefabd cefabd'
      )
      expect(decodeOutput(lines[0])).toBe(9999)
    })

    it('should decode 0 correctly', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(
        'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cagedb cagedb cagedb cagedb'
      )
      expect(decodeOutput(lines[0])).toBe(0)
    })

    it('should decode output of each line of the sample data to the expected result', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(sampleData)
      expect(decodeOutput(lines[0])).toBe(8394)
      expect(decodeOutput(lines[1])).toBe(9781)
      expect(decodeOutput(lines[2])).toBe(1197)
      expect(decodeOutput(lines[3])).toBe(9361)
      expect(decodeOutput(lines[4])).toBe(4873)
      expect(decodeOutput(lines[5])).toBe(8418)
      expect(decodeOutput(lines[6])).toBe(4548)
      expect(decodeOutput(lines[7])).toBe(1625)
      expect(decodeOutput(lines[8])).toBe(8717)
      expect(decodeOutput(lines[9])).toBe(4315)
    })

    it('should decode a outputs of 61229 on the sample data', () => {
      const lines: SevenSegmentLine[] = parseSevenSegmentData(sampleData)
      expect(sumOfOutputs(lines)).toBe(61229)
    })
  })
})
