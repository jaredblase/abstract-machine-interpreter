<script lang="ts">
	import { afterUpdate } from 'svelte'
	import Caret from '../assets/caret.svelte'
	import type { Tape } from '../lib/data-structures'

	export let tape: Tape

	let className = ''
	export { className as class }

	let container: HTMLDivElement

	function isElementVisible(elem: Element) {
		const cBounds = container.parentElement.getBoundingClientRect()
		const eBounds = elem.getBoundingClientRect()

		return (
			eBounds.top >= cBounds.top &&
			eBounds.left >= cBounds.left &&
			eBounds.bottom <= cBounds.bottom &&
			eBounds.right <= cBounds.right
		)
	}

	afterUpdate(() => {
		const elem = container?.getElementsByClassName('mark')[0]
		if (elem && !isElementVisible(elem)) {
			elem?.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	})
</script>

<div bind:this={container}>
	{#each tape._data as arr, i}
		<p class={className}>
			{#each arr as char, j}
				{@const isMarked = i == tape.y && j == tape.x}
				<span class:mark={isMarked}>
					{char}
					{#if isMarked}
						<Caret
							class="dark:fill-white w-3 absolute -bottom-3 -left-[2px] md:left-[2px] group-[.small]:-left-[2px] z-10"
						/>
					{/if}
				</span>
			{/each}
		</p>
	{:else}
		<p>...</p>
	{/each}
</div>

<style lang="postcss">
	.mark {
		@apply relative inline;
	}
</style>
