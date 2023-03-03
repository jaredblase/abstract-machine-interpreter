import { writable } from 'svelte/store'
import type { Command, Memory, State, _symbol } from '../lib/interpreter'

export let input = writable<_symbol[]>([])
export let memory = createMemory()
export let transitions = createTransitions()

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
