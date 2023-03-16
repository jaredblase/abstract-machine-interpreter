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
	<div class="max-w-4xl w-full bg-white rounded-3xl p-8 space-y-4">
		<article>
			<h1 class="text-3xl font-medium font-mono">Instructions</h1>
			<ol class="list-decimal list-inside pl-2">
				<li>
					Write your own in the abstract machine program area. See below for
					syntax.
				</li>
				<li>
					Enter something in the 'Input' area - this will be written on the tape
					initially as input to the machine.
				</li>
				<li>Click 'Reset' to initialize the machine, the initial input, and the state graph.</li>
				<li>
					Click on 'Run' to start the Turing machine and run it until it halts
					(if ever).
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
		</article>
		<article>
			<h2 class="text-3xl font-medium font-mono">Syntax</h2>
			<h3 class="text-lg font-medium">.DATA Section</h3>
			<p>
				Memory used by the machine should be delcared in this section.
				Declaration can be any of the following:
			</p>
			<ol>
				<li>STACK &lt;var_name&gt;</li>
				<li>QUEUE &lt;var_name&gt;</li>
				<li>TAPE &lt;var_name&gt;</li>
				<li>2D_TAPE &lt;var_name&gt;</li>
			</ol>
			<h3 class="text-lg font-medium mt-4">.LOGIC Section</h3>
			<p>Transitions of the machine should be in the following form:</p>
			<ol>
				<li>(&lt;SYMBOL&gt;, &lt;DESTINATION_STATE&gt;) for non-tape commands <em>Ex: (a, A)</em></li> 
				<li>(&lt;SYMBOL&gt;/&lt;REPLACEMENT_SYMBOL&gt;, &lt;DESTINATION_STATE&gt;) for tape commands <em>Ex: (a/b, B)</em></li>
			</ol>

			<p class="mt-2">States of the machine should be declared using the following synax:</p>
			<ol>
				<li>SCAN &lt;comma_separated_non_tape_transitions&gt;</li>
				<li>SCAN LEFT &lt;comma_separated_non_tape_transitions&gt;</li>
				<li>SCAN RIGHT &lt;comma_separated_non_tape_transitions&gt;</li>
				<li>PRINT &lt;comma_separated_non_tape_transitions&gt;</li>
				<li>READ(&lt;MEMORY_NAME&gt;) &lt;comma_separated_non_tape_transitions&gt;</li>
				<li>WRITE(&lt;MEMORY_NAME&gt;) &lt;comma_separated_non_tape_transitions&gt;</li>
				<li>RIGHT(&lt;TAPE_NAME&gt;) &lt;comma_separated_tape_transitions&gt;</li>
				<li>LEFT(&lt;TAPE_NAME&gt;) &lt;comma_separated_tape_transitions&gt;</li>
				<li>UP(&lt;TAPE_NAME&gt;) &lt;comma_separated_tape_transitions&gt;</li>
				<li>DOWN(&lt;TAPE_NAME&gt;) &lt;comma_separated_tape_transitions&gt;</li>
			</ol>
			<p class="mt-2"><em>Ex: DOWN(t1) (x/x, A), (y/x, B)</em></p>

			<p class="italic mt-4">*For machines that use tapes, the first tape is treated as the input tape.</p>
		</article>
	</div>
</Dialog>
<header class="dark:text-white">
	<div
		class="container mx-auto py-4 flex sm:justify-between justify-center px-4 relative"
	>
		<h1 class="text-3xl font-mono select-none">Abstract</h1>
		<div class="space-x-2 absolute right-0 mr-2 sm:static">
			<button on:click={handleThemeClick} aria-label="Toggle dark mode" title="Toggle dark mode">
				{#if theme == 'light'}
					<Sun class="h-7 icon" />
				{:else}
					<Moon class="h-7 icon" />
				{/if}
			</button>
			<button on:click={() => modal.set(modalId)} aria-label="Open more information dialog" title="More information">
				<InfoIcon class="h-7 icon" />
			</button>
		</div>
	</div>
</header>

<style lang="postcss">
	ol {
		@apply list-decimal list-inside pl-2
	}

	em {
		@apply font-semibold
	}
</style>