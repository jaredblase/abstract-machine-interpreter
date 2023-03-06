import type { _symbol } from '../interpreter'

export abstract class OneWay {
	protected data: _symbol[]

	write(symbol: _symbol) {
		this.data.push(symbol)
	}

	abstract read(): _symbol

	abstract clone(): OneWay

	clear() {
		this.data.length = 0
	}

	get _data() {
		return this.data.join('')
	}
}
