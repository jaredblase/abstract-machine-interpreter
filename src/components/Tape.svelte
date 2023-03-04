<script lang="ts">
  import Caret from '../assets/caret.svelte'

  let className = ''
  export let label: string
  export let value: string
  export let markIdx: number = undefined

  export { className as class }
</script>

<div class="rounded-lg border-gray-600 relative border py-3 {className}">
  <header
    class="absolute top-0 left-1/2 -translate-y-[60%] -translate-x-1/2 bg-white dark:bg-gray-800 transition-colors px-2 uppercase"
  >
    {label}
  </header>
  <p class="text-3xl font-mono flex justify-center">
    {#each value.split('') as char, i}
      {@const isMarked = i == markIdx}
      <span class:mark={isMarked}>
        {char}
        {#if isMarked}
          <Caret class="dark:fill-white w-3 absolute -bottom-3 left-[2px]" />
        {/if}
      </span>
    {/each}
  </p>
</div>

<style lang="postcss">
  .mark {
    @apply relative inline;
  }
</style>
