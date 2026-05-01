<script>
	import { page } from '$app/state';

	let { children } = $props();
</script>

<nav
	class={[page.data.color]}
	style:background={page.data.color || 'var(--bg-2)'}
>
	<a href="/v/pagejs">home</a>
	<a href="/v/pagejs/red">red</a>
	<a href="/v/pagejs/green">green</a>
	<a href="/v/pagejs/blue">blue</a>
	{#if page.data.component}
		<page.data.component />
	{/if}
</nav>

{@render children()}
