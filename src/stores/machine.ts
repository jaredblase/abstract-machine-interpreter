import { writable } from 'svelte/store'
import type { Storage } from '../lib/interpreter'
import type { AbstractMachine } from '../lib/interpreter/AbstractMachine'

export let input = writable('')
export let currState = writable('')
export let steps = writable(0)
export let idx = writable(0)
export let output = writable('')
export let memory = writable<Storage>(new Map())
export let isHalted = writable(true)

export function update(m: AbstractMachine) {
	input.set(m.getInput())
	currState.set(m.getCurrState())
	steps.set(m.getSteps())
	idx.set(m.getPointer())
	output.set(m.getOutput())
	memory.set(m.getMemory())
	isHalted.set(m.isHalted)
}
