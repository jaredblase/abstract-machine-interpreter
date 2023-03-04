<script lang="ts">
  import { interpret } from '../lib/interpreter'
  import type { AbstractMachine } from '../lib/interpreter/AbstractMachine'
  import { message, code } from '../stores/editor'
  import { update } from '../stores/machine'

  let machine: AbstractMachine
  let value = ''

  $: {
    if (value || $code) {
      message.set({
        text: 'Changes have not been saved...',
        type: '',
      })
    }
  }

  function onReset() {
    try {
      machine = interpret($code)
      machine.reset(value)
      update(machine)
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

  function onPause() {}

  function onStep() {
    machine.step()
    update(machine)
  }

  function onPlay() {}
</script>

<label for="input" class="block">Initial input</label>
<input
  type="text"
  id="input"
  class="text-gray-900 rounded-md py-1 w-full"
  bind:value
/>
<p class="text-sm font-semibold min-h-[3rem] mt-1 message {$message.type}">
  {$message.text}
</p>
<div class="grid gap-2 grid-cols-2 md:grid-cols-1">
  <button
    class="btn bg-green-600 hover:bg-green-700 active:bg-green-800 text-white"
    on:click={onPlay}>Play</button
  >
  <button class="btn default" on:click={onPause}>Pause</button>
  <button class="btn default" on:click={onStep}>Step</button>
  <button class="btn default" on:click={onReset}>Reset</button>
</div>

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

  .btn {
    @apply flex-1 rounded-md py-1 transition-colors font-medium;
  }

  .default {
    @apply bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800;
  }
</style>
