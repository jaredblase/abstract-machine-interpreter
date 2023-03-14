<script lang="ts">
	import { modal } from '../stores/modal'
	import { createEventDispatcher } from 'svelte'

	export let id: string

	let content: HTMLDivElement
	let dialog: HTMLDialogElement

	const dispatch = createEventDispatcher()
	const close = () => dispatch('close')

	function handleClick(e: MouseEvent) {
		if (!content.contains(e.target as Node)) {
			close()
		}
	}

	$: if ($modal == id) {
		dialog.showModal()
		document.body.style.overflow = 'hidden'
	} else {
		dialog?.close()
		document.body.style.overflow = 'auto'
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	{id}
	class="grid place-items-center bg-[unset] w-full h-full open:pointer-events-auto fixed
		opacity-0 open:opacity-100 pointer-events-none backdrop:bg-black/50 backdrop-blur-[2px]
		max-h-full max-w-full p-12"
	on:click={handleClick}
	bind:this={dialog}
>
	<div class="contents" bind:this={content}>
		<slot />
	</div>
</dialog>
