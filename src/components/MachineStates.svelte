<script lang="ts">
	import BoxedLabel from './BoxedLabel.svelte'
	import { machine } from '../stores/machine'
	import Tape from './Tape.svelte'

	$: label =
		'INPUT' +
		($machine.isInputTapeGenerated ? '' : ` (${$machine.inputMemoryId})`)
</script>

<section class="mb-8 px-4">
	<div class="container mx-auto space-y-8">
		<BoxedLabel {label}>
			<div
				class="overflow-auto py-3 h-28 scrollbar-thin scrollbar-thumb-[#ffffff30] scrollbar-track-transparent grid place-items-center"
			>
					<Tape
						tape={$machine.inputMemory}
						class="text-lg md:text-3xl font-mono flex [&_:first-child]:ml-auto [&_:last-child]:mr-auto"
					/>
			</div>
		</BoxedLabel>
		<BoxedLabel label="OUTPUT">
			<p>{$machine.output || '...'}</p>
		</BoxedLabel>
		<div class="grid grid-cols-2 gap-x-4">
			<BoxedLabel label="STATE">
				<p>{$machine.currStateName || '...'}</p>
			</BoxedLabel>
			<BoxedLabel label="STEPS">
				<p>{$machine.steps}</p>
			</BoxedLabel>
		</div>
	</div>
</section>

<style lang="postcss">
	p {
		@apply text-lg md:text-3xl font-mono flex justify-center flex-wrap break-before-all px-2 py-3;
	}
</style>
