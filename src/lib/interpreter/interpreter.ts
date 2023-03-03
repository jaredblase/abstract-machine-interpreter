import { AbsMacLanguage } from '../absmac'
import { memory, transitions } from '../../stores/runtime'
import type { FSACommand, Memory, PDACommand, TMCommand } from '.'
import { ContextCursor } from './ContextCursor'

export function interpret(src: string) {
	memory.clear()
	transitions.clear()

	const cursor = new ContextCursor(AbsMacLanguage.parser.parse(src).cursor(), src)
	cursor.next()

	// interpret data section
	if (cursor.isType('DataSection')) {
		cursor.next()

		do {
			if (!cursor.isType('StorageType')) {
				continue
			}

			const type = cursor.getToken() as Memory['type']

			if (!(cursor.next() && cursor.isType('Identifier'))) {
				throw SyntaxError(`Expected Identifier token after '${type}' at ${cursor.getRowColPos()}`)
			}

			memory.add(cursor.getToken(), type)

		} while (cursor.next() && !cursor.isType('LogicSection'))
	}

	// interpret logic section
	if (!cursor.isType('LogicSection')) {
		throw SyntaxError("Missing .LOGIC section")
	}

	cursor.next()
	cursor.next()

	while (cursor.isType('Transition')) {
		cursor.next()
		const start = cursor.getToken()
		cursor.next()

		// Parse FSA Transitions
		if (cursor.isType('FSACommand')) {
			const type = cursor.getToken() as FSACommand['type']
			const to = [] as FSACommand['to']

			if (cursor.next() && !cursor.isType('State')) {
				throw SyntaxError(`Expected at least 1 State in Transition at ${cursor.getRowColPos()}`)
			}

			while (cursor.isType('State')) {
				if (cursor.next() && !cursor.isType('Symbol')) {
					throw SyntaxError(`Expected symbol at ${cursor.getRowColPos()}`)
				}

				const symbol = cursor.getToken()

				if (cursor.next() && !cursor.isType('Identifier')) {
					throw SyntaxError(`Expected identifer at ${cursor.getRowColPos()}`)
				}

				to.push({ symbol, destination: cursor.getToken() })
				cursor.next()
			}

			transitions.add(start, { type, to })
			continue
		}

		// Parse PDA Transitions
		if (cursor.isType('PDACommand')) {
			const type = cursor.getToken() as PDACommand['type']

			if (cursor.next() && !cursor.isType('Identifier')) {
				throw SyntaxError(`Expected memory identifer after '${type}' at ${cursor.getRowColPos()}`)
			}

			const memoryName = cursor.getToken() as PDACommand['memoryName']
			
			if (cursor.next() && !cursor.isType('State')) {
				throw SyntaxError(`Expected at least 1 State in Transition at ${cursor.getRowColPos()}`)
			}

			const to = [] as PDACommand['to']
			
			while (cursor.isType('State')) {
				if (cursor.next() && !cursor.isType('Symbol')) {
					throw SyntaxError(`Expected symbol at ${cursor.getRowColPos()}`)
				}

				const symbol = cursor.getToken()

				if (cursor.next() && !cursor.isType('Identifier')) {
					throw SyntaxError(`Expected identifer at ${cursor.getRowColPos()}`)
				}

				to.push({ symbol, destination: cursor.getToken() })
				cursor.next()
			}

			transitions.add(start, { type, memoryName, to })
			continue
		}

		// Parse TM Transitions
		const type = cursor.getToken() as TMCommand['type']

		if (cursor.next() && !cursor.isType('Identifier')) {
			throw SyntaxError(`Expected memory identifer after '${type}' at ${cursor.getRowColPos()}`)
		}

		const memoryName = cursor.getToken() as TMCommand['memoryName']
		
		if (cursor.next() && !cursor.isType('TapeState')) {
			throw SyntaxError(`Expected at least 1 TapeState in Transition at ${cursor.getRowColPos()}`)
		}
		
		const to = [] as TMCommand['to']

		while (cursor.isType('TapeState')) {
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

			to.push({ symbol, replacement, destination: cursor.getToken() })
			cursor.next()
		}

		transitions.add(start, { type, memoryName, to })
	}
}