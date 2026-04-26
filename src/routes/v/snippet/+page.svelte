<script lang="ts">
    import {marked} from 'marked';

    const snippet_usage = `## 这节课的完整逻辑
1. 有一个表格，要展示多个相同结构的行
2. 不想复制粘贴 HTML
3. 不想拆成单独组件
4. 于是用 **{#snippet} 定义模板**
5. 用 **{@render} + 传参** 批量渲染
`
    const passing_snippet = `我用**最清晰、最直白**的方式给你总结👇

---

## 1. 核心知识点
**Snippet（代码片段）本质就是一个值，可以像普通数据一样，当作 Props 传给子组件。**

这是 Svelte 5 最强大的功能之一，**完全替代了旧版的 slot（插槽）**。

---

## 2. 这节课的场景
- 有一个通用子组件 \`<FilteredList>\`
- 它只负责**逻辑**：筛选数据
- 它**不负责 UI 长什么样**
- UI 结构（标题、每行样式）由**父组件决定**，通过 **Snippet 传给子组件**

---

## 3. 完整流程（3步）
### ① 父组件：定义 Snippet，传给子组件
\`\`\`svelte
<!-- 父组件 -->
{#snippet header()} 标题样式 {/snippet}
{#snippet row(item)} 每一行样式 {/snippet}

<!-- 把 snippet 当作 prop 传过去 -->
<FilteredList {header} {row} />
\`\`\`

### ② 子组件：接收 Snippet 作为 Props
\`\`\`ts
// 子组件 TS
let { header, row } = $props();
\`\`\`

### ③ 子组件：渲染传进来的 Snippet
\`\`\`svelte
<!-- 子组件 -->
{@render header()}
{#each data as item}
  {@render row(item)}
{/each}
\`\`\`

---

## 4. 最终效果
- **子组件只管逻辑**
- **父组件只管 UI 样式**
- 完全解耦，超级灵活

---`
    const implicit_snippet = `现在 **Svelte 5 简化了**：
直接把 \`snippet\` 写在组件标签**里面**，它**自动成为 Props**，不用手动传！

### 之前写法（麻烦）
\`\`\`svelte
{#snippet row(d)} ... {/snippet}
{#snippet header()} ... {/snippet}

<FilteredList {header} {row} />
\`\`\`

### 现在写法（简洁）
\`\`\`svelte
<FilteredList>
  <!-- 直接写里面，自动变成 props -->
  {#snippet header()} ... {/snippet}
  {#snippet row(d)} ... {/snippet}
</FilteredList>
\`\`\`

✅ 不用再手动传递 \`{header}\` \`{row}\`  
✅ Svelte 自动识别并注入到子组件 Props  

---

## 2️⃣ 默认片段 children（新版默认插槽）
组件内部**没有被 {#snippet} 包裹的内容**，会自动变成一个特殊的片段：  
**\`children\`**

### 例子
你写：
\`\`\`svelte
<FilteredList>
  <!-- 没有用 #snippet 包裹 → 自动变成 children -->
  <header>我是标题</header>

  {#snippet row(d)} ... {/snippet}
</FilteredList>
\`\`\`

子组件接收：
\`\`\`ts
let { children, row } = $props();
\`\`\`

子组件渲染：
\`\`\`svelte
{@render children()}
\`\`\`

### 作用
- 替代旧版的 **\`<slot />\`**
- 最常用：放标题、内容、默认结构

---

# 整节课的逻辑总结
1. **Snippet 写在组件内部 = 自动成为 Props**，不用手动传递
2. **组件内的普通内容 = 自动变成 children 片段**
3. 子组件用 \`{@render children()}\` 渲染，就是新版的默认插槽

---
`


</script>


<h3>snippet usage</h3>
<div>
    {@html marked(snippet_usage)}
</div>

<h3>passing snippet</h3>
<div>
    {@html marked(passing_snippet)}
</div>

<h3>implicit snippet</h3>
<div>
    {@html marked(implicit_snippet)}
</div>

