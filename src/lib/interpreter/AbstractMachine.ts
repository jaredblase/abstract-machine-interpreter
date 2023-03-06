import type { Storage, States, Transition, FSAState, PDAState, TMState, _symbol, Tape } from '.'
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
				if (value.type === 'TAPE' || value.type === '2D_TAPE') {
					inputMemoryId = key
					break
				}
			}

			// no tape was found, add t1 tape
			if (inputMemoryId === undefined) {
				this.#storage.set('t1', { type: 'TAPE', data: [], yPtr: 0, xPtr: 0 })
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

	static cloneNewTimeline(machine: AbstractMachine,) {

	}

	reset(input: string) {
		this.#output = ''
		this.#steps = 0
		this.#currState = this.#states.keys().next().value
		this.#timelines = [this]
		this.#acceptTimeline = {}

		// clear memory
		for (const { data } of this.#storage.values()) {
			data.length = 0
		}
		this.inputMemory.data = [(`#${input}#`).split('')]
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

			// create another machine for the rest of the transitions
			for (let i = 1; i < transitions.length; i++) {
				this.#timelines.push(
					new AbstractMachine(structuredClone(this.#storage), this.#states, this.#timelines.length, transitions[i].destination,
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

		const mem = this.inputMemory

		switch (s.command) {
			case 'SCAN':
			case 'SCAN RIGHT':
				symbol = mem.data[mem.yPtr][++mem.xPtr]
				break

			case 'SCAN LEFT':
				symbol = mem.data[mem.yPtr][--mem.xPtr]
				break
		}

		return (t: Transition) => t.symbol === symbol
	}

	#PDAStep(s: PDAState) {
		const m = this.#storage.get(s.memoryName)

		if (m.type !== 'QUEUE' && m.type !== 'STACK') {
			throw Error('Attempt to add element to append to tape memory!')
		}

		if (s.command === 'WRITE') {
			m.data.push(s.transitions[0].symbol)
			return () => true
		}

		// read
		let symbol: _symbol = m.type === 'QUEUE' ? m.data.shift() : m.data.pop()
		return (t: Transition) => t.symbol === symbol
	}

	#TMStep(s: TMState) {
		return (t: Transition) => true
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
}