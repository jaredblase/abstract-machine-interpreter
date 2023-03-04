export * from './interpreter'

export type InterpreterState = 'RUNNING' | 'PAUSED' | 'INITIALIZED' | 'STEPPING'

export type Memory = {
	type: 'STACK' | 'QUEUE' | 'TAPE'
	data: string[]
}

export type State = string
export type _symbol = string

export interface Transition {
	destination: State
	symbol: _symbol
	replacement?: _symbol
}

interface BaseCommand {
	type: string
	to: Transition[]
}

export interface FSACommand extends BaseCommand {
	type: 'SCAN' | 'PRINT' | 'SCAN RIGHT' | 'SCAN LEFT'
}

export interface PDACommand extends BaseCommand {
	type: 'READ' | 'WRITE'
	memoryName: string
}

export interface TMCommand extends BaseCommand {
	type: 'RIGHT' | 'LEFT' | 'UP' | 'DOWN'
	memoryName: string
}

export type Command = FSACommand | PDACommand | TMCommand
