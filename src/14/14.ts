import * as fs from 'fs'

export type PairCounts = Map<string, number>
interface PolymerizationInstructions {
  template: PairCounts
  insertions: Map<string, [string, string]>
}

export const stringToPairCount = (input: string): PairCounts => {
  const inputSplit = input.split('')
  const counts = inputSplit.reduce((map, character, index) => {
    if (index === inputSplit.length - 1) {
      return map
    }
    const pair = character + inputSplit[index + 1]
    upsert(map, pair, (value = 0) => value + 1)
    return map
  }, new Map())

  return counts
}

export const parsePolymerizationInstructions = (data: string): PolymerizationInstructions => {
  const split = data.split('\n')
  const templatePairCounts = stringToPairCount(split.slice()[0])

  // Remove the empty line between the template and the pair insertions section
  const insertions = split.slice(2).reduce((map, line) => {
    const [pair, insertion] = line.split(' -> ')
    const [left, right] = pair.split('')
    map.set(pair, [left + insertion, insertion + right])
    return map
  }, new Map<string, [string, string]>())

  return { template: templatePairCounts, insertions }
}

const upsert = <K, V>(map: Map<K, V>, key: K, updater: (previous?: V) => V, verbose = false) => {
  if (verbose) {
    console.log('Upsert:', key, 'into:', map)
  }
  const newValue = updater(map.get(key))
  map.set(key, newValue)
}

export const polymerize = (polymer: PairCounts, insertions: Map<string, [string, string]>): PairCounts => {
  const entries = [...polymer.entries()]

  const nextPolymer = new Map()
  entries.forEach(([pair, count]) => {
    if (insertions.has(pair)) {
      const [left, right] = insertions.get(pair)!
      upsert(nextPolymer, left, (value = 0) => value + count, false)
      upsert(nextPolymer, right, (value = 0) => value + count, false)
    } else {
      upsert(nextPolymer, pair, (value = 0) => value + count)
    }
  })

  return nextPolymer
}

export const runPolymerization = ({ template, insertions }: PolymerizationInstructions, steps: number): PairCounts => {
  let polymer = template
  for (let i = 0; i < steps; i++) {
    polymer = polymerize(polymer, insertions)
  }
  return polymer
}

export const frequencyCount = (pairCounts: PairCounts): number[] => {
  let frequencies = Array(26).fill(0)
  const pairEntries = [...pairCounts.entries()]

  console.log(pairEntries)
  for (let i = 0; i < pairEntries.length; i++) {
    const [pair, count] = pairEntries[i]
    const [left, right] = pair.split('')

    const indexOfLeft = left.codePointAt(0)! - 65
    frequencies[indexOfLeft] += count

    const indexOfRight = right.codePointAt(0)! - 65
    frequencies[indexOfRight] += count
  }

  return frequencies.map(it => Math.ceil(it / 2))
}

export const mostMinusLeast = (polymer: PairCounts): number => {
  const frequencies = frequencyCount(polymer)
  const inOrderOfFrequency = frequencies.sort((a, b) => b - a).filter(count => count > 0)
  const mostFrequent = inOrderOfFrequency[0]
  const leastFrequent = inOrderOfFrequency[inOrderOfFrequency.length - 1]

  return mostFrequent - leastFrequent
}

const data = fs.readFileSync('./src/14/data/data.txt').toString()
const instructions = parsePolymerizationInstructions(data)

console.log('Most minus least after 10 rounds', mostMinusLeast(runPolymerization(instructions, 10)))
console.log('Most minus least after 40 rounds', mostMinusLeast(runPolymerization(instructions, 40)))
