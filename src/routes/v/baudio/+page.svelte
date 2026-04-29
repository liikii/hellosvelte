<script lang="ts">
	import AudioPlayer from './AudioPlayer.svelte';
	import { tracks } from './tracks.js';
</script>

<div class="centered">
	{#each tracks as track}
		<AudioPlayer {...track} />
	{/each}
</div>
