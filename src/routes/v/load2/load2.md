### page load server load
```
server load 返回 A
universal load 返回 B
最终页面拿到的只有 B
你必须手动把需要的值从 data 里返回出去
```

### parent load
```
通用 load（universal） 可以读取 服务器 load（server） 的父数据 ✅
服务器 load 只能读取 服务器 load 的父数据 ❌ 不能读通用 load

根目录 +layout.server.js → 返回 { a:1 }
   ↓
sum/+layout.js → 用 parent() 拿到 a，返回 { b:2 }
   ↓
sum/+page.js → 用 parent() 拿到 a 和 b，返回 { c:3 }

在 SvelteKit 的 load 函数中，用 await parent() 获取父路由（layout/page）load 函数返回的数据，并注意不要产生请求阻塞。
```


### invalidation load
```
如何手动让 SvelteKit 的 load 函数重新运行，刷新数据。
当 SvelteKit 没有自动重新加载 load 数据时，用 invalidate() 手动触发依赖某个接口的 load 函数重新运行，实现数据刷新。
```



### depends load
```
Custom dependencies = 给 load 函数起一个外号，以后你想让它重新跑，就喊它外号。
不用 fetch → 也能刷新！想刷新谁 → 就喊谁的外号！
```


### invalidateAll load
```
invalidateAll () = 一键强制刷新当前页面所有的 load 函数，不管有没有依赖、有没有 fetch、有没有 depends。
```
