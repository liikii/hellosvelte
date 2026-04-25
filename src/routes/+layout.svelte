<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	let { children } = $props();
	import { onMount } from "svelte";
	import "../scss/styles.scss";

	onMount(async () => {
		await import("bootstrap");
	});
	let menuItems = [
		{ path: "/", name: "Home" },
		{ path: "/dashboard", name: "Dashboard" },
		{ path: "/orders", name: "Orders" },
		{ path: "/products", name: "Products" },
		{ path: "/customers", name: "Customers" },
		{ path: "/b", name: "Home" },
		{ path: "/dashboardb", name: "Dashboard" },
		{ path: "/ordersb", name: "Orders" },
		{ path: "/productsb", name: "Products" },
		{ path: "/customersb", name: "Customers" },
	];

	let activeIndex = $state(0);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#snippet getnavli(path: string, name: string, index: number)}
<li class="nav-item">
	<a href="/" class="nav-link" aria-current="page" 
		class:active={activeIndex === index} 
		onclick={() => activeIndex = index}>
		{name}
	</a>
</li>
{/snippet}

<div class="container-fluid vh-100">
	<div class="row h-100">
		<!-- 左侧 1/6 -->
		<div
			class="col-2 d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary shadow h-100"
		>
			<div
				class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
			>
				<i class="bi bi-android2 text-success me-2"></i>
				<span class="fs-4">Sidebar</span>
			</div>
			<hr />
			<dev class="overflow-y-auto flex-grow-1">
			<ul class="nav nav-pills flex-column mb-auto w-100">
				{#each menuItems as item, index}
					{@render getnavli(item.path, item.name, index)}
				{/each}
			</ul>
			</dev>
		</div>

		<!-- 右侧 5/6 -->
		<div class="col-10 bg-light p-4 overflow-auto">
			{@render children()}
		</div>
	</div>
</div>
