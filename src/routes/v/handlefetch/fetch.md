
### event.fetch superfetch
* 超简记忆
- `event.fetch`：**带cookie、相对路径、内部直连**
- `handleFetch`：**拦截服务端 fetch，重定向/修改请求** 它只拦截 「服务端内部发出的 fetch 请求」


### server error hook
* 超简记忆口诀
- `handle` → 拦截请求
- `handleFetch` → 拦截服务端内部 fetch
- **`handleError` → 拦截服务端崩溃错误**

```ts
export function handleError({ event, error }) {
	console.error(error.stack);

	return {
		message: 'everything is fine',
		code: 'JEREMYBEARIMY'
	};
}
```
