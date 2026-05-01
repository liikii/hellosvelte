<script lang="ts">
	let { children } = $props();
    import NavColumn from '$lib/NavColumn.svelte';
    const links = [
        { path: "/v/routingparams", name: "Default" },
        { path: "/v/routingparams/en", name: "English" },
        { path: "/v/routingparams/de", name: "German" },
        { path: "/v/routingparams/fr", name: "French" },
    ];
</script>

<NavColumn links={links} />


{@render children()}
