<script lang="ts">
	import Caret from '../assets/caret.svelte'
	import type { Tape } from '../lib/data-structures'

	export let tape: Tape

	let className = ''
	export { className as class }
</script>

{#each tape._data as arr, i}
	<p class={className + 'group'}>
		{#each arr as char, j}
			{@const isMarked = i == tape.y && j == tape.x}
			<span class:mark={isMarked}>
				{char}
				{#if isMarked}
					<Caret
						class="dark:fill-white w-3 absolute -bottom-3 -left-[2px] md:left-[2px]"
					/>
				{/if}
			</span>
		{/each}
	</p>
{:else}
	<p>...</p>
{/each}

<style lang="postcss">
	.mark {
		@apply relative inline;
	}
</style>
