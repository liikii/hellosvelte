<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	let { children } = $props();
	import { onMount } from "svelte";
	import "../scss/styles.scss";

	onMount(async () => {
		await import("bootstrap");
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

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
				<li class="nav-item">
					<a href="#" class="nav-link active" aria-current="page">
						Home
					</a>
				</li>
				<li>
					<a href="#" class="nav-link link-body-emphasis">
						Dashboard
					</a>
				</li>
				<li>
					<a href="#" class="nav-link link-body-emphasis"> Orders </a>
				</li>
				<li>
					<a href="#" class="nav-link link-body-emphasis">
						Products
					</a>
				</li>
				<li>
					<a href="#" class="nav-link link-body-emphasis">
						Customers
					</a>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link active" aria-current="page">
						Home
					</a>
				</li>
				<li>
					<a href="#" class="nav-link link-body-emphasis">
						Dashboard
					</a>
				</li>
				<li>
					<a href="#" class="nav-link link-body-emphasis"> Orders </a>
				</li>
				<li>
					<a href="#" class="nav-link link-body-emphasis">
						Products
					</a>
				</li>
				<li>
					<a href="#" class="nav-link link-body-emphasis">
						Customers
					</a>
				</li>
			</ul>
			</dev>
		</div>

		<!-- 右侧 5/6 -->
		<div class="col-10 bg-light p-4 overflow-auto">
			{@render children()}
		</div>
	</div>
</div>
