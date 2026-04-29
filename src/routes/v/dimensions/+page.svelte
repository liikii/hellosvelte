<script lang="ts">
	let w = $state();
	let h = $state();
	let size = $state(42);
</script>

<pre>你能给任何 HTML 元素绑定这 4 个尺寸属性：
bind:clientWidth 内容区域（content）和内边距（padding），但不包括边框（border）、滚动条（scrollbar）以及外部边距（margin）
bind:clientHeight
bind:offsetWidth 包括元素的 content、padding、border，以及垂直滚动条（如果存在的话）。它不包括 margin。
bind:offsetHeight
Svelte 会自动用 ResizeObserver 监听元素大小变化，实时更新变量。
</pre>

<label>
	<input type="range" bind:value={size} min="10" max="100" />
	font size ({size}px)
</label>

<div  bind:clientWidth={w} bind:clientHeight={h}>
	<span style="font-size: {size}px" contenteditable>edit this text</span>
	<span class="size">{w} x {h}px</span>
</div>
