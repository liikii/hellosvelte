# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.15.1 create --template minimal --types ts --install npm hellosvelte
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## init project

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
nvm ls-remote
nvm --help
nvm install --lts
node -v
npm -v

npm config set registry https://registry.npmmirror.com

npx sv create hellosvelte
cd hellosvelte
npm install
npm run dev

npm install -D @types/node
npm i --save bootstrap @popperjs/core
npm i --save-dev sass
npm i -D json-server
npm install -D @types/bootstrap
npm install -D @sveltejs/adapter-static
npm i bootstrap-icons

svelte choise

 Which template would you like?
│  SvelteKit minimal
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax

npm i lucide-svelte --save-dev
npm install marked
npm install -D @types/marked
npm install tippy.js
```


## 这里的开发建议（避坑指南）：

* 不要滥用 JS 初始化：对于 Tooltip 或 Popover，尽量封装成 Svelte 的 action（use 指令），这样组件销毁时会自动清理内存，不会导致后台页面开久了变卡。
* 图标方案：除了 Bootstrap Icons，后台常用 Lucide Svelte，它的图标更简洁、更有现代感，而且是纯组件式的。
* 数据流：建议把 API 请求逻辑放在 SvelteKit 的 +page.ts 加载函数里，让后台实现“秒开”的效果。

