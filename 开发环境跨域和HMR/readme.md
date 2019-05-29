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
