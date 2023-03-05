import type { Storage, States, Transition, FSAState, PDAState, TMState } from '.'
import { isFSAState, isPDAState } from '.'

type AcceptTimeline = {
	idx?: number
}


/**
 * Implementation of a non-deterministic abstract machine holding its own set of timelines
 */
export class AbstractMachine {
	#id: number
	#storage: Storage
	#states: States
	#currState: string
	#steps = 0
	#ptr = 0
	#input: string
	#output: string
	#timelines: AbstractMachine[]
	#acceptTimeline: AcceptTimeline

	constructor(storage: Storage, states: States, id?: number, currState?: string, steps?: number,
		ptr?: number, input?: string, output?: string, timelines?: AbstractMachine[], acceptTimeline?: AcceptTimeline) {
		this.#storage = storage
		this.#states = states
		this.#id = id ?? 0

		if (currState) {
			this.#currState = currState
			this.#steps = steps
			this.#ptr = ptr
			this.#input = input
			this.#output = output
			this.#timelines = timelines
			this.#acceptTimeline = acceptTimeline
		}
	}

	reset(input: string) {
		this.#input = `#${input}#`
		this.#ptr = 0
		this.#output = ''
		this.#steps = 0
		this.#currState = this.#states.keys().next().value
		this.#timelines = [this]
		this.#acceptTimeline = {}

		// clear memory
		for (const { data } of this.#storage.values()) {
			data.length = 0
		}
	}

	step() {
		if (!this.isGlobalHalt) {
			for (let i = this.#timelines.length - 1; i >= 0; i--) {
				this.#timelines[i].run()
			}
		}

		for (let i = this.#timelines.length - 1; i >= 0; i--) {
			if (this.#timelines[i].isAccepted) {
				this.#acceptTimeline.idx = this.#timelines[i].#id
				break
			}
		}
	}

	run() {
		if (this.#ptr + 1 > this.#input.length) {
			this.#currState = 'reject'
		}

		if (this.isHalted) return

		const s = this.#states.get(this.#currState)
		let test: (t: Transition) => boolean

		if (isFSAState(s)) {
			test = this.#FSAStep(s)
		} else if (isPDAState(s)) {
			this.#PDAStep(s)
		} else {
			test = this.#TMStep()
		}

		this.#steps++
		const transitions = s.transitions.filter(test)

		// no valid transitions
		if (transitions.length === 0) {
			this.#currState = 'reject'
		} else {
			// current machine takes first possible transition
			this.#currState = transitions[0].destination

			// create another machine for the rest of the transitions
			for (let i = 1; i < transitions.length; i++) {
				this.#timelines.push(
					new AbstractMachine(structuredClone(this.#storage), this.#states, this.#timelines.length, transitions[i].destination,
						this.#steps, this.#ptr, this.#input, this.#output, this.#timelines, this.#acceptTimeline)
				)
			}
		}
	}

	#FSAStep(s: FSAState) {
		let symbol: string

		if (s.command === 'PRINT') {
			this.#output += s.transitions[0].symbol
			return () => true
		}

		switch (s.command) {
			case 'SCAN':
			case 'SCAN RIGHT':
				symbol = this.#input[++this.#ptr]
				break

			case 'SCAN LEFT':
				symbol = this.#input[--this.#ptr]
				break
		}

		return (t: Transition) => t.symbol === symbol
	}

	#PDAStep(s: PDAState) {
		const m = this.#storage.get(s.memoryName)

		if (s.command === 'WRITE') {
			m.data.push(s.transitions[0].symbol)
			return this.#currState = s.transitions[0].destination
		}

		if (m.type === 'QUEUE') {
			if (m.data.shift() !== s.transitions[0].symbol) {
				this.#currState = 'rejected'
			}
		} else if (m.data.pop() !== s.transitions[0].symbol) {
			this.#currState = 'rejected'
		}

		this.#currState = s.transitions[0].destination
	}

	#TMStep() {
		return (t: Transition) => true
	}

	get currState() {
		return this.#currState
	}

	get steps() {
		return this.#steps
	}

	get pointer() {
		return this.#ptr
	}

	get input() {
		return this.#input
	}

	get output() {
		return this.#output
	}

	get storage() {
		return this.#storage
	}

	get isHalted() {
		return this.#currState === 'accept' || this.#currState === 'reject'
	}

	get isGlobalHalt() {
		if (this.#acceptTimeline.idx !== undefined) {
			return true
		}

		return this.#timelines.find(t => t.#currState !== 'reject') === undefined
	}

	get isAccepted() {
		return this.#currState === 'accept'
	}

	get timelines() {
		return this.#timelines
	}

	get id() {
		return this.#id
	}

	get acceptedTimeline() {
		return this.#acceptTimeline.idx
	}
}