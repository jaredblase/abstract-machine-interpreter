import type { Storage, States, State,FSAState, PDAState } from '.'
import { isFSAState, isPDAState } from '.'

export class AbstractMachine {
	#storage: Storage
	#states: States
	#currState: string
	#initState: string
	#steps = 0
	#ptr = 0
	#input: string
	#output: string

	constructor(storage: Storage, states: States) {
		this.#storage = storage
		this.#states = states
		this.#initState = states.keys().next().value
	}

	reset(input: string) {
		if (!input) throw Error('Input cannot be empty!')

		this.#input = `#${input}#`
		this.#ptr = 0
		this.#output = ''
		this.#steps = 0
		this.#currState = this.#initState

		// clear memory
		for (const { data } of this.#storage.values()) {
			data.length = 0
		}
	}

	step() {
		if (this.#currState === undefined) {
			throw Error('Machine was not initialized!')
		}

		if (this.#ptr + 1 > this.#input.length) {
			this.#currState = 'reject'
		}

		if (this.isHalted) return

		const t = this.#states.get(this.#currState)
		
		if (isFSAState(t)) {
			this.#FSAStep(t)
		} else if (isPDAState(t)) {
			this.#PDAStep(t)
		} else {
			this.#TMStep()
		}

		this.#steps++
	}

	#FSAStep(command: FSAState) {
		let symbol: string

		if (command.command === 'PRINT') {
			this.#output += command.transitions[0].symbol
			this.#currState = command.transitions[0].destination
			return
		}

		switch (command.command) {
			case 'SCAN':
			case 'SCAN RIGHT':
				symbol = this.#input[++this.#ptr]
				break

			case 'SCAN LEFT':
				symbol = this.#input[--this.#ptr]
				break
		}

		this.#currState = command.transitions.find(c => c.symbol === symbol).destination
	}

	#PDAStep(command: PDAState) {
		const m = this.#storage.get(command.memoryName)

		if (command.command === 'WRITE') {
			m.data.push(command.transitions[0].symbol)
			return this.#currState = command.transitions[0].destination
		}

		if (m.type === 'QUEUE') {
			if (m.data.shift() !== command.transitions[0].symbol) {
				this.#currState = 'rejected'
			}
		} else if (m.data.pop() !== command.transitions[0].symbol) {
			this.#currState = 'rejected'
		}

		this.#currState = command.transitions[0].destination
	}

	#TMStep() {

	}

	getCurrState() {
		return this.#currState
	}

	getSteps() {
		return this.#steps
	}

	getPointer() {
		return this.#ptr
	}

	getInput() {
		return this.#input
	}

	getOutput() {
		return this.#output
	}

	getMemory() {
		return this.#storage
	}

	get isHalted() {
		return this.#currState === 'accept' || this.#currState === 'reject'
	}

	get isAccepted() {
		return this.#currState === 'accept'
	}
}