### 开发环境下的跨域

有时候我们在开发环境也想请求一些真实数据，但是在浏览器中直接向服务器发请求会跨域，`webpack-dev-server`帮助我们做这件事情

webpack-dev-server中又一个proxy选项，可帮助我们实现跨域


首先新建server文件夹，新建index.js,写好一个简单的接口

```javascript
    const express = require('express')
    const app = express()

    app.get('/api/user', (req, res) => {
        res.json({
            name: '电风扇的方式',
            age: 16
        })
    })

    app.listen(9300, () => {
        console.log('Servering is Running at http://localhost:9300');
    })
```

在`src/index.js`中

```javascript
    const xhr = new XMLHttpRequest()

    xhr.open('GET', '/api/user', true)

    xhr.onreadystatechange = function() {
        if(xhr.status === 200) {
            console.log(xhr.response);
        }
    }

    xhr.send()
```

然后配置devServer

```javascript
    devServer: {
        contentBase: resolve('dist'),
        port: 9200,
        progress: true,
        compress: false,
        proxy: {
            '/api': 'http://localhost:9300'
        }
    }
```

这样我们在前端请求`/api/user`就会被代理到`http://localhost:9300/api/users'`


这样写是最简单的一种方式，proxy还可以是一个对象

```javascript
    devServer: {
        contentBase: resolve('dist'),
        port: 9200,
        progress: true,
        compress: false,
        proxy: {
            '/api': {
                target: 'http://localhost:9300',
                // 路径重写，代理的时候将/api置为空
                pathRewrite: { 
                    '^/api': ''
                }
            }
        }
    }
```

这样写意思就是我们在前端请求`/api/user`,直接帮我们代理到`http://localhost:9300/user`

如果我们想把多个路径代理到一个服务器，可以使用`context`

如下 `/api1`和`/api2`分别会被代理到`http://localhost:9300/api1`和`http://localhost:9300/api2`

```javascript
    devServer: {
        contentBase: resolve('dist'),
        port: 9200,
        progress: true,
        compress: false,
        proxy: [
            {
                context: ['/api1', '/api2'],
                target: 'http://localhost:9300'
            }
        ]
    }
```


webpack-dev-server底层是依赖[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

### HMR(hot module replacement)

热更新在webpack中也是非常好用的一个功能，可以在我们更该代码后帮助我们更新修改的部分，而不是直接刷新浏览器，这样在开发调试的时候就非常方便

首先配置devServer

```javascript
    devServer: {
        contentBase: resolve('dist'),
        port: 9200,
        progress: true,
        compress: false,
        hot: true,
        hotOnly: true
    }
```
- hot 是必须要配置的参数，配置hot才能开启热更新
- hotOnly: 可以不配置，设置为true后，就算热更新不生效，也不会重新刷新浏览器

并且在插件plugins中配置

```javascript
  new webpack.HotModuleReplacementPlugin()
```

配置成功后重启服务，我们先修改scss文件，发现scss修改之后，页面没刷新字体颜色就改变了，这是因为css-loader内置了热更新功能，
可以帮助我们实现热更新。

**⚠️注意**： 如果使用mini-css-extract-plugin,MiniCssExtractPlugin.loader暂时是不支持热更新的。

配置js热更新

在 index.js中引入Home和Counter

```javascript
import Counter from './Counter'
import Home from './Home'

import './index.scss'
Counter()
Home()

if(module.hot){
    module.hot.accept('./Home', () => {
        const home = document.getElementsByClassName('home')[0]
        document.getElementById('app').removeChild(home)
        Home()
        console.log('Home update');
    })
}
```

我们先点击页面按钮把数字加到一个值，然后修改home.js的展示值，可以发现，页面值更新了，上面的计数器的值也没有变，热更新生效了
