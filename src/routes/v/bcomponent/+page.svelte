<script lang="ts">
  import Canvas from './Canvas.svelte';

  // 父用变量接收子组件实例
  let canvasComponent: Canvas;
</script>

<!-- 父 bind:this 拿到子组件 -->
<Canvas bind:this={canvasComponent} />

<!-- 父直接调用子组件方法 -->
<button onclick={() => canvasComponent.drawCircle()}>
  父：画圆形
</button>

<button onclick={() => canvasComponent.clearCanvas()}>
  父：清空画布
</button>
