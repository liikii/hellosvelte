<script module>
  let globalCount = $state(0); // 依然是全局唯一的
</script>

<script lang="ts">
  let { name } = $props(); // Svelte 5 接收参数写法
  let localCount = $state(0);
</script>

<div>
  <strong>组件: {name}</strong> <br />
  <button onclick={() => { localCount++; globalCount++; }}>
    个人: {localCount} | 全局: {globalCount}
  </button>
</div>
