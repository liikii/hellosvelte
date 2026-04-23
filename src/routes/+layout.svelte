<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
	import { onMount } from 'svelte';
	import '../scss/styles.scss'

	onMount(async () => {
    	await import('bootstrap');
  });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
