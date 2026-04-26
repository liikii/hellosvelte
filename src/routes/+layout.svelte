<script lang="ts">
	import favicon from "$lib/assets/basket.png";
	import { menuItems, svelteMenuItems } from "$lib/menuConfig";
	import { onMount } from "svelte";
	import "../scss/styles.scss";
	import { goto } from "$app/navigation";

	onMount(async () => {
		await import("bootstrap");
	});

	let { children } = $props();
	let activeIndex = $state(0);
	const titles = ["Bootstrap", "Svelte"];
	const menu_list = [menuItems, svelteMenuItems];
	let titleIndex = $state(0);

	// 使用 $derived 自动获取当前文字
	let currentTitle = $derived(titles[titleIndex]);
	let currentMenuItems = $derived(menu_list[titleIndex]);

	$effect(() => {
		console.log("current menu index ", activeIndex);
		if (activeIndex === 0) {
			goto(currentMenuItems[0].path);
		}
	});

	function toggleTitle() {
		// 索引在数组长度内循环 (0, 1, 2, 3 -> 0)
		titleIndex = (titleIndex + 1) % titles.length;
		activeIndex = 0;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>full basket</title>
</svelte:head>

{#snippet getnavli(
	path: string,
	name: string,
	index: number,
	ifbottom: boolean = false,
)}
	<li class="nav-item {ifbottom ? 'border-bottom border-success' : ''}">
		<a
			href={path}
			class="nav-link fs-10"
			aria-current="page"
			class:active={activeIndex === index}
			onclick={() => (activeIndex = index)}
		>
			{name}
		</a>
	</li>
{/snippet}

<div class="container-fluid vh-100">
	<div class="row h-100">
		<!-- 左侧 1/6 -->
		<div
			class="col-2 d-flex flex-column flex-shrink-0 p-2 bg-body-tertiary shadow h-100"
		>
			<!-- <div onclick={toggleTitle}
				class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
			>
				<i class="bi bi-android2 text-success me-2 fs-3"></i>
				<span class="fs-5">{currentTitle}</span>
			</div> -->
			<button
				onclick={toggleTitle}
				type="button"
				class="btn d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none border-0 p-0 w-100 text-start"
			>
				<i class="bi bi-android2 text-success me-2 fs-3"></i>
				<span class="fs-5">{currentTitle}</span>
			</button>
			<hr class="my-3" />
			<dev class="overflow-y-auto flex-grow-1">
				<ul class="nav nav-pills flex-column mb-auto w-100">
					{#each currentMenuItems as item, index}
						{@render getnavli(item.path, item.name, index)}
					{/each}
				</ul>
			</dev>
		</div>

		<!-- 右侧 5/6 -->
		<div class="col-10 bg-light p-4 overflow-auto h-100">
			{@render children()}
		</div>
	</div>
</div>
