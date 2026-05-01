### rest routing
最终兜底路由
[...rest] = 匹配任意多级路径的通配路由，用来做兜底页面、404 页面或不确定深度的路由。
```
src/routes/
├ categories/
│ ├ animal/
│ ├ mineral/
│ ├ vegetable/
│ ├ [...catchall]/
│ │ ├ +error.svelte
│ │ └ +page.server.js
```


### routing param matcher
```
给路由参数写校验器
[id] → 任意值都行
[id=数字] → 必须是数字
[color=hex] → 必须是 6 位十六进制
规则写在 src/params/xxx.js
src/params/hex.js
export function match(value) {
	return /^[0-9a-f]{6}$/.test(value);
}
```


### Route groups
```
路由分组 (group)：不改变 URL，只为给一批页面共享布局、权限、load 逻辑。
超简记忆
(文件夹) = 路由分组
URL 不受影响
可以共享布局 + 权限校验
最常用：登录页、后台、受保护页面
src/routes/
├ (authed)/        ← 路由分组（括号！）
│  ├ app/          ← URL: /app
│  ├ account/      ← URL: /account
│  └ +layout.server.js  ← 统一登录校验
├ about/           ← URL: /about（不受保护）
└ login/
```