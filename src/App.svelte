<script lang="ts">
  import InfoIcon from './assets/info.svelte'
  import Editor from './components/Editor.svelte'
</script>

<header class="dark:text-white">
  <div
    class="container mx-auto py-4 flex sm:justify-between justify-center px-4 relative"
  >
    <h1 class="text-3xl font-mono select-none">Abstract</h1>
    <InfoIcon
      class="w-7 cursor-pointer icon absolute right-4 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0"
    />
  </div>
</header>
<main>
  <section>
    <div class="grid grid-cols-2 container mx-auto px-4 h-96">
      <div class="rounded-lg overflow-hidden flex flex-col">
        <header class="bg-neutral-700 px-4 py-1">
          <h2 class="font-medium text-sm text-gray-200">Abstract Machine Code Editor</h2>
        </header>
        <Editor class="bg-[#1e1e1e] flex-1 overflow-y-auto scrollbar scrollbar-thumb-[#ffffff30] scrollbar-track-transparent" />
      </div>
    </div>
  </section>
</main>
