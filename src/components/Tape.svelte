<script lang="ts">
  import Caret from '../assets/caret.svelte'
  import type { Tape } from '../lib/interpreter'

  export let tape: Tape;
</script>

{#each tape.data as arr, i}
  <p>
    {#each arr as char, j}
      {@const isMarked = i == tape.yPtr && j == tape.xPtr}
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

  p {
    @apply text-lg md:text-3xl font-mono flex justify-center flex-wrap break-before-all px-2;
  }
</style>
