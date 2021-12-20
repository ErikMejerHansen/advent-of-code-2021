import * as fs from 'fs'
import { State, StateMachine } from './state-machine'

export interface Package {
  version: number
  type: number
  value?: number
  lengthType?: number
  subPackages?: Package[]
}

interface PackageParserState {
  packages: Package[]
  /**
   * Keeping the input as a sting[] because using `shift()` is easer that substringing
   */
  input: string[]
  /**
   * The group states will build a number of groups until they are finally turned into the
   * value in the lastGroup state
   */
  groups?: string[]
}

enum PackageParserStimulus {
  Version,
  Type,
  Operator,
  LiteralGroup,
  LiteralGroupEnd,
  LengthType,
  SubPacketLength11,
  SubPacketLength15,
  End,
}

const versionState = new State<PackageParserStimulus, PackageParserState>()
versionState.action = (incomingState, next) => {
  if (incomingState.input.length === 0) {
    // No more input! We're done!
    next(incomingState, PackageParserStimulus.End)
  }

  // Take the three bits of the input and parse it as a number
  const versionRaw = incomingState.input.shift()! + incomingState.input.shift()! + incomingState.input.shift()!

  // The version is the first 3 bits, shift them into position to get the version number
  const version = parseInt(versionRaw, 2)
  incomingState.packages.push({ version, type: -1 })

  console.log('Version:', version)

  next(incomingState, PackageParserStimulus.Type)
}

const typeState = new State<PackageParserStimulus, PackageParserState>()
typeState.action = (incomingState, next) => {
  // The package type is the next three bits of the input
  const typeRaw = incomingState.input?.shift()! + incomingState.input?.shift()! + incomingState.input?.shift()
  const type = parseInt(typeRaw, 2)

  // Update the package we're building
  incomingState.packages[incomingState.packages.length - 1].type = type

  if (type === 4) {
    // Get incoming state ready for capturing groups
    incomingState.groups = []
    next(incomingState, PackageParserStimulus.LiteralGroup)
  } else {
    next(incomingState, PackageParserStimulus.Operator)
  }
}

const operatorState = new State<PackageParserStimulus, PackageParserState>()
operatorState.action = (incomingState, next) => {
  // TODO: Need some way of knowing that we'll parse children... and when we're done.
  // Child count? remaining bit count?
  next(incomingState, PackageParserStimulus.LengthType)
}

const groupState = new State<PackageParserStimulus, PackageParserState>()
groupState.action = (incomingState, next) => {
  const isLastGroupMarker = incomingState.input?.shift()
  const groupValue =
    '' +
    incomingState.input?.shift() +
    incomingState.input?.shift() +
    incomingState.input?.shift() +
    incomingState.input?.shift()

  incomingState.groups?.push(groupValue)

  console.log('Group', groupValue)
  if (isLastGroupMarker === '1') {
    next(incomingState, PackageParserStimulus.LiteralGroup)
  } else {
    next(incomingState, PackageParserStimulus.LiteralGroupEnd)
  }
}

const lastGroupState = new State<PackageParserStimulus, PackageParserState>()
lastGroupState.action = (incomingState, next) => {
  // The last group stops at a byte boundary, but we might have some dangle 0's we need to get rid of
  incomingState.input.splice(0, incomingState.input.length % 8)

  incomingState.packages[incomingState.packages.length - 1].value = parseInt(incomingState.groups!.join(''), 2)
  console.log('Group end: Literal value:', incomingState.packages[incomingState.packages.length - 1].value)

  next(incomingState, PackageParserStimulus.Version)
}

const lengthTypeState = new State<PackageParserStimulus, PackageParserState>()
lengthTypeState.action = (incomingState, next) => {
  console.log('Length type')
  const lengthTypeRaw = incomingState.input.shift()!
  const lengthType = parseInt(lengthTypeRaw, 2)
  incomingState.packages[incomingState.packages.length - 1].lengthType = lengthType
}

const subPacketLength11State = new State<PackageParserStimulus, PackageParserState>()
subPacketLength11State.action = (incomingState, _next) => {}

const subPacketLength15State = new State<PackageParserStimulus, PackageParserState>()
subPacketLength15State.action = (incomingState, _next) => {}

const endState = new State<PackageParserStimulus, PackageParserState>()
endState.action = (incomingState, _next) => {}

export const buildStateMachine = (): StateMachine<PackageParserStimulus, PackageParserState> => {
  const stateMachine = new StateMachine<PackageParserStimulus, PackageParserState>(versionState)
  stateMachine.transitions = new Map([
    [PackageParserStimulus.End, endState],
    [PackageParserStimulus.SubPacketLength11, subPacketLength11State],
    [PackageParserStimulus.SubPacketLength15, subPacketLength15State],
    [PackageParserStimulus.LengthType, lengthTypeState],
    [PackageParserStimulus.LiteralGroup, groupState],
    [PackageParserStimulus.LiteralGroupEnd, lastGroupState],
    [PackageParserStimulus.Operator, operatorState],
    [PackageParserStimulus.Type, typeState],
    [PackageParserStimulus.Version, versionState],
  ])

  return stateMachine
}
// input.split('').map(it=> parseInt(it, 16).toString(2)).join('')

export const toBinaryRepresentation = (input: string): string[] =>
  input
    .split('')
    .map(hex => new String(parseInt(hex, 16).toString(2)).padStart(4, '0').split(''))
    .flat()

const data = fs.readFileSync('./src/16/data/data.txt').toString()
