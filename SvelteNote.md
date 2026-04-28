
### Contenteditable bindings
app
```ts
<script>
	let html = $state('<p>Write some text!</p>');
</script>

<div bind:innerHTML={html} contenteditable></div>

<pre>{html}</pre>

```



### each block binding
app
```ts
<script>
	let todos = $state([
		{ done: false, text: 'finish Svelte tutorial' },
		{ done: false, text: 'build an app' },
		{ done: false, text: 'world domination' }
	]);

	function add() {
		todos.push({
			done: false,
			text: ''
		});
	}

	function clear() {
		todos = todos.filter((t) => !t.done);
	}

	let remaining = $derived(todos.filter((t) => !t.done).length);
</script>

<div class="centered">
	<h1>todos</h1>

	<ul class="todos">
		{#each todos as todo}
			<li class={{ done: todo.done }}>
				<input
					type="checkbox"
					bind:checked={todo.done}
				/>

				<input
					type="text"
					placeholder="What needs to be done?"
					bind:value={todo.text}
				/>
			</li>
		{/each}
	</ul>

	<p>{remaining} remaining</p>

	<button onclick={add}>
		Add new
	</button>

	<button onclick={clear}>
		Clear completed
	</button>
</div>
```



### Media elements
 
app
```ts
<script>
	import AudioPlayer from './AudioPlayer.svelte';
	import { tracks } from './tracks.js';
</script>

<div class="centered">
	{#each tracks as track}
		<AudioPlayer {...track} />
	{/each}
</div>

<style>
	.centered {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		gap: 0.5em;
		max-width: 40em;
		margin: 0 auto;
	}
</style>
```


AudioPlayer.svelte
```ts
<script>
	let { src, title, artist } = $props();

	let time = $state(0);
	let duration = $state(0);
	let paused = $state(true);

	function format(time) {
		if (isNaN(time)) return '...';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}
</script>

<div class={['player', { paused }]}>
	<audio
		{src}
		bind:currentTime={time}
		bind:duration
		bind:paused
		onended={() => {
			time = 0;
		}}
	></audio>
	
	<button
		class="play"
		aria-label={paused ? 'play' : 'pause'}
		onclick={() => paused = !paused}
	></button>

	<div class="info">
		<div class="description">
			<strong>{title}</strong> /
			<span>{artist}</span>
		</div>

		<div class="time">
			<span>{format(time)}</span>
			<div
				class="slider"
				onpointerdown={e => {
					const div = e.currentTarget;

					function seek(e) {
						const { left, width } = div.getBoundingClientRect();

						let p = (e.clientX - left) / width;
						if (p < 0) p = 0;
						if (p > 1) p = 1;

						// TODO update the time
						time = p * duration;
					}

					seek(e);

					window.addEventListener('pointermove', seek);

					window.addEventListener('pointerup', () => {
						window.removeEventListener('pointermove', seek);
					}, {
						once: true
					});
				}}
			>
				<div class="progress" style="--progress: {time / duration}%"></div>
			</div>
			<span>{duration ? format(duration) : '--:--'}</span>
		</div>
	</div>
</div>

<style>
	.player {
		display: grid;
		grid-template-columns: 2.5em 1fr;
		align-items: center;
		gap: 1em;
		padding: 0.5em 1em 0.5em 0.5em;
		border-radius: 2em;
		background: var(--bg-1);
		transition: filter 0.2s;
		color: var(--fg-3);
		user-select: none;
	}

	.player:not(.paused) {
		color: var(--fg-1);
		filter: drop-shadow(0.5em 0.5em 1em rgba(0,0,0,0.1));
	}

	button {
		width: 100%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		border-radius: 50%;
	}

	[aria-label="pause"] {
		background-image: url(./pause.svg);
	}

	[aria-label="play"] {
		background-image: url(./play.svg);
	}

	.info {
		overflow: hidden;
	}

	.description {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.time span {
		font-size: 0.7em;
	}

	.slider {
		flex: 1;
		height: 0.5em;
		background: var(--bg-2);
		border-radius: 0.5em;
		overflow: hidden;
	}

	.progress {
		width: calc(100 * var(--progress));
		height: 100%;
		background: var(--bg-3);
	}
</style>

```



tracks.ts
```ts
export const tracks = [
	{
		// https://musopen.org/music/9862-the-blue-danube-op-314/
		src: 'https://sveltejs.github.io/assets/music/strauss.mp3',
		title: 'The Blue Danube Waltz',
		artist: 'Johann Strauss'
	},

	{
		// https://musopen.org/music/43775-the-planets-op-32/
		src: 'https://sveltejs.github.io/assets/music/holst.mp3',
		title: 'Mars, the Bringer of War',
		artist: 'Gustav Holst'
	},

	{
		// https://musopen.org/music/8010-3-gymnopedies/
		src: 'https://sveltejs.github.io/assets/music/satie.mp3',
		title: 'Gymnopédie no. 1',
		artist: 'Erik Satie'
	},

	{
		// https://musopen.org/music/43683-requiem-in-d-minor-k-626/
		src: 'https://sveltejs.github.io/assets/music/mozart.mp3',
		title: 'Requiem in D minor, K. 626 - III. Sequence - Lacrymosa',
		artist: 'Wolfgang Amadeus Mozart'
	}
];

```



### dimensions

你能给任何 HTML 元素绑定这 4 个尺寸属性：
bind:clientWidth
bind:clientHeight
bind:offsetWidth
bind:offsetHeight
Svelte 会自动用 ResizeObserver 监听元素大小变化，实时更新变量。

app
```ts
<script>
	let w = $state();
	let h = $state();
	let size = $state(42);
</script>

<label>
	<input type="range" bind:value={size} min="10" max="100" />
	font size ({size}px)
</label>

<div  bind:clientWidth={w} bind:clientHeight={h}>
	<span style="font-size: {size}px" contenteditable>edit this text</span>
	<span class="size">{w} x {h}px</span>
</div>

<style>
	div {
		position: relative;
		display: inline-block;
		padding: 0.5rem;
		background: hsla(15, 100%, 50%, 0.1);
		border: 1px solid hsl(15, 100%, 50%);
	}

	.size {
		position: absolute;
		right: -1px;
		bottom: -1.4em;
		line-height: 1;
		background: hsl(15, 100%, 50%);
		color: white;
		padding: 0.2em 0.5em;
		white-space: pre;
	}
</style>

```


### binding this
bind:this = 拿到元素自己

app
```svelte
<script>
	import { paint } from './gradient.js';
		let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');

		let frame = requestAnimationFrame(function loop(t) {
			frame = requestAnimationFrame(loop);
			paint(context, t);
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});
</script>

<canvas  bind:this={canvas} width={32} height={32}></canvas>

<style>
	canvas {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #666;
		mask: url(./svelte-logo-mask.svg) 50% 50% no-repeat;
		mask-size: 60vmin;
		-webkit-mask: url(./svelte-logo-mask.svg) 50% 50% no-repeat;
		-webkit-mask-size: 60vmin;
	}
</style>

```

gradient.js
```
export function paint(context, t) {
	const { width, height } = context.canvas;
	const imageData = context.getImageData(0, 0, width, height);

	for (let p = 0; p < imageData.data.length; p += 4) {
		const i = p / 4;
		const x = i % width;
		const y = (i / width) >>> 0;

		const red = 64 + (128 * x) / width + 64 * Math.sin(t / 1000);
		const green = 64 + (128 * y) / height + 64 * Math.cos(t / 1000);
		const blue = 128;

		imageData.data[p + 0] = red;
		imageData.data[p + 1] = green;
		imageData.data[p + 2] = blue;
		imageData.data[p + 3] = 255;
	}

	context.putImageData(imageData, 0, 0);
}
```


### Component bindings
用 $bindable + bind: 实现父子组件之间的双向数据同步

app.svelte

```ts
<script>
	import Keypad from './Keypad.svelte';

	let pin = $state('');

	let view = $derived(pin
		? pin.replace(/\d(?!$)/g, '•')
		: 'enter your pin');

	function onsubmit() {
		alert(`submitted ${pin}`);
	}
</script>

<h1 style="opacity: {pin ? 1 : 0.4}">
	{view}
</h1>

<Keypad bind:value={pin} {onsubmit} />

```


Keypad.svelte
```ts
<script>
	let { value = $bindable(''), onsubmit } = $props();

	const select = (num) => () => (value += num);
	const clear = () => (value = '');
</script>

<div class="keypad">
	<button onclick={select(1)}>1</button>
	<button onclick={select(2)}>2</button>
	<button onclick={select(3)}>3</button>
	<button onclick={select(4)}>4</button>
	<button onclick={select(5)}>5</button>
	<button onclick={select(6)}>6</button>
	<button onclick={select(7)}>7</button>
	<button onclick={select(8)}>8</button>
	<button onclick={select(9)}>9</button>

	<button disabled={!value} onclick={clear}>
		clear
	</button>

	<button onclick={select(0)}>0</button>

	<button disabled={!value} onclick={onsubmit}>
		submit
	</button>
</div>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(3, 5em);
		grid-template-rows: repeat(4, 3em);
		grid-gap: 0.5em;
	}

	button {
		margin: 0;
	}
</style>

```



### Binding to component instances


bind:this 拿组件 → export 暴露方法 → 父组件直接调用

App.svelte
```ts
<script>
	import Canvas from './Canvas.svelte';
	import { trapFocus } from './attachments.svelte.js';
	let canvas;
	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'black'];

	let selected = $state(colors[0]);
	let size = $state(10);
	let showMenu = $state(true);
</script>

<div class="container">
	<Canvas  bind:this={canvas} color={selected} size={size} />

	{#if showMenu}
		<div
			role="presentation"
			class="modal-background"
			onclick={(event) => {
				if (event.target === event.currentTarget) {
					showMenu = false;
				}
			}}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					showMenu = false;
				}
			}}
		>
			<div class="menu" {@attach trapFocus}>
				<div class="colors">
					{#each colors as color}
						<button
							class="color"
							aria-label={color}
							aria-current={selected === color}
							style="--color: {color}"
							onclick={() => {
								selected = color;
							}}
						></button>
					{/each}
				</div>

				<label>
					small
					<input type="range" bind:value={size} min="1" max="50" />
					large
				</label>
			</div>
		</div>
	{/if}

	<div class="controls">
		<button class="show-menu" onclick={() => showMenu = !showMenu}>
			{showMenu ? 'close' : 'menu'}
		</button>
		<button onclick={() => canvas.clear()}>
		clear
	</button>
	</div>
</div>

<style>
	.container {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.controls {
		position: absolute;
		left: 0;
		top: 0;
		padding: 1em;
	}

	.show-menu {
		width: 5em;
	}

	.modal-background {
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(20px);
	}

	.menu {
		position: relative;
		background: var(--bg-2);
		width: calc(100% - 2em);
		max-width: 28em;
		padding: 1em 1em 0.5em 1em;
		border-radius: 1em;
		box-sizing: border-box;
		user-select: none;
	}

	.colors {
		display: grid;
		align-items: center;
		grid-template-columns: repeat(9, 1fr);
		grid-gap: 0.5em;
	}

	.color {
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--color, #fff);
		transform: none;
		filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.2));
		transition: all 0.1s;
	}

	.color[aria-current="true"] {
		transform: translate(1px, 1px);
		filter: none;
		box-shadow: inset 3px 3px 4px rgba(0,0,0,0.2);
	}

	.menu label {
		display: flex;
		width: 100%;
		margin: 1em 0 0 0;
	}

	.menu input {
		flex: 1;
	}
</style>

```

Canvas.svelte
```ts
<script>
	let { color, size } = $props();

	let canvas = $state();
	let context = $state();
	let coords = $state();
	export function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	$effect(() => {
		context = canvas.getContext('2d');

		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		window.addEventListener('resize', resize);
		resize();

		return () => {
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	onpointerdown={(e) => {
		coords = { x: e.offsetX, y: e.offsetY };

		context.fillStyle = color;
		context.beginPath();
		context.arc(coords.x, coords.y, size / 2, 0, 2 * Math.PI);
		context.fill();
	}}
	onpointerleave={() => {
		coords = null;
	}}
	onpointermove={(e) => {
		const previous = coords;

		coords = { x: e.offsetX, y: e.offsetY };

		if (e.buttons === 1) {
			e.preventDefault();

			context.strokeStyle = color;
			context.lineWidth = size;
			context.lineCap = 'round';
			context.beginPath();
			context.moveTo(previous.x, previous.y);
			context.lineTo(coords.x, coords.y);
			context.stroke();
		}
	}}
></canvas>

{#if coords}
	<div
		class="preview"
		style="--color: {color}; --size: {size}px; --x: {coords.x}px; --y: {coords.y}px"
	></div>
{/if}

<style>
	canvas {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.preview {
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: var(--size);
		height: var(--size);
		transform: translate(-50%, -50%);
		background: var(--color);
		border-radius: 50%;
		opacity: 0.5;
		pointer-events: none;
	}
</style>

```


attachments.svelte.js
```ts
import { on } from 'svelte/events';

export function trapFocus(node) {
	const previous = document.activeElement;

	function focusable() {
		return Array.from(node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
	}

	function handleKeydown(event) {
		if (event.key !== 'Tab') return;

		const current = document.activeElement;

		const elements = focusable();
		const first = elements.at(0);
		const last = elements.at(-1)

		if (event.shiftKey && current === first) {
			last.focus();
			event.preventDefault();
		}

		if (!event.shiftKey && current === last) {
			first.focus();
			event.preventDefault();
		}
	}

	focusable()[0]?.focus();
	const off = on(node, 'keydown', handleKeydown);

	return () => {
		off();
		previous?.focus();
	};
}

```





-----


## Advanced transitions

### Deferred transitions
App.svelte
```ts
<script>
	import TodoList from './TodoList.svelte';

	const todos = $state([
		{ id: 1, done: false, description: 'write some docs' },
		{ id: 2, done: false, description: 'start writing blog post' },
		{ id: 3, done: true, description: 'buy some milk' },
		{ id: 4, done: false, description: 'mow the lawn' },
		{ id: 5, done: false, description: 'feed the turtle' },
		{ id: 6, done: false, description: 'fix some bugs' }
	]);

	let uid = todos.length + 1;

	function remove(todo) {
		const index = todos.indexOf(todo);
		todos.splice(index, 1);
	}
</script>

<div class="board">
	<input
		placeholder="what needs to be done?"
		onkeydown={(e) => {
			if (e.key !== 'Enter') return;

			todos.push({
				id: uid++,
				done: false,
				description: e.currentTarget.value
			});

			e.currentTarget.value = '';
		}}
	/>

	<div class="todo">
		<h2>todo</h2>
		<TodoList todos={todos.filter((t) => !t.done)} {remove} />
	</div>

	<div class="done">
		<h2>done</h2>
		<TodoList todos={todos.filter((t) => t.done)} {remove} />
	</div>
</div>

<style>
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 1em;
		max-width: 36em;
		margin: 0 auto;
	}

	.board > input {
		font-size: 1.4em;
		grid-column: 1/3;
		padding: 0.5em;
		margin: 0 0 1rem 0;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
	}
</style>

```

TodoList.svelte
```ts
<script>
		import { send, receive } from './transition.js';
	let { todos, remove } = $props();
	
</script>

<ul class="todos">
	{#each todos as todo (todo.id)}
		<li
			class={{ done: todo.done }}
				in:receive={{ key: todo.id }}
	out:send={{ key: todo.id }}
		>
			<label>
				<input type="checkbox" bind:checked={todo.done}/>
				<span>{todo.description}</span>
				<button onclick={() => remove(todo)} aria-label="Remove"></button>
			</label>
		</li>
	{/each}
</ul>

<style>
	label {
		width: 100%;
		height: 100%;
		display: flex;
	}

	span {
		flex: 1;
	}

	button {
		background-image: url(./remove.svg);
	}
</style>

```

remove.svg
```ts

```

transition.js
```ts
import { crossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 200),

	fallback(node, params) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 600,
			easing: quintOut,
			css: (t) => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`
		};
	}
});
```




### animations
App.svelte
```ts
<script>
	import TodoList from './TodoList.svelte';

	const todos = $state([
		{ id: 1, done: false, description: 'write some docs' },
		{ id: 2, done: false, description: 'start writing blog post' },
		{ id: 3, done: true, description: 'buy some milk' },
		{ id: 4, done: false, description: 'mow the lawn' },
		{ id: 5, done: false, description: 'feed the turtle' },
		{ id: 6, done: false, description: 'fix some bugs' }
	]);

	let uid = todos.length + 1;

	function remove(todo) {
		const index = todos.indexOf(todo);
		todos.splice(index, 1);
	}
</script>

<div class="board">
	<input
		placeholder="what needs to be done?"
		onkeydown={(e) => {
			if (e.key !== 'Enter') return;

			todos.push({
				id: uid++,
				done: false,
				description: e.currentTarget.value
			});

			e.currentTarget.value = '';
		}}
	/>

	<div class="todo">
		<h2>todo</h2>
		<TodoList todos={todos.filter((t) => !t.done)} {remove} />
	</div>

	<div class="done">
		<h2>done</h2>
		<TodoList todos={todos.filter((t) => t.done)} {remove} />
	</div>
</div>

<style>
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 1em;
		max-width: 36em;
		margin: 0 auto;
	}

	.board > input {
		font-size: 1.4em;
		grid-column: 1/3;
		padding: 0.5em;
		margin: 0 0 1rem 0;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
	}
</style>

```

TodoList.svelte
```ts
<script>
	import { send, receive } from './transition.js';
		import { flip } from 'svelte/animate';
	let { todos, remove } = $props();
</script>

<ul class="todos">
	{#each todos as todo (todo.id)}
		<li
			class={{ done: todo.done }}
			in:receive={{ key: todo.id }}
			out:send={{ key: todo.id }}
				animate:flip={{ duration: 1000 }}
		>
			<label>
				<input type="checkbox" bind:checked={todo.done}/>
				<span>{todo.description}</span>
				<button onclick={() => remove(todo)} aria-label="Remove"></button>
			</label>
		</li>
	{/each}
</ul>

<style>
	label {
		width: 100%;
		height: 100%;
		display: flex;
	}

	span {
		flex: 1;
	}

	button {
		background-image: url(./remove.svg);
	}
</style>

```

remove.svg
```ts
```

transition.js
```ts
```



### Context API
用 Context API 实现父子 / 祖孙组件跨层级通信，不用层层传 props，setContext 存、getContext 取。

App.svelte
```ts
<script>
	import Canvas from './Canvas.svelte';
	import Square from './Square.svelte';

	// we use a seeded random number generator to get consistent jitter
	let seed = 1;

	function random() {
		seed *= 16807;
		seed %= 2147483647;
		return (seed - 1) / 2147483646;
	}

	function jitter(amount) {
		return amount * (random() - 0.5);
	}
</script>

<div class="container">
	<Canvas width={800} height={1200}>
		{#each Array(12) as _, c}
			{#each Array(22) as _, r}
				<Square
					x={180 + c * 40 + jitter(r * 2)}
					y={180 + r * 40 + jitter(r * 2)}
					size={40}
					rotate={jitter(r * 0.05)}
				/>
			{/each}
		{/each}
	</Canvas>
</div>

<style>
	.container {
		height: 100%;
		aspect-ratio: 2 / 3;
		margin: 0 auto;
		background: rgb(224, 219, 213);
		filter: drop-shadow(0.5em 0.5em 1em rgba(0, 0, 0, 0.1));
	}
</style>
```

Canvas.svelte
```ts
<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { setContext } from 'svelte';

	let { width = 100, height = 100, children } = $props();

	let canvas;
	let items = new SvelteSet();
	setContext('canvas', { addItem });

	function addItem(fn) {
		$effect(() => {
			items.add(fn);
			return () => items.delete(fn);
		});
	}

	$effect(() => {
		const ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, width, height);
		items.forEach(fn => fn(ctx));
	});
</script>

<canvas bind:this={canvas} {width} {height}>
	{@render children()}
</canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>

```

Square.svelte
```ts
<script>
	let { x, y, size, rotate } = $props();
	import { getContext } from 'svelte';
	getContext('canvas').addItem(draw);

	function draw(ctx) {
		ctx.save();

		ctx.translate(x, y);
		ctx.rotate(rotate);

		ctx.strokeStyle = 'black';
		ctx.strokeRect(-size / 2, -size / 2, size, size);

		ctx.restore();
	}
</script>

```





## Special elements

### <svelte:window>

用 <svelte:window> 给浏览器窗口绑定全局事件，比如监听整个页面的键盘操作。
app
```ts
<script>
	let key = $state();
	let keyCode = $state();

	function onkeydown(event) {
		key = event.key;
		keyCode = event.keyCode;
	}
</script>

<svelte:window {onkeydown}/>

<div style="text-align: center">
	{#if key}
		<kbd>{key === ' ' ? 'Space' : key}</kbd>
		<p>{keyCode}</p>
	{:else}
		<p>Focus this window and press any key</p>
	{/if}
</div>

<style>
	div {
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	kbd {
		border-radius: 4px;
		font-size: 6em;
		padding: 0.2em 0.5em;
		background-color: #eeeeee;
		border-top: 5px solid #f9f9f9;
		border-left: 5px solid #f9f9f9;
		border-right: 5px solid #aaaaaa;
		border-bottom: 5px solid #aaaaaa;
		color: #555;
	}
</style>

```



### <svelte:window> bindings

The list of properties you can bind to is as follows:

innerWidth
innerHeight
outerWidth
outerHeight
scrollX
scrollY
online — an alias for window.navigator.onLine


App.svelte
```ts
<script>
	let y = $state(0);
</script>

<svelte:window bind:scrollY={y} />

<span>depth: {Math.round(y)}px</span>

<style>
	:global(body) {
		height: 400vw;
		background: url(./deepsea.webp);
		background-size: cover;
	}

	span {
		position: fixed;
		font-size: 2em;
		color: white;
		font-variant: tabular-nums;
	}
</style>

```

deepsea.webp
```webp
```



### <svelte:document>

<svelte:document> 用于监听 document 上的全局事件，比如选中文本事件，注意不要用鼠标进入 / 离开事件。

app
```
<script>
	let selection = $state('');

	const onselectionchange = (e) => {
		selection = document.getSelection().toString();
	};
</script>

<svelte:document  {onselectionchange}/>

<h1>Select this text to fire events</h1>
<p>Selection: {selection}</p>

```


###<svelte:body>
onmouseenter={() => hereKitty = true}
onmouseleave={() => hereKitty = false}

App.svelte
```
<script>
	import kitten from './kitten.png';

	let hereKitty = $state(false);
</script>

<svelte:body onmouseenter={() => hereKitty = true}
	onmouseleave={() => hereKitty = false}/>

<!-- creative commons BY-NC http://www.pngall.com/kitten-png/download/7247 -->
<img
	class={{ curious: hereKitty }}
	alt="Kitten wants to know what's going on"
	src={kitten}
/>

<style>
	img {
		position: absolute;
		left: 0;
		bottom: -60px;
		transform: translate(-80%, 0) rotate(-15deg);
		transform-origin: 100% 100%;
		transition: transform 0.4s;
	}

	.curious {
		transform: translate(-15%, 0) rotate(0deg);
	}

	:global(body) {
		overflow: hidden;
	}
</style>

```

kitten.png
```
```


### <svelte:head>


app
```
<script>
	const themes = ['margaritaville', 'retrowave', 'spaaaaace', 'halloween'];
	let selected = $state(themes[0]);
</script>、
<svelte:head>
	<link rel="stylesheet" href="/tutorial/stylesheets/{selected}.css" />
</svelte:head>

<h1>Welcome to my site!</h1>

<select bind:value={selected}>
	<option disabled>choose a theme</option>

	{#each themes as theme}
		<option>{theme}</option>
	{/each}
</select>

```



### <svelte:element> 

<svelte:element> = 动态标签，用 this 属性决定渲染什么 HTML 元素，替代繁琐的 if 判断。

app
```
<script>
	const options = ['h1', 'h2', 'h3', 'p', 'marquee'];
	let selected = $state(options[0]);
</script>

<select bind:value={selected}>
	{#each options as option}
		<option value={option}>{option}</option>
	{/each}
</select>

<!-- {#if selected === 'h1'}
	<h1>I'm a <code>&lt;h1&gt;</code> element</h1>
{:else}
	<p>TODO others</p>
{/if} -->

<svelte:element this={selected}>
	I'm a <code>{selected}</code> element
</svelte:element>
```


### <svelte:boundary> 
<svelte:boundary> 错误边界：捕获子组件崩溃 → 显示降级 UI → 支持重置，保护应用不整体挂掉。



App.svelte
```
<script>
	import FlakyComponent from './FlakyComponent.svelte';
</script>

<!-- <FlakyComponent /> -->
<svelte:boundary onerror={(e) => console.error(e)}>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<p>Oops! {error.message}</p>
		<button onclick={reset}>Reset</button>
	{/snippet}
</svelte:boundary>
```

FlakyComponent.svelte
```
<script>
	let mouse = $state({ x: 0, y: 0 });
</script>

<svelte:window
	onmousemove={(e) => {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}}
/>

<p>{mouse.x}x{mouse.y}</p>

<button onclick={() => mouse = null}>
	whatever you do, don't click this button
</button>

```



## <script module>

### Sharing code
App.svelte
```ts
<script>
	import AudioPlayer from './AudioPlayer.svelte';
	import { tracks } from './tracks.js';
</script>

<div class="centered">
	{#each tracks as track}
		<AudioPlayer {...track} />
	{/each}
</div>

<style>
	.centered {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		gap: 0.5em;
		max-width: 40em;
		margin: 0 auto;
	}
</style>

```


AudioPlayer.svelte
```ts
<script module>
	let current;
</script>

<script>
	let { src, title, artist } = $props();
	
	let time = $state(0);
	let duration = $state(0);
	let paused = $state(true);

	function format(time) {
		if (isNaN(time)) return '...';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}
</script>

<div class={['player', { paused }]}>
	<audio
		{src}
		bind:currentTime={time}
		bind:duration
		bind:paused
		onplay={(e) => {
		const audio = e.currentTarget;

		if (audio !== current) {
			current?.pause();
			current = audio;
		}
	}}
		onended={() => {
			time = 0;
		}}
	></audio>

	<button
		class="play"
		aria-label={paused ? 'play' : 'pause'}
		onclick={() => paused = !paused}
	></button>

	<div class="info">
		<div class="description">
			<strong>{title}</strong> /
			<span>{artist}</span>
		</div>

		<div class="time">
			<span>{format(time)}</span>
			<div
				class="slider"
				onpointerdown={e => {
					const div = e.currentTarget;

					function seek(e) {
						const { left, width } = div.getBoundingClientRect();

						let p = (e.clientX - left) / width;
						if (p < 0) p = 0;
						if (p > 1) p = 1;

						time = p * duration;
					}

					seek(e);

					window.addEventListener('pointermove', seek);

					window.addEventListener('pointerup', () => {
						window.removeEventListener('pointermove', seek);
					}, {
						once: true
					});
				}}
			>
				<div class="progress" style="--progress: {time / duration}%"></div>
			</div>
			<span>{duration ? format(duration) : '--:--'}</span>
		</div>
	</div>
</div>

<style>
	.player {
		display: grid;
		grid-template-columns: 2.5em 1fr;
		align-items: center;
		gap: 1em;
		padding: 0.5em 1em 0.5em 0.5em;
		border-radius: 2em;
		background: var(--bg-1);
		transition: filter 0.2s;
		color: var(--fg-3);
		user-select: none;
	}

	.player:not(.paused) {
		color: var(--fg-1);
		filter: drop-shadow(0.5em 0.5em 1em rgba(0,0,0,0.1));
	}

	button {
		width: 100%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		border-radius: 50%;
	}

	[aria-label="pause"] {
		background-image: url(./pause.svg);
	}

	[aria-label="play"] {
		background-image: url(./play.svg);
	}

	.info {
		overflow: hidden;
	}

	.description {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.time span {
		font-size: 0.7em;
	}

	.slider {
		flex: 1;
		height: 0.5em;
		background: var(--bg-2);
		border-radius: 0.5em;
		overflow: hidden;
	}

	.progress {
		width: calc(100 * var(--progress));
		height: 100%;
		background: var(--bg-3);
	}
</style>

```

pause.svg
```ts
```

play.svg
```ts
```

tracks.js
```ts
export const tracks = [
	{
		// https://musopen.org/music/9862-the-blue-danube-op-314/
		src: 'https://sveltejs.github.io/assets/music/strauss.mp3',
		title: 'The Blue Danube Waltz',
		artist: 'Johann Strauss'
	},

	{
		// https://musopen.org/music/43775-the-planets-op-32/
		src: 'https://sveltejs.github.io/assets/music/holst.mp3',
		title: 'Mars, the Bringer of War',
		artist: 'Gustav Holst'
	},

	{
		// https://musopen.org/music/8010-3-gymnopedies/
		src: 'https://sveltejs.github.io/assets/music/satie.mp3',
		title: 'Gymnopédie no. 1',
		artist: 'Erik Satie'
	},

	{
		// https://musopen.org/music/43683-requiem-in-d-minor-k-626/
		src: 'https://sveltejs.github.io/assets/music/mozart.mp3',
		title: 'Requiem in D minor, K. 626 - III. Sequence - Lacrymosa',
		artist: 'Wolfgang Amadeus Mozart'
	}
];

```


### export

App.svelte
```ts
<script>
	import AudioPlayer, { pauseAll } from './AudioPlayer.svelte';
	import { tracks } from './tracks.js';
</script>

<div class="centered">
	{#each tracks as track}
		<AudioPlayer {...track} />
	{/each}
	<button onclick={pauseAll}>
		pause all
	</button>
</div>

<style>
	.centered {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		gap: 0.5em;
		max-width: 40em;
		margin: 0 auto;
	}
</style>

```

AudioPlayer.svelte
```ts
<script module>
	let current;
	export function pauseAll() {
		current?.pause();
	}
</script>

<script>
	let { src, title, artist } = $props();

	let time = $state(0);
	let duration = $state(0);
	let paused = $state(true);

	function format(time) {
		if (isNaN(time)) return '...';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}
</script>

<div class={['player', { paused }]}>
	<audio
		{src}
		bind:currentTime={time}
		bind:duration
		bind:paused
		onplay={(e) => {
			const audio = e.currentTarget;

			if (audio !== current) {
				current?.pause();
				current = audio;
			}
		}}
		onended={() => {
			time = 0;
		}}
	></audio>

	<button
		class="play"
		aria-label={paused ? 'play' : 'pause'}
		onclick={() => paused = !paused}
	></button>

	<div class="info">
		<div class="description">
			<strong>{title}</strong> /
			<span>{artist}</span>
		</div>

		<div class="time">
			<span>{format(time)}</span>
			<div
				class="slider"
				onpointerdown={e => {
					const div = e.currentTarget;

					function seek(e) {
						const { left, width } = div.getBoundingClientRect();

						let p = (e.clientX - left) / width;
						if (p < 0) p = 0;
						if (p > 1) p = 1;

						time = p * duration;
					}

					seek(e);

					window.addEventListener('pointermove', seek);

					window.addEventListener('pointerup', () => {
						window.removeEventListener('pointermove', seek);
					}, {
						once: true
					});
				}}
			>
				<div class="progress" style="--progress: {time / duration}%"></div>
			</div>
			<span>{duration ? format(duration) : '--:--'}</span>
		</div>
	</div>
</div>

<style>
	.player {
		display: grid;
		grid-template-columns: 2.5em 1fr;
		align-items: center;
		gap: 1em;
		padding: 0.5em 1em 0.5em 0.5em;
		border-radius: 2em;
		background: var(--bg-1);
		transition: filter 0.2s;
		color: var(--fg-3);
		user-select: none;
	}

	.player:not(.paused) {
		color: var(--fg-1);
		filter: drop-shadow(0.5em 0.5em 1em rgba(0,0,0,0.1));
	}

	button {
		width: 100%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		border-radius: 50%;
	}

	[aria-label="pause"] {
		background-image: url(./pause.svg);
	}

	[aria-label="play"] {
		background-image: url(./play.svg);
	}

	.info {
		overflow: hidden;
	}

	.description {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.time span {
		font-size: 0.7em;
	}

	.slider {
		flex: 1;
		height: 0.5em;
		background: var(--bg-2);
		border-radius: 0.5em;
		overflow: hidden;
	}

	.progress {
		width: calc(100 * var(--progress));
		height: 100%;
		background: var(--bg-3);
	}
</style>

```

pause.svg
```ts
```

play.svg
```ts
```

tracks.js
```ts
```





## sveltekit 

### slug
```
To create routes with dynamic parameters, use square brackets around a valid variable name. For example, a file like src/routes/blog/[slug]/+page.svelte will create a route that matches /blog/one, /blog/two, /blog/three and so on.
```
<aside>
		<h2>More posts</h2>
		<ul>
			{#each data.summaries as { slug, title }}
				<li>
					<a href="/blog/{slug}">{title}</a>
				</li>
			{/each}
		</ul>
	</aside>
</div>


### pagedata


# 终极极简总结
**`+page.server.js` 负责在服务器端加载数据
`load()` 函数返回数据
`+page.svelte` 通过 `data` 属性接收并展示**

这就是 SvelteKit **页面数据加载**的完整流程 ✅

代码流程（一眼看懂）
## 服务器取数据
```js
// +page.server.js
export function load({ params }) {
  const post = 找对应文章;
  return { post };
}
```

### 页面用数据
```svelte
<!-- +page.svelte -->
<script>
  let { data } = $props();
</script>

<h1>{data.post.title}</h1>
```


### Layout data
+layout.server.js 加载公共数据，所有子页面自动共享
一次加载，到处使用，避免重复代码。



### setting header 
src/routes/+page.server
export function load({ setHeaders }) {
	setHeaders({
		'Content-Type': 'text/plain'
	});
}



### read and set cookie
# 最精简总结
这一节教你：
**在 SvelteKit 的服务端 load 函数里**
- **`cookies.get()` 读取 cookie**
- **`cookies.set()` 设置 cookie（必须带 path: '/'）**
- 不能用原生响应头设置
- 框架自动保证 cookie 安全



### lib
src/lib/ = 存放全局公共代码、组件、工具
$lib = 指向这个目录的快捷别名
任何文件都能直接用，不需要写相对路径


### form
<form method="POST"> 前端提交数据export const actions 后端接收处理SvelteKit 全自动连接，不用 JS 也能跑



### name form 一页面多form
xport const actions = {
	// 新增 todo
	create: async ({ cookies, request }) => {
		const data = await request.formData();
		db.createTodo(cookies.get('userid'), data.get('description'));
	},

	// 删除 todo
	delete: async ({ cookies, request }) => {
		const data = await request.formData();
		db.deleteTodo(cookies.get('userid'), data.get('id'));
	}
};


form method="POST" action="?/create">

<!-- 调用 delete -->
<form method="POST" action="?/delete">

好的，这是为你整理的要点总结：

1.  **定义命名动作 (`+page.server.js`)**: 在服务端代码中，使用 `export const actions = {}` 对象来替代默认的 `action` 函数。在这个对象里，你可以定义多个异步函数，每个函数对应一个具体的操作，例如 `create` 和 `delete`。

2.  **调用指定动作 (`page.svelte`)**: 在前端页面的 `<form>` 元素中，通过设置 `action="?/动作名"` 属性来指定调用哪个后端动作。例如，`action="?/create"` 会调用 `actions` 对象里的 `create` 函数。

3.  **传递数据 (`page.svelte`)**: 对于需要额外数据的操作（如删除），可以在表单中使用隐藏的 `<input>` 标签来传递关键信息，比如 `todo.id`。服务端的对应动作函数会通过 `request.formData()` 获取这些数据。

4.  **重要规则**: 默认的 `action` 函数和命名的 `actions` 对象**不能同时存在**。一旦你开始使用命名动作，就必须通过 `actions` 对象来定义所有表单处理逻辑。



### progressive form
无页面刷新表单
# 这一节核心总结（1、2、3、4 清晰版）
1. **基础原理**：SvelteKit 的 `<form>` **原生就支持无 JS 运行**，表单提交、页面刷新都能正常工作，保证应用健壮。
2. **渐进增强（+page.svelte）**：有 JS 时，从 `$app/forms` 导入 `enhance`，给表单加 `use:enhance` 指令，实现**无刷新提交**。
3. **use:enhance 自动做的事**：模拟原生表单行为，但**不整页刷新**；自动更新表单数据、重新执行 `load`、处理跳转/错误。
4. **优化体验（+page.svelte）**：无刷新后可以搭配 Svelte 过渡动画（`fly`/`slide`），让新增/删除 todo 有流畅动画效果。

###### 一句话极简版
这一节讲：**给 SvelteKit 表单添加 `use:enhance` 实现渐进增强，让表单在 JS 环境下无刷新提交，并支持流畅动画。**



### customizing form
# 一句话总结
这一节教你用 **`use:enhance` 让 SvelteKit 表单从「生硬刷新」变成「流畅交互」**，实现**加载状态提示**和**乐观 UI**，彻底解决慢网络下的用户体验问题。
防止反复提交， 删除不等待后端 

---

##### 总结
1. **核心工具**：`use:enhance`（SvelteKit 表单增强指令）
2. **解决问题**：原生表单刷新、无反馈、体验差
3. **核心用法**：自定义提交回调，控制状态 + 异步更新
4. **实战效果**：创建显示加载、删除立即生效（乐观 UI）
5. **拓展**：支持取消提交、重定向、表单重置等



### get请求
import { json } from '@sveltejs/kit';

export function GET() {
	const number = Math.floor(Math.random() * 6) + 1;


	return json(number);
}
---

# 二、最直观的区别（一眼看懂）

| 特性 | load() | GET() / POST() |
|------|--------|----------------|
| **所在文件** | `+page.js / +layout.js` | `+server.js` |
| **作用** | 给页面**提前加载数据** | 提供**API 接口服务** |
| **返回值** | 直接返回数据对象 `{}` | 必须返回 `Response` |
| **调用者** | SvelteKit 框架自动调用 | 前端 fetch / 外部调用 |
| **是否公开接口** | ❌ 不公开 | ✅ 公开 URL |
| **能否获取请求体** | ❌ 不能 | ✅ POST 可以 |
| **数据直接给页面** | ✅ 直接用 | ❌ 必须 fetch 才能用 |

---




### prop state 

SvelteKit makes three readonly state objects available via the $app/state module — **page, navigating and updated**. The one you'll use most often is page, which provides information about the current page



### props navigating
```
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
用 $app/state 的 updated 检测网站新版本 → 提示用户刷新页面，并配置自动检查频率 + 手动检查方法
version: {
			// ideally, this should be something deterministic
			// like the output of `git rev-parse HEAD`
			name: Date.now().toString(),

			// if undefined, no polling will occur
			pollInterval: 5000
		}



### Errors and redirects
SvelteKit 有两种错误，用 error() 抛的是预期错误（展示给用户），用 throw new Error() 抛的是非预期错误（隐藏信息，当作 Bug）。

export function load() {
	throw new Error('Kaboom!');
}


### error page
用 +error.svelte 自定义 SvelteKit 的错误页面，既能做全局错误页，也能给不同路由做单独错误页。
可以在子路由里创建自己的 +error.svelte例如：src/routes/expected/+error.svelte
只有访问 /expected 出错时才会显示


### root error page 
当 SvelteKit 严重崩溃，连自定义错误页都渲染不了时，用 src/error.html 做终极静态兜底错误页面。



### redirect 
import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(307, '/b');
}



### hook 
请求拦截器

一句话总结
**`handle` 是 SvelteKit 所有请求的入口拦截器，你可以修改页面、创建路由、控制整个请求生命周期。**

---

##### 超简记忆


- `handle` = **请求总闸门**
- `hooks.server.js` = 它的家
- `resolve(event)` = 交给框架继续处理
- 能干：修改HTML、创建路由、日志、鉴权...

如果你愿意，我可以告诉你 **`handle` 最常用的实际场景：登录校验、日志、主题切换**，都是真实项目必用的！


### request event 
*  `event` 里面有什么？
这节课列出了最常用的属性：
- **`event.locals`** —— **全局共享变量**（本节最重要）
- **`event.cookies`** —— 读写 Cookie
- **`event.request`** —— 请求体
- **`event.url`** —— 当前请求地址
- **`event.params`** —— 路由参数
- **`event.fetch`** —— 服务端 fetch
- **`setHeaders`** —— 设置响应头



### event.fetch superfetch
* 超简记忆
- `event.fetch`：**带cookie、相对路径、内部直连**
- `handleFetch`：**拦截服务端 fetch，重定向/修改请求** 它只拦截 「服务端内部发出的 fetch 请求」

### server error hook
* 超简记忆口诀
- `handle` → 拦截请求
- `handleFetch` → 拦截服务端内部 fetch
- **`handleError` → 拦截服务端崩溃错误**


### Page options
* 超简记忆
- **ssr**：服务端渲染开关
- **csr**：客户端脚本开关
- **prerender**：构建时生成静态页开关
- **trailingSlash**：URL 末尾斜杠控制



### ssr 
Server-side rendering (SSR) is the process of generating HTML on the server, and is what SvelteKit does by default. It's important for performance and resilience,


### csr
Client-side rendering is what makes the page interactive — such as incrementing the counter when you click the button in this app — and enables SvelteKit to update the page upon navigation without a full-page reload.

关闭 csr 会发生什么？
export const csr = false;
不发给浏览器任何 JS
页面完全没有交互（按钮点不动、计数器不生效）
页面只能看，不能操作
SvelteKit 变成纯静态网站
③ 为什么要关闭 csr？
做完全不需要 JS 的静态页面
测试网站在禁用 JS的环境下是否可用
极致安全、极致性能


### prerender
prerender = 构建时生成静态页面，速度最快，但内容不能动态变化。
超简记忆
prerender = true → 打包时生成静态页面
适合：博客、文档、营销页、静态内容
不适合：动态数据、用户中心、后台


### trailingSlash
trailingSlash 用来强制统一 URL 末尾是否带 /，避免路径错误和 SEO 问题。
超简记忆
never = 不要末尾 /（默认）
always = 必须加末尾 /
ignore = 不处理（不推荐）



### Link options
### preload
data-sveltekit-preload-data = 预加载代码 + 数据（最快）
data-sveltekit-preload-code = 只预加载代码
触发时机：hover /tap/off


### data-sveltekit-reload
data-sveltekit-reload = 强制链接点击后刷新整个页面，关闭 SvelteKit 无刷新跳转。
✅ 点击后 浏览器完全刷新（像传统网页一样）✅ 所有状态重置✅ 不再是 SPA 无刷新跳转


### Advanced routingOptional parameters
什么时候用？
最经典场景：语言前缀
/fr → 法语
/de → 德语
/ → 默认语言（英语）
用 [[lang]] 就能一套路由同时匹配带语言和不带语言的地址。


### rest routing
最终兜底路由
[...rest] = 匹配任意多级路径的通配路由，用来做兜底页面、404 页面或不确定深度的路由。


### routing param matcher
给路由参数写校验器
[id] → 任意值都行
[id=数字] → 必须是数字
[color=hex] → 必须是 6 位十六进制
规则写在 src/params/xxx.js
src/params/hex.js
export function match(value) {
	return /^[0-9a-f]{6}$/.test(value);
}


### Route groups
路由分组 (group)：不改变 URL，只为给一批页面共享布局、权限、load 逻辑。
超简记忆
(文件夹) = 路由分组
URL 不受影响
可以共享布局 + 权限校验
最常用：登录页、后台、受保护页面
src/routes/
├ (authed)/        ← 路由分组（括号！）
│  ├ app/          ← URL: /app
│  ├ account/      ← URL: /account
│  └ +layout.server.js  ← 统一登录校验
├ about/           ← URL: /about（不受保护）
└ login/


### Breaking out of layouts
① 默认规则
SvelteKit 页面默认继承所有上级布局，一层套一层：根布局 → a布局 → b布局 → c页面
② 打破布局
你可以用 @ 符号让页面跳过中间布局，直接使用某个父布局：
+page@.svelte → 只使用根布局（最常用）
+page@a.svelte → 只使用 /a 下的布局
+page@b.svelte → 只使用 /a/b 下的布局

默认：继承所有布局
+page@.svelte = 只保留根布局（跳过所有中间布局）
根布局永远无法跳过


### loading
### universal loading
+page.server.js = 服务端专用 → 安全，不能返组件
+page.js = 通用加载 → 可返组件 / 函数，浏览器也能跑

To turn the server load functions into universal load functions, rename each +page.server.js file to +page.js. Now, the functions will run on the server during server-side rendering, but will also run in the browser when the app hydrates or the user performs a client-side navigation.


### page load server load
server load 返回 A
universal load 返回 B
最终页面拿到的只有 B
你必须手动把需要的值从 data 里返回出去

### parent load
通用 load（universal） 可以读取 服务器 load（server） 的父数据 ✅
服务器 load 只能读取 服务器 load 的父数据 ❌ 不能读通用 load

根目录 +layout.server.js → 返回 { a:1 }
   ↓
sum/+layout.js → 用 parent() 拿到 a，返回 { b:2 }
   ↓
sum/+page.js → 用 parent() 拿到 a 和 b，返回 { c:3 }

在 SvelteKit 的 load 函数中，用 await parent() 获取父路由（layout/page）load 函数返回的数据，并注意不要产生请求阻塞。


### invalidation load
如何手动让 SvelteKit 的 load 函数重新运行，刷新数据。
当 SvelteKit 没有自动重新加载 load 数据时，用 invalidate() 手动触发依赖某个接口的 load 函数重新运行，实现数据刷新。


### depends load
Custom dependencies = 给 load 函数起一个外号，以后你想让它重新跑，就喊它外号。
不用 fetch → 也能刷新！想刷新谁 → 就喊谁的外号！


### invalidateAll load
invalidateAll () = 一键强制刷新当前页面所有的 load 函数，不管有没有依赖、有没有 fetch、有没有 depends。



### $env/static/private

 $env/static/private 安全管理服务器端敏感环境变量，SvelteKit 强制隔离客户端 / 服务器代码，从根源防止密钥、密码等敏感信息泄露。

 Environment variables — like API keys and database credentials — can be added to a .env file, and they will be made available to your application.



 ## dynamic variable
 当你需要在应用运行时（而非构建时）读取服务器端私有环境变量，就用 $env/dynamic/private。
静态 = 编译时确定动态 = 运行时确定



### public variable 
Environment variables$env/static/public
solve
Toggle Vim mode

Some environment variables can be safely exposed to the browser. These are distinguished from private environment variables with a PUBLIC_ prefix.

Add values to the two public environment variables in .env:

PUBLIC_THEME_BACKGROUND="steelblue"
PUBLIC_THEME_FOREGROUND="bisque"
Then, import them into src/routes/+page.svelte:

src/routes/+page

const PUBLIC_THEME_BACKGROUND = 'white';
const PUBLIC_THEME_FOREGROUND = 'black';
import {
	PUBLIC_THEME_BACKGROUND,
	PUBLIC_THEME_FOREGROUND
} from '$env/static/public';


### dynamic public variable
$env/dynamic/public
solve
Toggle Vim mode

As with private environment variables, it's preferable to use static values if possible, but if necessary we can use dynamic values instead:

src/routes/+page

import { env } from '$env/dynamic/public';

{env.PUBLIC_THEME_FOREGROUND} on {env.PUBLIC_THEME_BACKGROUND}
