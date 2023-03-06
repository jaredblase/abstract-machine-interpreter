<script>
  import { machine } from '../stores/machine'
  import BoxedLabel from './BoxedLabel.svelte'
</script>

<div class="space-y-6 py-2">
  {#each Array.from($machine.storage.entries()) as m}
    {#if m[0] != $machine.inputMemoryId}
      <BoxedLabel label="{m[1].type} {m[0]}" class="!py-2">
        <p>
          {m[1].data.join('')}
        </p>
      </BoxedLabel>
    {/if}
  {/each}
</div>

<style lang="postcss">
  p {
    @apply text-lg font-mono flex justify-center flex-wrap overflow-hidden break-before-all px-2 min-h-[1.75rem];
  }
</style>
