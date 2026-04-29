<script lang="ts">
  // 🔥 子组件自己也用这个 bind:this 变量
  let canvas = $state<HTMLCanvasElement>();
  let ctx = $state<CanvasRenderingContext2D | null>(null);

  $effect(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d");
  });

  // 暴露给父调用的 PUBLIC 方法
  export function clearCanvas() {
    ctx = canvas!.getContext("2d");
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    ctx!.fillText("已清空！（子组件自己操作 canvas）", 10, 20);
  }

  export function drawCircle() {
    // ctx = canvas.getContext("2d");
    ctx!.arc(150, 100, 40, 0, Math.PI * 2);
    ctx!.fill();
  }

  // 子组件内部自己用 canvas 实例
  export function innerDraw() {
    // const ctx = canvas.getContext("2d");
    ctx!.fillText("子组件内部自己画的", 10, 50);
  }
</script>

<!-- 核心：bind:this 把 DOM 绑定给变量 -->
<canvas class="" bind:this={canvas}></canvas>

<button onclick={innerDraw}>子组件内部自己画</button>
