<script lang="ts">
	let { children } = $props();
    import NavColumn from '$lib/NavColumn.svelte';
    const links = [
        {
            path: '/v/redirect',
            name: 'redirect home',
        },
        {
            path: '/v/redirect/a',
            name: 'a but redirects to b',
        },
        {
            path: '/v/redirect/b',
            name: 'b',
        },
    ];
</script>

{@render children()}

<NavColumn links={links} />
