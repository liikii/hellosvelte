<script lang="ts">
    import { onMount } from "svelte";

    onMount(async () => {
        const bootstrap = await import('bootstrap');
        const popoverTriggerList = document.querySelectorAll(
            '[data-bs-toggle="popover"]',
        );
        const popoverList = [...popoverTriggerList].map(
            (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl),
        );
    });
</script>

<button
    type="button"
    class="btn btn-lg btn-danger"
    data-bs-toggle="popover"
    data-bs-title="Popover title"
    data-bs-content="And here’s some amazing content. It’s very engaging. Right?"
    >Click to toggle popover</button
>
