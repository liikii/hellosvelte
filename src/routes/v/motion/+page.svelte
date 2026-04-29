<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let progress = new Tween(0, {
		duration: 400,
		easing: cubicOut
	});
    let targets: number[] = [0, 0.25, 0.5, 0.75, 1];
</script>

<progress value={progress.current}></progress>
<br>

{#each targets as target}
    <button class='btn btn-primary m-3 p-3' onclick={() => (progress.target = target)}>
        {target * 100}%
    </button>
{/each}
<!-- 
<button onclick={() => (progress.target = 0)}>
	0%
</button>

<button onclick={() => (progress.target = 0.25)}>
	25%
</button>

<button onclick={() => (progress.target = 0.5)}>
	50%
</button>

<button onclick={() => (progress.target = 0.75)}>
	75%
</button>

<button onclick={() => (progress.target = 1)}>
	100%
</button> -->
