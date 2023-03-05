<script>
  import { memory } from '../stores/machine'
  import BoxedLabel from './BoxedLabel.svelte'
</script>

<div class="space-y-6 py-2">
  {#each Array.from($memory.entries()) as m}
    <BoxedLabel label="{m[1].type} {m[0]}" class="!py-2">
			<p>
				{m[1].data.join('')}
			</p>
		</BoxedLabel>
  {/each}
</div>

<style lang="postcss">
	p {
		@apply text-lg font-mono flex justify-center flex-wrap overflow-hidden break-before-all px-2 min-h-[1.75rem]
	}
</style>