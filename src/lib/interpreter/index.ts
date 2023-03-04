export * from './interpreter'

export type MachineMemory = Map<string, Memory>
export type MachineTransitions = Map<State, Command>

export type Memory = {
	type: 'STACK' | 'QUEUE' | 'TAPE'
	data: string[]
}

export type State = string
export type _symbol = string

export interface Transition {
	destination: State
	symbol: _symbol
}

export interface TapeTransition extends Transition {
	replacement: _symbol
}

interface BaseCommand {
	type: string
}

export const FSA_COMMANDS = ['SCAN', 'PRINT', 'SCAN RIGHT', 'SCAN LEFT'] as const
export const PDA_COMMANDS = ['READ', 'WRITE'] as const
export const TM_COMMANDS = ['RIGHT', 'LEFT', 'UP', 'DOWN'] as const

export interface FSACommand extends BaseCommand {
	type: typeof FSA_COMMANDS[number]
	to: Transition[]
}

export interface PDACommand extends BaseCommand {
	type: typeof PDA_COMMANDS[number]
	memoryName: string
	to: Transition[]
}

export interface TMCommand extends BaseCommand {
	type: typeof TM_COMMANDS[number]
	memoryName: string
	to: TapeTransition[]
}

export type Command = FSACommand | PDACommand | TMCommand

export function isFSACommand(x: Command): x is FSACommand {
	return FSA_COMMANDS.find(c => x.type === c) !== undefined
}

export function isPDACommand(x: Command): x is PDACommand {
	return PDA_COMMANDS.find(c => x.type === c) !== undefined
}

export function isTMCommand(x: Command): x is TMCommand {
	return TM_COMMANDS.find(c => x.type === c) !== undefined
}

