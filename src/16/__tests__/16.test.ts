import { State, StateMachine } from '../state-machine'

describe('Dec 16', () => {
  describe('the state-machine', () => {
    enum Stimulus {
      A,
      B,
      End,
    }
    interface CollectedState {
      nodesVisited: string[]
    }
    it('can transition from the start to the end state in a two state machine', () => {
      /* Build a simple two state state-machine

        ┌────────┐         ┌───────┐
        │ Start  ├──"End"─►│ End   │
        └────────┘         └───────┘
      */

      const startState = new State<Stimulus, CollectedState>()
      startState.action = (incomingState, next) => {
        incomingState.nodesVisited.push('Start')
        next(incomingState, Stimulus.End)
      }

      const endState = new State<Stimulus, CollectedState>()
      endState.action = (incomingState, _next) => {
        incomingState.nodesVisited.push('End')
      }

      const state = { nodesVisited: new Array<string>() }
      const stateMachine = new StateMachine<Stimulus, CollectedState>(startState)
      stateMachine.transitions = new Map([[Stimulus.End, endState]])

      stateMachine.run(state)

      expect(state).toStrictEqual({ nodesVisited: ['Start', 'End'] })
    })

    it('can transition between multiple states', () => {
      /*
       * Build a four state machine
       *                 "A"
       *           ┌─────────────►A
       *           │              │
       *      ┌────┴───┐          │               ┌───────┐
       *      │ Start  │          │               │ End   │
       *      └────┬───┘          │               └───────┘
       *           │              │                   ▲
       *           │              │                   │
       *           │    "B"       ▼       "End"       │
       *           └─────────────►B───────────────────┘
       *
       */

      const startState = new State<Stimulus, CollectedState>()
      startState.action = (incomingState, next) => {
        incomingState.nodesVisited.push('Start')
        console.log('->Start->')
        next(incomingState, Stimulus.A)
      }

      const aState = new State<Stimulus, CollectedState>()
      aState.action = (incomingState, next) => {
        incomingState.nodesVisited.push('A')
        console.log('->A')
        next(incomingState, Stimulus.B)
      }

      const bState = new State<Stimulus, CollectedState>()
      bState.action = (incomingState, next) => {
        incomingState.nodesVisited.push('B')
        console.log('->B')
        next(incomingState, Stimulus.End)
      }

      const endState = new State<Stimulus, CollectedState>()
      endState.action = (incomingState, _next) => {
        console.log('->End')
        incomingState.nodesVisited.push('End')
      }

      const state = { nodesVisited: new Array<string>() }

      const stateMachine = new StateMachine<Stimulus, CollectedState>(startState)
      stateMachine.transitions = new Map([
        [Stimulus.End, endState],
        [Stimulus.B, bState],
        [Stimulus.A, aState],
      ])
      stateMachine.run(state)
      console.log(state)
      expect(state).toStrictEqual({ nodesVisited: ['Start', 'A', 'B', 'End'] })
    })
  })
  describe('Part 1', () => {})

  describe('Part 2', () => {
    //
  })
})
