<script lang="ts">
	let m = $state({ x: 0, y: 0 , x2: 0, y2: 0});

	function onpointermove(event: PointerEvent) {
		m.x = event.clientX;
		m.y = event.clientY;
	}

    import Stepper from './Stepper.svelte';
	let value = $state(0);

    import Honkbutton from './Honkbutton.svelte';
    import horn from '$lib/assets/horn.mp3';
    const audio = new Audio();
	audio.src = horn;

	function honk() {
		audio.load();
		audio.play();
	}

</script>


<div class="container h-25 border border-primary border-5" onpointermove={onpointermove} role="presentation">
	The pointer is at {Math.round(m.x)} x {Math.round(m.y)}
</div>
<h6>inline handler:</h6>
<div class="container h-25 border border-success border-5 text-success" onpointermove={(event) => {
    m.x2 = event.clientX;
	m.y2 = event.clientY;
}} role="presentation">
	The pointer is at {Math.round(m.x2)} x {Math.round(m.y2)}
</div>

<div onkeydown={(e) => alert(`<div> ${e.key}`)} role="presentation">
	<input onkeydown={(e) => alert(`<input> ${e.key}`)} />
</div>

<div onkeydowncapture={(e) => alert(`<div> capture ${e.key}`)} role="presentation">
	<input onkeydowncapture={(e) => alert(`<input> capture ${e.key}`)} />
</div>

<h6>Stepper:</h6>

<p>The current value is {value}</p>

<Stepper 
	increment={() => value += 1}
	decrement={() => value -= 1}
	/>

<h6>Honkbutton:</h6>
<Honkbutton onclick={honk} />
