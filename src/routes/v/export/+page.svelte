<script lang="ts">
  import AudioPlayer, { stopAll } from './AudioPlayer.svelte';
</script>

<h3>module export 示例</h3>


<AudioPlayer trackName="歌曲 A" />
<AudioPlayer trackName="歌曲 B" />

<!-- 注意：我们直接从组件类中解构出了 stopAll 函数 -->
<button onclick={stopAll} class="btn btn-primary">
  一键停止所有播放
</button>
