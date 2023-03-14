import cytoscape, { type ElementDefinition } from 'cytoscape'
import klay from 'cytoscape-klay'

import type { State, States } from '../interpreter'

cytoscape.use(klay);

/**
 * Returns the node label
 * @param state a valid state
 * @returns the concatentation of the initials of the words in the given command along with the memory name
 */
function getNodeLabel(state: State) {
	const cmd = state.command.split(' ').map(word => word[0]).join('')

	if ('memoryName' in state) {
		return cmd + state.memoryName
	}

	return cmd
}

/**
 * Returns the edge label
 * @param t a valid transition
 * @returns an edge label
 */
function getEdgeLabel(t: State['transitions'][number]) {
	if ('replacement' in t && t.replacement !== t.symbol) {
		return `${t.symbol}/${t.replacement}`
	}

	return t.symbol
}

/**
 * Parses the state object for cytoscape's consumption
 * @param states a map object containing machine states
 * @returns an ElementDefinition array for cytoscape
 */
export function getElements(states: States) {
	const elements: ElementDefinition[] = []
	let isAcceptAdded = false
	let isRejectAdded = false

	for (const [name, state] of states) {
		elements.push({ data: { id: name, label: getNodeLabel(state) } })
	}

	for (const [name, { transitions }] of states) {
		for (let i = 0; i < transitions.length; i++) {
			if (transitions[i].destination == 'accept' && !isAcceptAdded) {
				elements.push({ data: { id: 'accept', label: 'accept' } })
				isAcceptAdded = true
			} else if (transitions[i].destination == 'reject' && !isRejectAdded) {
				elements.push({ data: { id: 'reject', label: 'reject' } })
				isRejectAdded = true
			}

			elements.push({ data: { source: name, target: transitions[i].destination, label: getEdgeLabel(transitions[i]) } })
		}
	}

	return elements
}
