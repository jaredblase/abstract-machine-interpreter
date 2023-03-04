<script lang="ts">
  import ControlPanel from './components/ControlPanel.svelte'
  import Editor from './components/Editor.svelte'
  import Header from './components/Header.svelte'
  import MachineStates from './components/MachineStates.svelte'
</script>

<Header />
<main class="mt-8">
  <MachineStates />
  <section class="px-4">
    <div
      class="grid md:grid-cols-4 md:gap-x-4 lg:gap-x-6 gap-y-4 container lg:max-w-screen-lg mx-auto"
    >
      <div class="flex flex-col md:col-span-3">
        <header class="bg-neutral-700 px-4 py-1">
          <h2 class="font-medium text-sm text-gray-200">
            Abstract Machine Code Editor
          </h2>
        </header>
        <Editor
          class="bg-[#1e1e1e] cursor-text overflow-y-auto h-[15rem] lg:h-[20rem] min-h-max
					scrollbar scrollbar-thumb-[#ffffff30] scrollbar-track-transparent"
        />
      </div>
      <div class="self-end">
        <ControlPanel />
      </div>
    </div>
  </section>
</main>
<footer class="h-20" />
