<script lang="ts">
	let { src, title, artist } = $props();

	let time = $state(0);
	let duration = $state(0);
	let paused = $state(true);

	function format(time: number) {
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
		class="bi bi-caret-right-square"
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
			<div role="slider" tabindex="0" aria-valuenow={0} aria-valuemin={0}  aria-valuemax={100}
				class="slider"
				onpointerdown={e => {
					const div = e.currentTarget;

					function seek(e: PointerEvent) {
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