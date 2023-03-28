import type { Queue, Stack, Tape } from '../data-structures'

export * from './interpreter'

export type Storage = Map<string, Memory>
export type States = Map<string, State>

export type Memory = Stack | Queue | Tape

export type _symbol = string

export interface Transition {
	destination: string
	symbol: _symbol
}

export interface TMTransition extends Transition {
	replacement: _symbol
}

export const FSA_COMMANDS = ['SCAN', 'PRINT', 'SCAN RIGHT', 'SCAN LEFT'] as const
export const PDA_COMMANDS = ['READ', 'WRITE'] as const
export const TM_COMMANDS = ['RIGHT', 'LEFT', 'UP', 'DOWN'] as const

export interface FSAState {
	command: typeof FSA_COMMANDS[number]
	transitions: Transition[]
	lineNumber: number
}

export interface PDAState {
	command: typeof PDA_COMMANDS[number]
	memoryName: string
	transitions: Transition[]
	lineNumber: number
}

export interface TMState {
	command: typeof TM_COMMANDS[number]
	memoryName: string
	transitions: TMTransition[]
	lineNumber: number
}

export type State = FSAState | PDAState | TMState

export function isFSAState(x: State): x is FSAState {
	return FSA_COMMANDS.find(c => x.command === c) !== undefined
}

export function isPDAState(x: State): x is PDAState {
	return PDA_COMMANDS.find(c => x.command === c) !== undefined
}

export function isTMState(x: State): x is TMState {
	return TM_COMMANDS.find(c => x.command === c) !== undefined
}

