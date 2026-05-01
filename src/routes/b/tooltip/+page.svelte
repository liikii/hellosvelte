<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

	onMount(async () => {
		// 1. 动态导入 bootstrap
		const bootstrap = await import('bootstrap');

		// 2. 初始化 Tooltip
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map(
			(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
		);
        
        // 3. 页面销毁时记得清理（可选，防止内存泄漏）
        // return () => {
        //     tooltipList.forEach(t => t.dispose());
        // };
	});

</script>

<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top">
  Tooltip on top
</button>
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Tooltip on right">
  Tooltip on right
</button>
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Tooltip on bottom">
  Tooltip on bottom
</button>
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Tooltip on left">
  Tooltip on left
</button>
