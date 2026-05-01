<script module>
  // 导出静态函数：不需要创建组件就能用
  export function stopAll() {
    alert("全局指令：所有播放器已停止！");
    // 实际项目中这里可以写逻辑控制所有实例
  }
</script>

<script>
  let { trackName } = $props();
</script>

<div>
  <span>正在播放: {trackName}</span>
</div>
