<script lang="ts">
	let { children } = $props();
    import NavColumn from '$lib/NavColumn.svelte';
    const links = [
        {
            path: '/v/error',
            name: 'error home',
        },
        {
            path: '/v/error/expected',
            name: 'page with expected error',
        },
        {
            path: '/v/error/unexpected',
            name: 'page with unexpected error',
        },
    ];
</script>

{@render children()}

<NavColumn links={links} />
<!-- 
<nav class="nav">
	    <a class="nav-link" href="/v/error">error home</a>
    </li>
	<li class="nav-item">
	    <a class="nav-link" href="/v/error/expected">page with expected error</a>
	</li>
	<li class="nav-item">
	    <a class="nav-link" href="/v/error/unexpected">page with unexpected error</a>
	</li>
</nav>
 -->
