import type { TreeCursor } from '@lezer/common'

export class ContextCursor {
	#cursor: TreeCursor
	#src: string
	#hasRemainingNodes = true

	constructor(cursor: TreeCursor, src: string) {
		this.#cursor = cursor
		this.#src = src
	}

	next() {
		if (this.#hasRemainingNodes) {
			this.#hasRemainingNodes = this.#cursor.next()
		}
		
		return this.#hasRemainingNodes
	}

	isError() {
		return this.#cursor.node.type.name === '⚠'
	}

	isType(type: string) {
		return this.#cursor.node.type.name === type
	}

	getToken() {
		return this.#src.slice(this.#cursor.node.from, this.#cursor.node.to)
	}

	toString() {
		return `${this.#cursor.node.type.name}: ${this.getToken()}`
	}

	getRowColPos() {
		const arr = this.#src.slice(0, this.#cursor.node.from).split('\n')
		return `${arr.length}:${arr.at(-1).length}`
	}
}