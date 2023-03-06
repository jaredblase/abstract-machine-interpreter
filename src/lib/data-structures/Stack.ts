import type { _symbol } from '../interpreter'
import { OneWay } from './OneWay'

export class Stack extends OneWay {
	constructor(data?: _symbol[]) {
		super()
		this.data = data === undefined ? [] : structuredClone(data)
	}

	read() {
		return this.data.pop()
	}

	clone() {
		return new Stack(this.data)
	}

	get _type() {
		return 'Stack'
	}
}
