# 区分不同环境

现在我们只有一个配置文件`webpack.config.js`，每次打包或者启动项目就只用修改这一个配置文件，但是在实际的开发过程当中，希望不同环境使用不同打包文件，这样就不用频繁修改`mode`了。

新`build`文件夹，创建`webpack.base.js`,`webpack.dev.js`,`webpack.prod.js`

- webpack.base.js 放置开发环境和线上通用的配置
- webpack.dev.js 放置开发环境需要的配置
- webpack.prod.js 放置线上环境需要的配置

我们需要将通用配置和开发已经线上配置分别合并，需要用到`webpack-merge`, [文档](https://www.npmjs.com/package/webpack-merge)

例如：`webpack.dev.js` 
```javascript
    const path = require('path')
    const merge = require('webpack-merge')
    const baseConfig = require('./webpack.base')

    const resolve = (...paths) => path.resolve.call(__dirname, '../', ...paths)

    module.exports = merge(baseConfig, {
        mode: 'development',
        devServer: {
            contentBase: resolve('dist'),
            port: '8600',
            progress: true
        }
    })
```

### process.env.NODE_ENV

在配置文件中，通常需要用到环境变量`NODE_ENV`，默认是没有的，需要我们在启动的时候设置一下，需要用到一个模块`cross-env`

下载`NODE_ENV`，并且在`package.json`配置scripts

```json
  "scripts": {
    "start": "cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config ./build/webpack.prod.js"
  },
```

在mac中可以直接设置

```json
  "scripts": {
    "start": "NODE_ENV=development webpack-dev-server --config ./build/webpack.dev.js",
    "build": "NODE_ENV=production webpack --config ./build/webpack.prod.js"
  },
```
但是在windows上可能会出现问题，所以需要`cross-env`，可以同时兼容不同系统
