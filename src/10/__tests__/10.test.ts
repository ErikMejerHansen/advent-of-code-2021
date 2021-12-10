import { autoComplete, calculateSyntaxScore, middleScore, scoreLine, splitLines } from '../10'

describe('Dec 10', () => {
  const sampleData =
    '[({(<(())[]>[[{[]{<()<>>\n' +
    '[(()[<>])]({[<{<<[]>>(\n' +
    '{([(<{}[<>[]}>{[]{[(<()>\n' +
    '(((({<>}<{<{<>}{[]{[]{}\n' +
    '[[<[([]))<([[{}[[()]]]\n' +
    '[{[{({}]{}}([{[{{{}}([]\n' +
    '{<[[]]>}<{[{[{[]{()[[[]\n' +
    '[<(<(<(<{}))><([]([]()\n' +
    '<{([([[(<>()){}]>(<<{{\n' +
    '<{([{{}}[<[[[<>{}]]]>[]]'

  describe('Part 1', () => {
    it('calculates a score of 0 for complete lines without errors', () => {
      expect(scoreLine('()')).toBe(0)
      expect(scoreLine('[]')).toBe(0)
      expect(scoreLine('{}')).toBe(0)
      expect(scoreLine('<>')).toBe(0)

      expect(scoreLine('([])')).toBe(0)
      expect(scoreLine('[{}]')).toBe(0)
      expect(scoreLine('{<>}')).toBe(0)
      expect(scoreLine('<()>')).toBe(0)
    })

    it('calculates a score of 0 for incomplete lines', () => {
      expect(scoreLine('(')).toBe(0)
      expect(scoreLine('[')).toBe(0)
      expect(scoreLine('{')).toBe(0)
      expect(scoreLine('<')).toBe(0)

      expect(scoreLine('([]')).toBe(0)
      expect(scoreLine('[{}')).toBe(0)
      expect(scoreLine('{<>')).toBe(0)
      expect(scoreLine('<()')).toBe(0)
    })

    it.each([
      [3, ')', '{)'],
      [57, ']', '{]'],
      [1197, '}', '[}'],
      [25137, '>', '{>'],
      [1197, '}', '{([(<{}[<>[]}>{[]{[(<()>'],
      [3, ')', '[[<[([]))<([[{}[[()]]]'],
      [57, ']', '[{[{({}]{}}([{[{{{}}([]'],
      [3, ')', '[<(<(<(<{}))><([]([]()'],
      [25137, '>', '<{([([[(<>()){}]>(<<{{'],
    ])('it calculates a score of %d when the unexpected character is a "%s"', (score, _expected, sampleLine) => {
      expect(scoreLine(sampleLine)).toBe(score)
    })

    it('calculates the score of the sample data to be 26397', () => {
      const lines = splitLines(sampleData)
      expect(calculateSyntaxScore(lines)).toBe(26397)
    })
  })

  describe('Part 2', () => {
    it.each([
      ['[({(<(())[]>[[{[]{<()<>>', '}}]])})]'],
      ['[(()[<>])]({[<{<<[]>>(', ')}>]})'],
      ['(((({<>}<{<{<>}{[]{[]{}', '}}>}>))))'],
      ['{<[[]]>}<{[{[{[]{()[[[]', ']]}}]}]}>'],
      ['<{([{{}}[<[[[<>{}]]]>[]]', '])}>'],
    ])('it completes "%s" with "%s"', (line, completion) => {
      expect(autoComplete(line)).toBe(completion)
    })
  })

  it('Finds a middle score of 288957 for the sample data', () => {
    expect(middleScore(splitLines(sampleData))).toBe(288957)
  })
})
