import { writable } from 'svelte/store'
import type { InterpreterState, Command, Memory, State, _symbol } from '../lib/interpreter'

export let input = writable<_symbol[]>([])
export let currState = writable('')
export let steps = createCounter()
export let memory = createMemory()
export let transitions = createTransitions()
export let machine = createMachine()

function createMachine() {
	const { subscribe, set } = writable<InterpreterState>('PAUSED')

	function play() {
		set('RUNNING')
	}

	function pause() {
		set('PAUSED')
	}

	function step() {
		set('STEPPING')
	}

	function reset() {
		set('INITIALIZED')
	}

	return {
		subscribe,
		play,
		pause,
		stop,
		reset
	}
}

function createMemory() {
	const { subscribe, update } = writable(new Map<_symbol, Memory>())

	function add(name: string, type: Memory['type']) {
		update(x => x.set(name, { type, data: [] }))
	}

	function clear() {
		update(m => (m.clear(), m))
	}

	return {
		subscribe,
		add,
		clear,
	}
}

function createTransitions() {
	const { subscribe, update } = writable(new Map<State, Command>())

	function add(start: State, command: Command) {
		update(m => m.set(start, command))
	}

	function clear() {
		update(m => (m.clear(), m))
	}

	return {
		subscribe,
		add,
		clear,
	}
}

function createCounter() {
	const { subscribe, update } = writable(0)

	return {
		subscribe,
		increment: () => update(x => x + 1)
	}
}