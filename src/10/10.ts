import * as fs from 'fs'

interface SyntaxCheckResult {
  mismatch?: string
  unmatched?: string[]
}

export const splitLines = (data: string): string[] => data.split('\n')

const checkParenMatch = (a?: string, b?: string): boolean => {
  switch (a) {
    case '(':
      return b === ')'
    case '[':
      return b === ']'
    case '{':
      return b === '}'
    case '<':
      return b === '>'
    default:
      throw new Error(`Could not check ${a} and ${b} for parens match`)
  }
}

const parenScore = new Map<string, number>([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137],
])

export const scoreLine = (line: string): number => {
  const mismatch = findUnmatched(line).mismatch
  return mismatch ? parenScore.get(mismatch)! : 0
}

export const calculateSyntaxScore = (lines: string[]): number =>
  lines.reduce((score, line) => score + scoreLine(line), 0)

export const findUnmatched = (line: string): SyntaxCheckResult => {
  const openingParens = ['(', '[', '{', '<']
  const parens = new Array<string>()

  // Push the first char to the parens stack to get us started
  parens.push(line.charAt(0))
  // The run trough the rest of the string one character at a time to check that parens match
  for (let char of line.substring(1)) {
    if (openingParens.includes(char)) {
      // The current character is an opening paren so we just push it to the parens stack and move on to the next char
      parens.push(char)
    } else {
      // We're looking at a closing paren. Lets see if it matches the top of the parens stack
      if (!checkParenMatch(parens.pop(), char)) {
        // char did not match expectations. Return a mismatch SyntaxCheckResult
        return { mismatch: char }
      }
    }
  }
  // We've passed trough the whole line without finding a mistake
  return { unmatched: parens }
}

export const autoComplete = (line: string): string => {
  const unmatched = findUnmatched(line)
    .unmatched?.reverse()
    .map(char => {
      switch (char) {
        case '(':
          return ')'
        case '[':
          return ']'
        case '{':
          return '}'
        case '<':
          return '>'
      }
    })

  return unmatched ? unmatched.join('') : ''
}

const calculateAutoCompleteLineScore = (completion: string): number => {
  const autoCompletePointsValue = new Map([
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4],
  ])
  return completion.split('').reduce((score, char) => {
    return score * 5 + autoCompletePointsValue.get(char)!
  }, 0)
}

export const middleScore = (lines: string[]): number => {
  // Filter out any line that contains a syntax error by excluding any line with a syntax score not 0
  const validLines = lines.filter(line => scoreLine(line) === 0)
  // Find the autocomplete sequences and calculate their autocompletion score
  const scores = validLines.map(autoComplete).map(calculateAutoCompleteLineScore)

  // and finally find and return the middle score
  return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]
}

const data = fs.readFileSync('./src/10/data/data.txt').toString()
const syntaxScore = calculateSyntaxScore(splitLines(data))

console.log('The syntax score is:', syntaxScore)
console.log('The autocomplete score is:', middleScore(splitLines(data)))
