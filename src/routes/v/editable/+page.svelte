<script lang="ts">
	let html = $state('<p>Write some text!</p>');
</script>

<h2 class="text-success">app html content binding example</h2>

<div bind:innerHTML={html} contenteditable></div>

<pre>{html}</pre>
