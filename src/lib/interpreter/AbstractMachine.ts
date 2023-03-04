import type { MachineMemory, MachineTransitions, State,FSACommand, PDACommand } from '.'
import { isFSACommand, isPDACommand } from '.'

export class AbstractMachine {
	#memory: MachineMemory
	#transitions: MachineTransitions
	#currState: State
	#initState: State
	#steps = 0
	#ptr = 0
	#input: string
	#output: string

	constructor(memory: MachineMemory, transitions: MachineTransitions) {
		this.#memory = memory
		this.#transitions = transitions
		this.#initState = transitions.keys().next().value
	}

	reset(input: string) {
		if (!input) throw Error('Input cannot be empty!')

		this.#input = `#${input}#`
		this.#ptr = 0
		this.#output = ''
		this.#steps = 0
		this.#currState = this.#initState

		// clear memory
		for (const { data } of this.#memory.values()) {
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

		const t = this.#transitions.get(this.#currState)
		
		if (isFSACommand(t)) {
			this.#FSAStep(t)
		} else if (isPDACommand(t)) {
			this.#PDAStep(t)
		} else {
			this.#TMStep()
		}

		this.#steps++
	}

	#FSAStep(command: FSACommand) {
		let symbol: string

		if (command.type === 'PRINT') {
			this.#output += command.to[0].symbol
			this.#currState = command.to[0].destination
			return
		}

		switch (command.type) {
			case 'SCAN':
			case 'SCAN RIGHT':
				symbol = this.#input[++this.#ptr]
				break

			case 'SCAN LEFT':
				symbol = this.#input[--this.#ptr]
				break
		}

		this.#currState = command.to.find(c => c.symbol === symbol).destination
	}

	#PDAStep(command: PDACommand) {
		const m = this.#memory.get(command.memoryName)

		if (command.type === 'WRITE') {
			m.data.push(command.to[0].symbol)
			return this.#currState = command.to[0].destination
		}

		if (m.type === 'QUEUE') {
			if (m.data.shift() !== command.to[0].symbol) {
				this.#currState = 'rejected'
			}
		} else if (m.data.pop() !== command.to[0].symbol) {
			this.#currState = 'rejected'
		}

		this.#currState = command.to[0].destination
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
		return this.#memory
	}

	get isHalted() {
		return this.#currState === 'accept' || this.#currState === 'reject'
	}

	get isAccepted() {
		return this.#currState === 'accept'
	}
}