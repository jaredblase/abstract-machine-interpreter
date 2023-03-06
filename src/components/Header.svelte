<script lang="ts">
	import InfoIcon from '../assets/info.svelte'
	import { modal } from '../stores/modal'
	import Dialog from './Dialog.svelte'
	import Moon from '../assets/moon.svelte'
	import Sun from '../assets/sun.svelte'

	let theme = localStorage.getItem('theme')

	function handleThemeClick() {
		theme = theme == 'light' ? 'dark' : 'light'
		localStorage.setItem('theme', theme)
		document.documentElement.classList.toggle('dark')
	}

	const modalId = 'header-info'
</script>

<Dialog id={modalId} on:close={() => modal.set('')}>
	<div class="max-w-3xl w-full bg-white rounded-3xl p-8">
		<h1 class="text-3xl font-medium font-mono mb-2">Instructions</h1>
		<ol class="list-decimal list-inside pl-2">
			<li>
				Write your own in the Turing machine program area. See below for syntax.
			</li>
			<li>
				Enter something in the 'Input' area - this will be written on the tape
				initially as input to the machine.
			</li>
			<li>Click 'Reset' to initialise the machine.</li>
			<li>
				Click on 'Run' to start the Turing machine and run it until it halts (if
				ever).
			</li>
			<li>
				Click on 'Pause' to interrupt the Turing machine while it is running.
			</li>
			<li>
				Alternately, click 'Step' to run a single step of the Turing machine.
			</li>
			<li>
				Click 'Reset' to restore the Turing machine to its initial state so it
				can be run again.
			</li>
		</ol>
	</div>
</Dialog>
<header class="dark:text-white">
	<div
		class="container mx-auto py-4 flex sm:justify-between justify-center px-4 relative"
	>
		<h1 class="text-3xl font-mono select-none">Abstract</h1>
		<div class="space-x-2 absolute right-0 mr-2 sm:static">
			<button on:click={handleThemeClick}>
				{#if theme == 'light'}
					<Sun class="h-7 icon" />
				{:else}
					<Moon class="h-7 icon" />
				{/if}
			</button>
			<button on:click={() => modal.set(modalId)}>
				<InfoIcon class="h-7 icon" />
			</button>
		</div>
	</div>
</header>
