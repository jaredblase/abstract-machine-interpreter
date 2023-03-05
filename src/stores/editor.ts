import { writable } from 'svelte/store'

type Message = {
	text: string
	type: 'error' | 'info' | ''
}

export const code = writable(
`;; NFA for detecting substring "101"

.LOGIC
A] SCAN (0, A), (1, A), (1, B)
B] SCAN (0, C)
C] SCAN (1, accept)
`)

export const message = writable<Message>({ text: '', type: '' })
