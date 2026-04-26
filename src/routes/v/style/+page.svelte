<script lang="ts">
	import { marked } from 'marked';
	let class1 = `
** class
\`\`\`typescript
<button
class="card {flipped? 'flipped': ''}"
onclick={() => flipped = !flipped}
>
\`\`\``
</script>



<p>This is a paragraph.</p>

<style>
	/* Write your CSS here */
	p {
		color: blue;
	}
</style>


<div>{@html marked(class1)}</div>

