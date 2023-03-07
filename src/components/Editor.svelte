<script lang="ts">
	import { code } from '../stores/editor'
	import CodeMirror from 'svelte-codemirror-editor'
	import { theme, highlights } from '../lib/absmac/styles'
	import { AbsMac } from '../lib/absmac'
	import { onMount } from 'svelte'

	let className = ''

	export { className as class }

	onMount(() => {
		document.querySelector('.cm-content').ariaLabel = "Code editor"
	})
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
