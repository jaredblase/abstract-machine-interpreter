<script>
  import { Tape } from '../lib/data-structures'
  import { machine } from '../stores/machine'
  import BoxedLabel from './BoxedLabel.svelte'
  import TapeComponent from './Tape.svelte'
</script>

<div class="space-y-6 py-2">
  {#each Array.from($machine.storage.entries()) as m}
    {#if m[0] != $machine.inputMemoryId}
      <BoxedLabel label="{m[1]._type} {m[0]}" class="!py-2">
        {#if m[1] instanceof Tape}
          <TapeComponent tape={m[1]} class="text-lg font-mono flex justify-center flex-wrap break-before-all px-2" />
        {:else}
          <p>
            {m[1]._data}
          </p>
        {/if}
      </BoxedLabel>
    {/if}
  {/each}
</div>

<style lang="postcss">
  p {
    @apply text-lg font-mono flex justify-center flex-wrap overflow-hidden break-before-all px-2 min-h-[1.75rem];
  }
</style>
