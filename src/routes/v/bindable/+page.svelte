<script lang="ts">
	import Keypad from './Keypad.svelte';

	let pin = $state('');

	let view = $derived(pin
		? pin.replace(/\d(?!$)/g, '•')
		: 'enter your pin');

	function onsubmit() {
		alert(`submitted ${pin}`);
	}
</script>

<h3>Component bindings</h3>

<pre>
用 $bindable + bind: 实现父子组件之间的双向数据同步
子声明$bindable， 父bind</pre>

<h1 style="opacity: {pin ? 1 : 0.4}">
	{view}
</h1>

<Keypad bind:value={pin} {onsubmit} />