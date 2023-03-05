<script lang="ts">
  import { interpret, logTree } from '../lib/interpreter'
  import type { AbstractMachine } from '../lib/interpreter/AbstractMachine'
  import { message, code } from '../stores/editor'
  import { isHalted, timelines, update } from '../stores/machine'

  let machine: AbstractMachine
  let value = ''
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

  $: if ($timelines[idx]) {
    update($timelines[idx])
  }

  $: isRunning = timeout != null
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

  function onStep() {
    console.log('step')
    if (!$isHalted) {
      machine.step()
      update(machine)
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
</script>

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
    disabled={$timelines.length == 0 || isRunning}
    class="rounded-md py-1 w-full text-gray-900"
  >
    {#each $timelines as t (t.id)}
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
    class="btn bg-green-600 enabled:hover:bg-green-700 enabled:active:bg-green-800 text-white"
    disabled={$isHalted}
    on:click={onPlay}>{isRunning ? 'Pause' : 'Play'}</button
  >
  <button
    class="btn default"
    disabled={$isHalted || isRunning}
    on:click={onStep}>Step</button
  >
  <button class="btn default max-md:col-span-2" disabled={isRunning} on:click={onReset}>
    Reset
  </button>
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

  :disabled {
    @apply cursor-not-allowed opacity-50;
  }

  .btn {
    @apply flex-1 rounded-md py-1 transition-colors font-medium;
  }

  .default {
    @apply bg-gray-100 enabled:hover:bg-gray-200 enabled:active:bg-gray-300 text-gray-800;
  }
</style>
