
### Page options

**超简记忆**

- **ssr**：服务端渲染开关
- **csr**：客户端脚本开关
- **prerender**：构建时生成静态页开关
- **trailingSlash**：URL 末尾斜杠控制



### ssr 
Server-side rendering (SSR) is the process of generating HTML on the server, and is what SvelteKit does by default. It's important for performance and resilience,


### csr
Client-side rendering is what makes the page interactive — such as incrementing the counter when you click the button in this app — and enables SvelteKit to update the page upon navigation without a full-page reload.

关闭 csr 会发生什么？
export const csr = false;
不发给浏览器任何 JS
页面完全没有交互（按钮点不动、计数器不生效）
页面只能看，不能操作
SvelteKit 变成纯静态网站
③ 为什么要关闭 csr？
做完全不需要 JS 的静态页面
测试网站在禁用 JS的环境下是否可用
极致安全、极致性能


### prerender
prerender = 构建时生成静态页面，速度最快，但内容不能动态变化。
超简记忆
prerender = true → 打包时生成静态页面
适合：博客、文档、营销页、静态内容
不适合：动态数据、用户中心、后台


### trailingSlash
trailingSlash 用来强制统一 URL 末尾是否带 /，避免路径错误和 SEO 问题。
超简记忆
never = 不要末尾 /（默认）
always = 必须加末尾 /
ignore = 不处理（不推荐）
