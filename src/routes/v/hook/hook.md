### hook 
请求拦截器

一句话总结
**`handle` 是 SvelteKit 所有请求的入口拦截器，你可以修改页面、创建路由、控制整个请求生命周期。**

---

##### 超简记忆


- `handle` = **请求总闸门**
- `hooks.server.js` = 它的家
- `resolve(event)` = 交给框架继续处理
- 能干：修改HTML、创建路由、日志、鉴权...

如果你愿意，我可以告诉你 **`handle` 最常用的实际场景：登录校验、日志、主题切换**，都是真实项目必用的！


### request event 
*  `event` 里面有什么？
这节课列出了最常用的属性：
- **`event.locals`** —— **全局共享变量**（本节最重要）
- **`event.cookies`** —— 读写 Cookie
- **`event.request`** —— 请求体
- **`event.url`** —— 当前请求地址
- **`event.params`** —— 路由参数
- **`event.fetch`** —— 服务端 fetch
- **`setHeaders`** —— 设置响应头