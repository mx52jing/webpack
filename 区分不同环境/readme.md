# 区分不同环境

现在我们只有一个配置文件`webpack.config.js`，每次打包或者启动项目就只用修改这一个配置文件，但是在实际的开发过程当中，希望不同环境使用不同打包文件，这样就不用频繁修改`mode`了。

新`build`文件夹，创建`webpack.base.js`,`webpack.dev.js`,`webpack.prod.js`

- webpack.base.js 放置开发环境和线上通用的配置
- webpack.dev.js 放置开发环境需要的配置
- webpack.prod.js 放置线上环境需要的配置

我们需要将通用配置和开发已经线上配置分别合并，需要用到`webpack-merge`

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

