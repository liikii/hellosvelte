<script lang="ts">
  import { getContext } from "svelte";

  // 🔥 直接取，不管跨多少层都能拿到
  const shared = getContext<{
    name: string;
    updateName: (n: string) => void;
  }>("myAppContext");
</script>

<h4>孙组件（取 Context）</h4>
<p>共享数据：{shared.name}</p>

<button onclick={() => shared.updateName("孙组件修改啦！")}>
  点击修改顶层数据
</button>
