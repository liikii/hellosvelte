<script lang="ts">
    let elapsed = $state(0);
    let interval = $state(1000);

    $effect(() => {
        const id = setInterval(() => {
            elapsed += 1;
        }, interval);

        return () => {
            clearInterval(id);
        };
    });
</script>

<button class="btn btn-primary" onclick={() => (interval /= 2)}>speed up</button>
<button class="btn btn-primary" onclick={() => (interval *= 2)}>slow down</button>

<p class="text-primary">elapsed: {elapsed}</p>
