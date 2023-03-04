<script lang="ts">
  import BoxedLabel from './BoxedLabel.svelte'
  import { input, idx, output, currState, steps } from '../stores/machine'
  import Tape from './Tape.svelte'
</script>

<section class="mb-8 px-4">
  <div class="container mx-auto space-y-8">
    <BoxedLabel label="Input">
      <Tape value={$input} markIdx={$idx} />
    </BoxedLabel>
    <BoxedLabel label="Output">
      <Tape value={$output} />
    </BoxedLabel>
    <div class="grid grid-cols-2 gap-x-4">
      <BoxedLabel label="State">
        {$currState || '...'}
      </BoxedLabel>
      <BoxedLabel label="Steps">
        {$steps}
      </BoxedLabel>
    </div>
  </div>
</section>
