
### prop state 
SvelteKit makes three readonly state objects available via the $app/state module — **page, navigating and updated**. The one you'll use most often is page, which provides information about the current page


### props navigating
```ts
<script>
	import { page, navigating } from '$app/state';
	let { children } = $props();
</script>

<nav>
	<a href="/" aria-current={page.url.pathname === '/'}>
		home
	</a>

	<a href="/about" aria-current={page.url.pathname === '/about'}>
		about
	</a>
		{#if navigating.to}
		navigating to {navigating.to.url.pathname}
	{/if}
</nav>

{@render children()}

```



### prop stats updated
```ts
用 $app/state 的 updated 检测网站新版本 → 提示用户刷新页面，并配置自动检查频率 + 手动检查方法
version: {
			// ideally, this should be something deterministic
			// like the output of `git rev-parse HEAD`
			name: Date.now().toString(),

			// if undefined, no polling will occur
			pollInterval: 5000
		}
```