<script lang="ts">
	import { code } from '../stores/editor'
	import CodeMirror from 'svelte-codemirror-editor'
	import { theme, highlights } from '../lib/absmac/styles'
	import { AbsMac } from '../lib/absmac'
	import { onMount } from 'svelte'
	import { machine } from '../stores/machine'

	let className = ''

	export { className as class }

	onMount(() => {
		document.querySelector('.cm-content').ariaLabel = 'Code editor'
	})

	let elem: Element | undefined
	let cachedLineNumber: number

	$: lineNumber = $machine.states.get($machine.currState)?.lineNumber

	$: if (lineNumber !== cachedLineNumber) {
		cachedLineNumber = lineNumber
		elem?.classList.remove('active')

		if (lineNumber != undefined) {
			elem = document.querySelector(`.cm-line:nth-child(${lineNumber})`)
			elem?.classList.add('active')
		}
	}
</script>

<div class={className}>
	<CodeMirror
		class="max-h-full"
		bind:value={$code}
		theme={[theme, highlights]}
		lang={AbsMac()}
		placeholder="Enter your code here..."
	/>
</div>

<style lang="postcss">
	:global(.active) {
		@apply !bg-orange-900 relative;
	}

	:global(.active::after) {
		@apply content-["ACTIVE"] italic absolute right-10 opacity-50;
	}
</style>