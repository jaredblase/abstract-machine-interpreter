<script lang="ts">
  import Counter from './lib/Counter.svelte'
	import InfoIcon from './assets/info.svelte'
</script>

<header class="dark:text-white">
	<div class="container mx-auto py-4 flex sm:justify-between justify-center px-4 relative">
		<h1 class="text-3xl font-mono select-none">Abstract</h1>
		<InfoIcon class="w-7 cursor-pointer icon absolute right-4 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0" />
	</div>
</header>
<main>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .read-the-docs {
    color: #888;
  }
</style>