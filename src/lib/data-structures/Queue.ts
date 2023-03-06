import type { _symbol } from '../interpreter'
import { OneWay } from './OneWay'

export class Queue extends OneWay {
	constructor(data?: _symbol[]) {
		super()
		this.data = data === undefined ? [] : structuredClone(data)
	}

	read() {
		return this.data.shift()
	}

	clone() {
		return new Queue(this.data)
	}

	get _type() {
		return 'Queue'
	}
}
