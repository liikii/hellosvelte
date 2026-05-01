<script lang="ts">
  import { setContext } from 'svelte';
  import Parent from './Parent.svelte';

  // 1. 定义要共享的数据 + 方法
  const shared = {
    name: '来自顶层的共享数据',
    updateName: (newName: string) => {
      shared.name = newName;
    }
  };

  // 2. 存入 context（key 随便写，全局唯一就行）
  setContext('myAppContext', shared);
</script>

<h2>祖组件（存 Context）</h2>
<Parent />  <!-- 中间层，不用传任何 props -->