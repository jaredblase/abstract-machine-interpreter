<script lang="ts">
	import BoxedLabel from './components/BoxedLabel.svelte'
	import ControlPanel from './components/ControlPanel.svelte'
	import Editor from './components/Editor.svelte'
	import Header from './components/Header.svelte'
	import MachineStates from './components/MachineStates.svelte'
	import Storages from './components/Storages.svelte'
</script>

<Header />
<main class="mt-8">
	<MachineStates />
	<section class="px-4">
		<div
			class="grid gap-x-2 grid-cols-2 lg:grid-cols-4 lg:gap-x-4 xl:gap-x-6 gap-y-8 container xl:max-w-screen-xl mx-auto"
		>
			<div class="flex flex-col col-span-2 max-lg:order-1 h-[21rem]">
				<header class="bg-neutral-700 px-4 py-1">
					<h2 class="font-medium text-sm text-gray-200">
						Abstract Machine Code Editor
					</h2>
				</header>
				<Editor
					class="bg-[#1e1e1e] cursor-text overflow-y-auto flex-1
					scrollbar scrollbar-thumb-[#ffffff30] scrollbar-track-transparent"
				/>
			</div>
			<BoxedLabel label="CONTROLS" class="px-3 py-6 max-sm:col-span-2">
				<ControlPanel />
			</BoxedLabel>
			<BoxedLabel
				label="MEMORY"
				class="px-2 py-6 h-full max-h-[21rem] max-sm:col-span-2"
			>
				<div
					class="h-full overflow-auto scrollbar-thin scrollbar-thumb-[#ffffff40] scrollbar-track-transparent"
				>
					<Storages />
				</div>
			</BoxedLabel>
		</div>
	</section>
</main>
<footer class="h-20" />
