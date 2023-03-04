<script lang="ts">
  let className = ''

  export let label: string
  export { className as class }
</script>

<div class="rounded-lg border-gray-600 relative border py-3 {className}">
  <header
    class="absolute top-0 left-1/2 -translate-y-[60%] -translate-x-1/2 bg-white dark:bg-gray-800 transition-colors px-2 uppercase"
  >
    {label}
  </header>
  <p class="text-3xl font-mono flex justify-center">
    <slot />
  </p>
</div>
