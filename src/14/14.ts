import * as fs from 'fs'

interface PolymerizationInstructions {
  template: string
  insertions: Map<string, string>
}

export const parsePolymerizationInstructions = (data: string): PolymerizationInstructions => {
  const split = data.split('\n')
  const template = split.slice()[0]

  // Remove the empty line between the template and the pair insertions section
  const insertions = split.slice(2).reduce((map, line) => {
    const [pair, insertion] = line.split(' -> ')
    map.set(pair, insertion)
    return map
  }, new Map<string, string>())

  return { template, insertions }
}

export const polymerize = (polymer: string, insertions: Map<string, string>): string => {
  // Split the polymer into individual characters
  const splitPolymer = polymer.split('')
  // Then start building the new polymer
  return splitPolymer.reduce((polymer, currentCharacter, index) => {
    // We form pairs by taking the current character and the next one in the array. So we need to bail before reaching the end of the array
    if (index === splitPolymer.length - 1) {
      return polymer + currentCharacter
    }
    const nextCharacter = splitPolymer[index + 1]

    // Look up potential insertions
    const insertion = insertions.get(currentCharacter + nextCharacter)
    if (insertion) {
      // If a insertion is found insert it into the polymer we're building. The trailing end of the pair gets added next time trough here.
      return polymer + currentCharacter + insertion
    } else {
      // ... otherwise just return the polymer as is
      return polymer + currentCharacter
    }
  }, '')
}

export const runPolymerization = ({ template, insertions }: PolymerizationInstructions, steps: number): string => {
  let polymer = template
  for (let i = 0; i < steps; i++) {
    polymer = polymerize(polymer, insertions)
  }
  return polymer
}

const frequencyCount = (data: string): Map<string, number> =>
  data.split('').reduce((map, char) => {
    const currentCount = map.get(char)
    if (currentCount) {
      map.set(char, currentCount + 1)
    } else {
      map.set(char, 1)
    }
    return map
  }, new Map<string, number>())

export const part1 = (polymer: string): number => {
  const frequencies = frequencyCount(polymer)
  const inOrderOfFrequency = [...frequencies.entries()].sort(([_charA, a], [_charB, b]) => b - a)
  const mostFrequent = inOrderOfFrequency[0][1]
  const leastFrequent = inOrderOfFrequency[inOrderOfFrequency.length - 1][1]

  return mostFrequent - leastFrequent
}

const data = fs.readFileSync('./src/14/data/data.txt').toString()
const instructions = parsePolymerizationInstructions(data)
const polymer = runPolymerization(instructions, 10)

console.log('Part 1:', part1(polymer))
