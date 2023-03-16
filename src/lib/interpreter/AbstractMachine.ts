import { type Storage, type States, type Transition, type FSAState, type PDAState, type TMState, type _symbol, isTMState, type TMTransition } from '.'
import { isFSAState, isPDAState } from '.'
import { Tape } from '../data-structures'

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
	#inputMemoryId: string
	#output: string
	#timelines: AbstractMachine[]
	#acceptTimeline: AcceptTimeline
	#isInputTapeGenerated: boolean

	constructor(storage: Storage, states: States, id?: number, currState?: string, steps?: number,
		output?: string, timelines?: AbstractMachine[], acceptTimeline?: AcceptTimeline, inputMemoryId?: string, isInputTapeGenerated?: boolean) {
		this.#storage = storage
		this.#states = states
		this.#id = id ?? 0
		this.#isInputTapeGenerated = isInputTapeGenerated ?? false

		if (inputMemoryId === undefined) {
			// look for the first tape
			for (const [key, value] of storage) {
				if (value instanceof Tape) {
					inputMemoryId = key
					break
				}
			}

			// no tape was found, add t1 tape
			if (inputMemoryId === undefined) {
				this.#storage.set('t1', new Tape('TAPE'))
				inputMemoryId = 't1'
				this.#isInputTapeGenerated = true
			}
		}

		this.#inputMemoryId = inputMemoryId

		if (currState) {
			this.#currState = currState
			this.#steps = steps
			this.#output = output
			this.#timelines = timelines
			this.#acceptTimeline = acceptTimeline
		}
	}

	reset(input: string) {
		this.#output = ''
		this.#steps = 0
		this.#currState = this.#states.keys().next().value
		this.#timelines = [this]
		this.#acceptTimeline = {}

		// clear memory
		for (const m of this.#storage.values()) {
			m.clear()
		}
		this.inputMemory.set(`#${input}#`)
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
		if (this.isHalted) return

		const s = this.#states.get(this.#currState)
		let test: (t: Transition) => boolean

		if (isFSAState(s)) {
			test = this.#FSAStep(s)
		} else if (isPDAState(s)) {
			test = this.#PDAStep(s)
		} else {
			test = this.#TMStep(s)
		}

		this.#steps++
		const transitions = s.transitions.filter(test)

		// no valid transitions
		if (transitions.length === 0) {
			this.#currState = 'reject'
		} else {
			// current machine takes first possible transition
			this.#currState = transitions[0].destination

			// write to tape
			if (isTMState(s)) {
				(this.#storage.get(s.memoryName) as Tape).write((transitions[0] as TMTransition).replacement)
			}

			// create another machine for the rest of the transitions
			for (let i = 1; i < transitions.length; i++) {
				const storage: Storage = new Map()

				for (const [key, value] of this.#storage) {
					storage.set(key, value.clone())
				}

				// write to tape in cloned storage
				if (isTMState(s)) {
					(storage.get(s.memoryName) as Tape).write((transitions[i] as TMTransition).replacement)
				}

				this.#timelines.push(
					new AbstractMachine(storage, this.#states, this.#timelines.length, transitions[i].destination,
						this.#steps, this.#output, this.#timelines, this.#acceptTimeline, this.#inputMemoryId, this.#isInputTapeGenerated)
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
				symbol = this.inputMemory.right()
				break

			case 'SCAN LEFT':
				symbol = this.inputMemory.left()
				break
		}

		return (t: Transition) => t.symbol === symbol
	}

	#PDAStep(s: PDAState) {
		const m = this.#storage.get(s.memoryName)

		if (m instanceof Tape) {
			throw Error('Attempt to add element to append to tape memory!')
		}

		if (s.command === 'WRITE') {
			m.write(s.transitions[0].symbol)
			return () => true
		}

		// read
		let symbol: _symbol = m.read()
		return (t: Transition) => t.symbol === symbol
	}

	#TMStep(s: TMState) {
		const m = this.#storage.get(s.memoryName) as Tape
		let symbol: _symbol

		switch (s.command) {
			case 'RIGHT':
				symbol = m.right()
				break

			case 'LEFT':
				symbol = m.left()
				break

			case 'UP':
				symbol = m.up()
				break

			case 'DOWN':
				symbol = m.down()
				break
		}

		return (t: Transition) => t.symbol === symbol
	}

	get currState() {
		return this.#currState
	}

	get steps() {
		return this.#steps
	}

	get inputMemoryId() {
		return this.#inputMemoryId
	}

	get inputMemory() {
		return this.#storage.get(this.#inputMemoryId) as Tape
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

	get isInputTapeGenerated() {
		return this.#isInputTapeGenerated
	}

	get states() {
		return this.#states
	}
}