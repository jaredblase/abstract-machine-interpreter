<script lang="ts">
  import BoxedLabel from './BoxedLabel.svelte'
  import { input, idx, output, currState, steps } from '../stores/machine'
  import Tape from './Tape.svelte'
</script>

<section class="mb-8 px-4">
  <div class="container mx-auto space-y-8">
    <BoxedLabel label="Input">
      <p>
        <Tape value={$input} markIdx={$idx} />
      </p>
    </BoxedLabel>
    <BoxedLabel label="Output">
      <p>
        <Tape value={$output} />
      </p>
    </BoxedLabel>
    <div class="grid grid-cols-2 gap-x-4">
      <BoxedLabel label="State">
        <p>{$currState || '...'}</p>
      </BoxedLabel>
      <BoxedLabel label="Steps">
        <p>{$steps}</p>
      </BoxedLabel>
    </div>
  </div>
</section>

<style lang="postcss">
  p {
    @apply text-lg md:text-3xl font-mono flex justify-center flex-wrap break-before-all px-2
  }
</style>
