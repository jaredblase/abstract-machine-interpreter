import type { Storage, States, Transition, FSAState, PDAState, TMState, _symbol, TMTransition } from '.'
import { isFSAState, isPDAState, isTMState } from '.'
import { Tape } from '../data-structures'

type AcceptTimeline = {
	idx?: number
}

/**
 * Implementation of a non-deterministic abstract machine holding its own set of timelines
 */
export class AbstractMachine {
	private _id: number
	private _storage: Storage
	private _states: States
	private _currState: string
	private _prevState: string
	private _steps = 0
	private _inputMemoryId: string
	private _output: string
	private _timelines: AbstractMachine[]
	private _acceptedTimeline: AcceptTimeline
	private _isInputTapeGenerated: boolean

	constructor(storage: Storage, states: States, id?: number, currState?: string, prevState?: string, steps?: number,
		output?: string, timelines?: AbstractMachine[], acceptTimeline?: AcceptTimeline, inputMemoryId?: string, isInputTapeGenerated?: boolean) {
		this._storage = storage
		this._states = states
		this._id = id ?? 0
		this._isInputTapeGenerated = isInputTapeGenerated ?? false

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
				this._storage.set('t1', new Tape('TAPE'))
				inputMemoryId = 't1'
				this._isInputTapeGenerated = true
			}
		}

		this._inputMemoryId = inputMemoryId

		if (currState) {
			this._currState = currState
			this._prevState = prevState
			this._steps = steps
			this._output = output
			this._timelines = timelines
			this._acceptedTimeline = acceptTimeline
		}
	}

	reset(input: string) {
		this._output = ''
		this._steps = 0
		this._currState = this._states.keys().next().value
		this._timelines = [this]
		this._acceptedTimeline = {}

		// clear memory
		for (const m of this._storage.values()) {
			m.clear()
		}
		this.inputMemory.set(`#${input}#`)
	}

	step() {
		if (!this.isGlobalHalt) {
			for (let i = this._timelines.length - 1; i >= 0; i--) {
				this._timelines[i].run()
			}
		}

		for (let i = this._timelines.length - 1; i >= 0; i--) {
			if (this._timelines[i].isAccepted) {
				this._acceptedTimeline.idx = this._timelines[i]._id
				break
			}
		}
	}

	private run() {
		if (this.isHalted) return

		const s = this._states.get(this._currState)
		let test: (t: Transition) => boolean

		if (isFSAState(s)) {
			test = this.FSAStep(s)
		} else if (isPDAState(s)) {
			test = this.PDAStep(s)
		} else {
			test = this.TMStep(s)
		}

		this._steps++
		this._prevState = this._currState
		const transitions = s.transitions.filter(test)

		// no valid transitions
		if (transitions.length === 0) {
			return this._currState = 'reject'
		}

		// current machine takes first possible transition
		this._currState = transitions[0].destination
		const output = this._output

		// write to tape
		if (isTMState(s)) {
			(this._storage.get(s.memoryName) as Tape).write((transitions[0] as TMTransition).replacement)
		} else if (s.command == 'PRINT') {
			this._output += s.transitions[0].symbol
		}

		// create another machine for the rest of the transitions
		for (let i = 1; i < transitions.length; i++) {
			const storage: Storage = new Map()

			for (const [key, value] of this._storage) {
				storage.set(key, value.clone())
			}

			let temp = output

			// write to tape in cloned storage
			if (isTMState(s)) {
				(storage.get(s.memoryName) as Tape).write((transitions[i] as TMTransition).replacement)
			} else if (s.command == 'PRINT') {
				temp += transitions[i].symbol
			}

			this._timelines.push(
				new AbstractMachine(storage, this._states, this._timelines.length, transitions[i].destination, this._prevState,
					this._steps, temp, this._timelines, this._acceptedTimeline, this._inputMemoryId, this._isInputTapeGenerated)
			)
		}
	}

	private FSAStep(s: FSAState) {
		let symbol: string

		if (s.command === 'PRINT') return () => true

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

	private PDAStep(s: PDAState) {
		const m = this._storage.get(s.memoryName)

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

	private TMStep(s: TMState) {
		const m = this._storage.get(s.memoryName) as Tape
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
		return this._states.get(this._currState)
	}

	get currStateName() {
		return this._currState
	}

	get prevState() {
		return this._states.get(this._prevState)
	}

	get prevStateName() {
		return this._prevState
	}

	get steps() {
		return this._steps
	}

	get inputMemoryId() {
		return this._inputMemoryId
	}

	get inputMemory() {
		return this._storage.get(this._inputMemoryId) as Tape
	}

	get output() {
		return this._output
	}

	get storage() {
		return this._storage
	}

	get isHalted() {
		return this._currState === 'accept' || this._currState === 'reject'
	}

	get isGlobalHalt() {
		if (this._acceptedTimeline.idx !== undefined) {
			return true
		}

		return this._timelines.find(t => t._currState !== 'reject') === undefined
	}

	get isAccepted() {
		return this._currState === 'accept'
	}

	get timelines() {
		return this._timelines
	}

	get id() {
		return this._id
	}

	get acceptedTimeline() {
		return this._acceptedTimeline.idx
	}

	get isInputTapeGenerated() {
		return this._isInputTapeGenerated
	}

	get states() {
		return this._states
	}
}