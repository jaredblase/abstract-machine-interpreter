<script lang="ts">
  import Caret from '../assets/caret.svelte'

  export let value: string
  export let markIdx: number = undefined
</script>

{#each value.split('') as char, i}
  {@const isMarked = i == markIdx}
  <span class:mark={isMarked}>
    {char}
    {#if isMarked}
      <Caret class="dark:fill-white w-3 absolute -bottom-3 -left-[2px] md:left-[2px]" />
    {/if}
  </span>
{:else}
  <span>...</span>
{/each}

<style lang="postcss">
  .mark {
    @apply relative inline;
  }
</style>
