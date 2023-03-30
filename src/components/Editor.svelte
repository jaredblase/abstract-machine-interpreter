<script lang="ts">
	import { code } from '../stores/editor'
	import CodeMirror from 'svelte-codemirror-editor'
	import { theme, highlights } from '../lib/absmac/styles'
	import { AbsMac } from '../lib/absmac'
	import { onMount } from 'svelte'
	import { machine } from '../stores/machine'
	import type { State } from '../lib/interpreter'

	let className = ''

	export { className as class }

	onMount(() => {
		editor.querySelector('.cm-content').ariaLabel = 'Code editor'
	})

	let currElem: Element
	let prevElem: Element
	let editor: Element
	let cachedCurrState: State
	let cachedPrevState: State

	$: currState = $machine.currState
	$: prevState = $machine.prevState

	$: if (editor?.querySelector('.active') == null || currState !== cachedCurrState) {
		cachedCurrState = currState
		currElem?.classList.remove('active')

		if (currState?.lineNumber != undefined) {
			currElem = editor?.querySelector(`.cm-line:nth-child(${currState.lineNumber})`)
			currElem?.classList.add('active')
		}
	}

	$: if (editor?.querySelector('.prev') == null || prevState !== cachedPrevState) {
		cachedPrevState = prevState
		prevElem?.classList.remove('prev')

		if (prevState?.lineNumber != undefined) {
			prevElem = editor?.querySelector(`.cm-line:nth-child(${prevState.lineNumber})`)
			prevElem?.classList.add('prev')
		}
	}
</script>

<div class={className} bind:this={editor}>
	<CodeMirror
		class="max-h-full"
		bind:value={$code}
		theme={[theme, highlights]}
		lang={AbsMac()}
		placeholder="Enter your code here..."
	/>
</div>

<style lang="postcss">
	:global(.active, .prev) {
		@apply relative
	}

	:global(.active::after, .prev::after) {
		@apply italic absolute right-10 opacity-50;
	}

	:global(.active) {
		@apply !bg-orange-900
	}

	:global(.active::after) {
		@apply content-["ACTIVE"];
	}

	:global(.prev) {
		@apply !bg-fuchsia-900
	}

	:global(.prev::after) {
		@apply content-["PREV"];
	}

	:global(.active.prev) {
		@apply !bg-rose-900
	}

	:global(.active.prev::after) {
		@apply content-["PREV_ACTIVE"]
	}
</style>