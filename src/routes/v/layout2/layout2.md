### Breaking out of layouts
```
① 默认规则
SvelteKit 页面默认继承所有上级布局，一层套一层：根布局 → a布局 → b布局 → c页面
② 打破布局
你可以用 @ 符号让页面跳过中间布局，直接使用某个父布局：
+page@.svelte → 只使用根布局（最常用）
+page@a.svelte → 只使用 /a 下的布局
+page@b.svelte → 只使用 /a/b 下的布局

默认：继承所有布局
+page@.svelte = 只保留根布局（跳过所有中间布局）
根布局永远无法跳过
```
