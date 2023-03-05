<script lang="ts">
  let className = ''

  export let label: string
  export { className as class }
</script>

<div class="rounded-lg border-gray-600 relative border py-3 {className}">
  <header
    class="absolute top-0 left-1/2 -translate-y-[60%] -translate-x-1/2 bg-white font-semibold dark:bg-gray-800 transition-colors px-2 uppercase"
  >
    {label}
  </header>
  <slot />
</div>
