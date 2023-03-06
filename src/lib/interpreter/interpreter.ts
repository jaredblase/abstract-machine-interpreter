import { AbsMacLanguage } from '../absmac'
import type { FSAState, Memory, PDAState, TMState, Storage, States } from '.'
import { ContextCursor } from './ContextCursor'
import { AbstractMachine } from './AbstractMachine'
import { Queue, Stack, Tape } from '../data-structures'
import { OneWay } from '../data-structures/OneWay'

/**
 * Interprets the source code to generate a new abstract machine.
 * @param src a string representation of the source code
 * @returns A new AbstractMachine instance defined by the source code
 */
export function interpret(src: string) {
	const storage: Storage = new Map()
	const states: States = new Map()

	const cursor = new ContextCursor(AbsMacLanguage.parser.parse(src).cursor(), src)
	cursor.next() // Skip Program

	// interpret data section
	if (cursor.isType('DataSection')) {
		cursor.next()
		cursor.next()

		do {
			if (!cursor.isType('StorageType')) {
				throw SyntaxError(`Exptecting StorageType token at ${cursor.getRowColPos()}`)
			}

			const type = cursor.getToken()

			if (!(cursor.next() && cursor.isType('Identifier'))) {
				throw SyntaxError(`Expected Identifier token after '${type}' at ${cursor.getRowColPos()}`)
			}

			const id = cursor.getToken()
			if (storage.has(id)) {
				throw SyntaxError(`Storage ${id} is redeclared at ${cursor.getRowColPos()}`)
			}

			switch (type) {
				case 'STACK':
					storage.set(id, new Stack())
					break

				case 'QUEUE':
					storage.set(id, new Queue())
					break

				case 'TAPE':
				case '2D_TAPE':
					storage.set(id, new Tape(type))
					break
			}

		} while (cursor.next() && !cursor.isType('LogicSection'))
	}

	// interpret logic section
	if (!cursor.isType('LogicSection')) {
		throw SyntaxError("Missing .LOGIC section")
	}

	cursor.next() // Skip LogicSection
	cursor.next() // Skip .LOGIC

	while (cursor.isType('State')) {
		cursor.next()
		const stateName = cursor.getToken()
		cursor.next()

		if (cursor.isError()) {
			throw SyntaxError(`Expected command token after state identifier '${stateName}]' at ${cursor.getRowColPos()}`)
		}

		// Parse FSA Transitions
		if (cursor.isType('FSACommand')) {
			const command = cursor.getToken() as FSAState['command']
			const transitions = [] as FSAState['transitions']

			if (cursor.next() && !cursor.isType('Transition')) {
				throw SyntaxError(`Expected at least 1 transition in state declaration at ${cursor.getRowColPos()}`)
			}

			while (cursor.isType('Transition')) {
				if (cursor.next() && !cursor.isType('Symbol')) {
					throw SyntaxError(`Expected symbol at ${cursor.getRowColPos()}`)
				}

				const symbol = cursor.getToken()

				if (cursor.next() && !cursor.isType('Identifier')) {
					throw SyntaxError(`Expected identifer at ${cursor.getRowColPos()}`)
				}

				transitions.push({ symbol, destination: cursor.getToken() })
				cursor.next()
			}

			states.set(stateName, { command, transitions })
			continue
		}

		// Parse PDA Transitions
		if (cursor.isType('PDACommand')) {
			const command = cursor.getToken() as PDAState['command']

			if (cursor.next() && !cursor.isType('Identifier')) {
				throw SyntaxError(`Expected memory identifier after '${command}' at ${cursor.getRowColPos()}`)
			}

			const memoryName = cursor.getToken() as PDAState['memoryName']
			const m = storage.get(memoryName)

			if (m === undefined) {
				throw SyntaxError(`Storage ${memoryName} not declared. Used at (${cursor.getRowColPos()})`)
			}

			if (!(m instanceof OneWay)) {
				throw SyntaxError(`${command} command can only be done with QUEUE or STACK data types (${cursor.getRowColPos()})`)
			}

			if (cursor.next() && !cursor.isType('Transition')) {
				throw SyntaxError(`Expected at least 1 transition in state declaration at ${cursor.getRowColPos()}`)
			}

			const transitions = [] as PDAState['transitions']

			while (cursor.isType('Transition')) {
				if (cursor.next() && !cursor.isType('Symbol')) {
					throw SyntaxError(`Expected symbol at ${cursor.getRowColPos()}`)
				}

				const symbol = cursor.getToken()

				if (cursor.next() && !cursor.isType('Identifier')) {
					throw SyntaxError(`Expected identifer at ${cursor.getRowColPos()}`)
				}

				transitions.push({ symbol, destination: cursor.getToken() })
				cursor.next()
			}

			states.set(stateName, { command, memoryName, transitions })
			continue
		}

		// Parse TM Transitions
		const command = cursor.getToken() as TMState['command']

		if (cursor.next() && !cursor.isType('Identifier')) {
			throw SyntaxError(`Expected memory identifer after '${command}' at ${cursor.getRowColPos()}`)
		}

		const memoryName = cursor.getToken() as TMState['memoryName']

		if (cursor.next() && !cursor.isType('TMTransition')) {
			throw SyntaxError(`Expected at least 1 transition in state declaration at ${cursor.getRowColPos()}`)
		}

		const m = storage.get(memoryName)

		if (m === undefined) {
			throw SyntaxError(`Storage ${memoryName} not declared. Used at (${cursor.getRowColPos()})`)
		}

		if ((command === 'UP' || command === 'DOWN') && m._type !== '2D_TAPE') {
			throw SyntaxError(`${command} command is only allowed for 2D_TAPE data type (${cursor.getRowColPos()})`)
		} else if (m._type !== 'TAPE' && m._type !== '2D_TAPE') {
			throw SyntaxError(`${command} command is only allowed for TAPE or 2D_TAPE data types (${cursor.getRowColPos()})`)
		}

		const transitions = [] as TMState['transitions']

		while (cursor.isType('TMTransition')) {
			if (cursor.next() && !cursor.isType('Symbol')) {
				throw SyntaxError(`Expected symbol at ${cursor.getRowColPos()}`)
			}

			const symbol = cursor.getToken()

			if (cursor.next() && !cursor.isType('Symbol')) {
				throw SyntaxError(`Expected replacement symbol at ${cursor.getRowColPos()}`)
			}

			const replacement = cursor.getToken()

			if (cursor.next() && !cursor.isType('Identifier')) {
				throw SyntaxError(`Expected identifer at ${cursor.getRowColPos()}`)
			}

			transitions.push({ symbol, replacement, destination: cursor.getToken() })
			cursor.next()
		}

		states.set(stateName, { command, memoryName, transitions })
	}

	if (cursor.isError()) {
		throw SyntaxError(`Syntax error at ${cursor.getRowColPos()}`)
	}

	return new AbstractMachine(storage, states)
}

/**
 * Primarily used for debugging by printing out the whole parse tree.
 * @param src source code string
 */
export function logTree(src: string) {
	const cursor = new ContextCursor(AbsMacLanguage.parser.parse(src).cursor(), src)
	const arr: string[] = []

	while (cursor.next()) {
		arr.push(cursor.toString())
	}

	console.log(arr.join('\n'))
}