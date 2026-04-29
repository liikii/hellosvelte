<script lang="ts">
  // 1. 定义一个变量，用来存 DOM 元素
  let myInput: HTMLInputElement;

  function focusInput() {
    // 3. 直接用原生 DOM 方法操作元素
    myInput.focus();
  }
</script>

<h3>bind:this = 拿到元素自己</h3>

<!-- 2. 用 bind:this 把元素绑定到变量 -->
<input bind:this={myInput} placeholder="点按钮聚焦我" />

<button onclick={focusInput}>点我聚焦输入框</button>
