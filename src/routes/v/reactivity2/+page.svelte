<script lang="ts">
    import {marked} from 'marked';

    const rawstate = `### 1. 普通 $state（深度响应）
\`\`\`ts
let list = $state([1,2,3]);
list.push(4); // ✅ 能更新界面
list[0] = 99; // ✅ 能更新界面
\`\`\`
原理：被 \`Proxy\` 包裹，**细粒度监听每一个修改**

### 2. $state.raw（原始、浅层）
\`\`\`ts
let list = $state.raw([1,2,3]);
list.push(4);    // ❌ 界面不刷新
list[0] = 99;    // ❌ 界面不刷新

// ✅ 只有【整体重新赋值】才会刷新
list = [4,5,6];
\`\`\``

    const reative_class = `\`\`\`ts
class Box {
    width = $state(0);
    height = $state(0);
    area = $derived(this.width*this.height);
\`\`\`
`

const private_state = `### 总结
1. TS 实现和 JS **语法几乎一样**
2. 只需要额外加**类型注解**
3. 私有属性 \`#width\`、getter/setter、数据校验逻辑完全不变
4. 代码更安全、有智能提示

\`\`\`typescript
// 定义最大尺寸常量
const MAX_SIZE = 100;

class Box {
  // 私有响应式属性（# 是 JS 私有，TS 完全支持）
  #width = $state(0);
  #height = $state(0);

  // 派生计算属性：面积
  area = $derived(this.#width * this.#height);

  // 构造函数 + 类型注解
  constructor(width: number, height: number) {
    this.#width = width;
    this.#height = height;
  }

  // getter：获取宽度
  get width(): number {
    return this.#width;
  }

  // setter：设置宽度 + 数据校验
  set width(value: number) {
    // 限制在 0 ~ MAX_SIZE 之间
    this.#width = Math.max(0, Math.min(MAX_SIZE, value));
  }
\`\`\``

const old_state = `# 🚀 完整对比（最清晰）
| 方式 | Svelte 4/5 Store | **Svelte 5 Runes (最新)** |
| :--- | :--- | :--- |
| **创建** | \`export const c = writable(0)\` | **\`export const c = $state(0)\`** |
| **读取** | \`$c\` | **\`c\`** |
| **修改** | \`$c++\` / \`c.update(...)\` | **\`c++\`** |
| **导入** | 需要 \`import { writable }\` | **零依赖** |

---

# ✨ 总结（最重要）
1. **Svelte 5 全局共享状态 = 直接用 \`$state\`**
2. **不用 store，不用 $ 符号，不用 writable**
3. 代码更短、更直观、和普通变量写法一模一样
`


    import {SvelteDate} from 'svelte/reactivity'
	let date = new SvelteDate();

	const pad = (n: number) => n < 10 ? '0' + n : n;

	$effect(() => {
		const interval = setInterval(() => {
			date.setTime(Date.now());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>


<h3>rawstate</h3>
<div>
    {@html marked(rawstate)}
</div>

<h3>reactive class</h3>
<div>
    {@html marked(reative_class)}
</div>

<h3>private state</h3>
<div>
    {@html marked(private_state)}
</div>



<h4>svelte reactive class</h4>
<p>Svelte ships with several reactive classes that you can use 
    in place of JavaScript built-in objects — namely Map, Set, Date, URL and URLSearchParams.</p>
<p>The time is {date.getHours()}:{pad(date.getMinutes())}:{pad(date.getSeconds())}</p>


<h4>old state</h4>
<div>
    {@html marked(old_state)}
</div>
