## @web-localstorage-plus/offline

利用[web-localstorage-plus](https://github.com/supanpanCn/web-localstorage-plus)为vue3组件跨级通信提供离线能力

## 安装

```js
yarn add web-localstorage-plus @web-localstorage-plus/offline
```

## 使用

- 初始化web-localstorage-plus

在入口文件main.ts中初始化存储库

```ts
import createStorage from 'web-localstorage-plus';
createStorage({
    rootName: 'spp-storage',
});
```

- 在vite.config.ts中导入作为plugin

```ts
import { offline } from '@web-localstorage-plus/offline';
export default defineConfig({
    ...,
    plugins:[
        offline()
    ]
})
```