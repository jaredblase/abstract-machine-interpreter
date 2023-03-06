import { get, writable } from 'svelte/store'
import { code } from './editor'
import { interpret } from '../lib/interpreter'

const m = interpret(get(code))
m.reset('')

export let machine = writable(m)
