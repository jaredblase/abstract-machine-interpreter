import { writable } from 'svelte/store'

type Message = {
	text: string
	type: 'error' | 'info' | ''
}

export const code = writable('')
export const message = writable<Message>({ text: '', type: '' })
