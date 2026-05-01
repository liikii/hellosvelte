<script lang="ts">
    import catimg from '$lib/assets/cat.png'
	import { onMount } from 'svelte';
    let toastTrigger: HTMLElement;
    let toastLiveExample: HTMLElement;

	onMount(async () => {
		// 1. 动态导入，防止 SSR 报错
		const bootstrap = await import('bootstrap');

        if (toastTrigger) {
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
            toastTrigger.addEventListener('click', () => {
                toastBootstrap.show()
            })
        }
	});

</script>

<button bind:this={toastTrigger}  type="button" class="btn btn-primary" id="liveToastBtn">Show live toast</button>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div bind:this={toastLiveExample} id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <img src={catimg} class="rounded me-2" alt="...">
      <strong class="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      Hello, world! This is a toast message.
    </div>
  </div>
</div>