
### $env/static/private
```
 $env/static/private 安全管理服务器端敏感环境变量，SvelteKit 强制隔离客户端 / 服务器代码，从根源防止密钥、密码等敏感信息泄露。

 Environment variables — like API keys and database credentials — can be added to a .env file, and they will be made available to your application.
```



## dynamic variable
```
当你需要在应用运行时（而非构建时）读取服务器端私有环境变量，就用 $env/dynamic/private。
静态 = 编译时确定动态 = 运行时确定
```



### public variable 
```
Environment variables$env/static/public
solve
Toggle Vim mode

Some environment variables can be safely exposed to the browser. These are distinguished from private environment variables with a PUBLIC_ prefix.

Add values to the two public environment variables in .env:

PUBLIC_THEME_BACKGROUND="steelblue"
PUBLIC_THEME_FOREGROUND="bisque"
Then, import them into src/routes/+page.svelte:

src/routes/+page

const PUBLIC_THEME_BACKGROUND = 'white';
const PUBLIC_THEME_FOREGROUND = 'black';
import {
	PUBLIC_THEME_BACKGROUND,
	PUBLIC_THEME_FOREGROUND
} from '$env/static/public';
```



### dynamic public variable
```
$env/dynamic/public
solve
Toggle Vim mode

As with private environment variables, it's preferable to use static values if possible, but if necessary we can use dynamic values instead:

src/routes/+page

import { env } from '$env/dynamic/public';

{env.PUBLIC_THEME_FOREGROUND} on {env.PUBLIC_THEME_BACKGROUND}
```
