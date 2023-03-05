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
export let timelines = writable<AbstractMachine[]>([])

export function update(m: AbstractMachine) {
	input.set(m.input)
	currState.set(m.currState)
	steps.set(m.steps)
	idx.set(m.pointer)
	output.set(m.output)
	memory.set(m.storage)
	isHalted.set(m.isHalted || m.isGlobalHalt)
	timelines.set(m.timelines)
}
