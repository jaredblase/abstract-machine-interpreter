import type { _symbol } from '../interpreter'

type TapeType = 'TAPE' | '2D_TAPE'

export class Tape {
	private data: _symbol[][]
	private xPtr: number
	private yPtr: number
	private type: TapeType

	constructor(type: TapeType, data?: _symbol[][], xPtr?: number, yPtr?: number) {
		this.type = type

		if (data !== undefined) {
			this.data = structuredClone(data)
			this.xPtr = xPtr ?? 0
			this.yPtr = yPtr ?? 0
		} else {
			this.clear()
		}
	}

	set(data: string) {
		this.clear()
		this.data = [data.split('')]
	}

	right() {
		const row = this.data[this.yPtr]

		if (row[++this.xPtr] === undefined) {
			for (let i = 0; i < this.data.length; i++) {
				this.data[i].push('#')
			}
		}

		return row[this.xPtr]
	}

	left() {
		const row = this.data[this.yPtr]

		if (row[this.xPtr - 1] === undefined) {
			for (let i = 0; i < this.data.length; i++) {
				this.data[i].unshift('#')
			}
		} else {
			this.xPtr--
		}

		return this.data[this.yPtr][this.xPtr]
	}

	down() {
		if (this.data[++this.yPtr] === undefined) {
			this.data.push(new Array(this.data[0].length).fill('#'))
		}

		return this.data[this.yPtr][this.xPtr]
	}

	up() {
		if (this._data[this.yPtr - 1] === undefined) {
			this.data.unshift(new Array(this.data[0].length).fill('#'))
		} else {
			this.yPtr--
		}

		return this.data[this.yPtr][this.xPtr]
	}

	write(replacement: _symbol) {
		this.data[this.yPtr][this.xPtr] = replacement
	}

	clear() {
		this.data = [['#']]
		this.xPtr = 0
		this.yPtr = 0
	}

	get y() {
		return this.yPtr
	}

	get x() {
		return this.xPtr
	}

	get _data() {
		return this.data
	}

	get _type() {
		return this.type
	}

	clone() {
		return new Tape(this.type, this.data, this.xPtr, this.yPtr)
	}
}