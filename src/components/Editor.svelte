<script lang="ts">
  import { code } from '../stores/code'
  import CodeMirror from 'svelte-codemirror-editor'
  import { theme, highlights } from '../lib/absmac/styles'
  import { AbsMac } from '../lib/absmac'

  let className = ''

  export { className as class }
</script>

<header class="bg-neutral-700 px-4 py-1">
  <h2 class="font-medium text-sm">Abstract Machine Code Editor</h2>
</header>
<div class={className}>
  <CodeMirror
    bind:value={$code}
    theme={[theme, highlights]}
    lang={AbsMac()}
    placeholder="Enter your code here..."
  />
</div>
