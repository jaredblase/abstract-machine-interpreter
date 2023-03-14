<script lang="ts">
	import Dialog from './Dialog.svelte'
	import { modal } from '../stores/modal'
	import { machine } from '../stores/machine'
	import { getElements } from '../lib/graph/graph-generator'
	import cytoscape, { type Core } from 'cytoscape'

	cytoscape.warnings(import.meta.env.DEV)

	let container: HTMLDivElement
	let c: Core

	$: {
		c?.destroy()
		c = cytoscape({
			container,
			elements: getElements($machine.states),
			wheelSensitivity: 0.5,
			style: [
				{
					selector: 'node',
					style: {
						'background-color': '#f2e986',
						label: 'data(label)',
						'border-color': 'black',
						'border-width': '2px',
						'text-halign': 'center',
						'text-valign': 'center',
						width: '50px',
						height: '50px',
					},
				},
				{
					selector: 'edge',
					style: {
						'target-arrow-shape': 'triangle',
						'arrow-scale': 1.5,
						'curve-style': 'bezier',
						label: 'data(label)',
						'text-valign': 'top',
						'text-margin-y': -10,
					},
				},
				{
					selector: `#${$machine.states.keys().next().value}`,
					style: {
						backgroundColor: 'skyblue',
					},
				},
				{
					selector: '#accept',
					style: {
						shape: 'rectangle',
					},
				},
			],
		})
	}
</script>

<Dialog id="graph-dialog" on:close={() => modal.set('')}>
	<div class="bg-white max-w-3xl w-full h-full rounded-2xl">
		<div bind:this={container} class="h-full" />
	</div>
</Dialog>
