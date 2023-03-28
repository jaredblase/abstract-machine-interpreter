<script lang="ts">
	import { interpret } from '../lib/interpreter'
	import { message, code } from '../stores/editor'
	import { machine, shouldRerenderGraph } from '../stores/machine'
	import { modal } from '../stores/modal'

	let value = '1000101'
	let timeout: NodeJS.Timer
	let idx = 0

	$: {
		if (value || $code) {
			message.set({
				text: 'Changes have not been saved...',
				type: '',
			})
		}
	}

	$: if ($machine.acceptedTimeline != undefined) {
		message.set({
			type: 'info',
			text: `Accepted timeline at ${$machine.acceptedTimeline}`,
		})
	}

	$: if ($machine.timelines[idx]) {
		machine.set($machine.timelines[idx])
	}

	$: isHalted = $machine.isHalted || $machine.isGlobalHalt

	$: isRunning = timeout != null
	function onReset() {
		try {
			const m = interpret($code)
			m.reset(value)
			machine.set(m)
			shouldRerenderGraph.set(true)
			idx = 0
			message.set({
				text: 'Compiled successfully.',
				type: 'info',
			})
		} catch (err) {
			message.set({
				text: err.message,
				type: 'error',
			})
		}
	}

	function onStep() {
		if (!isHalted) {
			$machine.step()
			machine.set($machine)
		} else if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
	}

	function onPlay() {
		if (timeout) {
			clearInterval(timeout)
			return (timeout = null)
		}

		timeout = setInterval(onStep, 200)
	}

	function onSubmit() {
		onReset()
		onPlay()
	}

	function onShowGraph() {
		modal.set('graph-dialog')
	}
</script>

<form on:submit|preventDefault={onSubmit}>
	<div>
		<label for="input" class="block">Initial input</label>
		<input
			type="text"
			id="input"
			class="text-gray-900 rounded-md py-1 w-full placeholder:text-gray-400 placeholder:italic"
			placeholder="Input value..."
			bind:value
		/>
	</div>
	<div class="mt-2">
		<label for="timeline" class="block">Timeline</label>
		<select
			id="timeline"
			bind:value={idx}
			disabled={$machine.timelines.length == 0 || isRunning}
			class="rounded-md py-1 w-full text-gray-900"
		>
			{#each $machine.timelines as t (t.id)}
				<option value={t.id}>
					{t.id}
					{#if t.isHalted}({t.isAccepted ? 'accepted' : 'dead'}){/if}
				</option>
			{/each}
		</select>
	</div>
	<p class="text-sm font-semibold min-h-[3rem] mt-1 message {$message.type}">
		{$message.text}
	</p>
	<div class="grid gap-2 max-md:grid-cols-2">
		<button
			type="button"
			class="btn bg-green-700 enabled:hover:bg-green-800 enabled:active:bg-green-900 border-transparent text-white"
			disabled={isHalted}
			on:click={onPlay}>{isRunning ? 'Pause' : 'Play'}</button
		>
		<button
			type="button"
			class="btn default"
			disabled={isHalted || isRunning}
			on:click={onStep}>Step</button
		>
		<button
			type="button"
			class="btn default"
			disabled={isRunning}
			on:click={onReset}
		>
			Reset
		</button>
		<button type="button" class="btn default" on:click={onShowGraph}>
			Show Graph
		</button>
	</div>
</form>

<style lang="postcss">
	.message {
		@apply text-gray-400;
	}

	.message.info {
		@apply text-green-600;
	}

	.message.error {
		@apply text-red-500;
	}

	:disabled {
		@apply cursor-not-allowed opacity-50;
	}

	.btn {
		@apply flex-1 rounded-md py-1 transition-colors font-medium border-solid border shadow-sm gdark:border-transparent;
	}

	.default {
		@apply bg-gray-100 enabled:hover:bg-gray-200 enabled:active:bg-gray-300 text-gray-800
		border-gray-300;
	}
</style>
