## 代码分割

### 原因

原始`index.js`

```javascript
 console.log(111)
```
执行`yarn build`,此时打包后的js大小为946B

```javascript
                       Asset       Size  Chunks             Chunk Names
                  index.html  230 bytes          [emitted]
main.e1cc4f9443cfdd65118b.js  946 bytes       0  [emitted]  main
```

在不作任何处理的情况下，在页面引入`lodash`

index.js
```javascript
    import _ from 'lodash'
    console.log(_.join([1, 3, 5, 6], '*'));
    console.log(111)
```

然后打包我们的代码,可以看到打包后的代码成了84.6kb，这是因为打包将`lodash`的内容和我们`index.js`的内容打包到了一起了，这是不合理的，因为我们的业务代码可能会经常改变，每次重新打包是可以的，但是lodash这个库我们是不会去修改他的源代码的，所以我们不希望每次打包的时候再重新打包lodash，
所以我们希望将lodash的模块抽离出来，每次只打包业务代码，而不用每次都去打包库代码，节约了打包时间，也不用每次都加载很大体积的js。这就需要做代码分割。

```javascript
                       Asset       Size  Chunks             Chunk Names
                  index.html  230 bytes          [emitted]
main.3a08b483c0a2dd5e619a.js   84.6 KiB       0  [emitted]  main
```

### splitChunksPlugins

webpack4中使用[splitChunksPlugins](https://webpack.docschina.org/plugins/split-chunks-plugin/)来做代码分割的功能

通过官网可以看到，splitChunksPlugins有一些默认的选项

```javascript
    module.exports = {
      optimization: {
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }
    };
```

以下是对默认选项的一些说明

```javascript
splitChunks: {
    /*
    chunks: 'async' 意思是做代码分割的时候，异步代码才会进行代码分割
    chunks: 'all' 同步和异步引入的代码都会做代码分割，但同步代码要配置cacheGroups
    chunks: 'initial' 对同步代码做代码分割
    */
    chunks: 'async',
    /*
    * minSize: 表示引入的包大于这个minSize的值，才做代码分割
    * */
    minSize: 30000,
    /*
    * maxSize: 当分割出来的代码大于maxSize，会再次进行代码分割，期望达到maxSize，一般不用
    * */
    maxSize: 0,
    /*
    * minChunks: 文件被用了多少次才进行代码分割,其实就是被多少个chunk使用
    * */
    minChunks: 1,
    /*
    * maxAsyncRequests: 同时加载的类库，超过这个数量后，只会分割成maxAsyncRequests数量的代码块
    * */
    maxAsyncRequests: 5,
    /*
    * maxInitialRequests: 入口文件做代码分割加载的类库数
    * */
    maxInitialRequests: 3,
    /*
    * automaticNameDelimiter: 生成文件的名称连接符号
    * 例如: vendors~main
    * */
    automaticNameDelimiter: '~',
    /*
    * name: true 可以使用cacheGroups的自定义名字
    * 字段filename
    * */
    name: true,
    /*
    * 缓存组
    * */
    cacheGroups: {
        vendors: {
            /*
            * 符合test才会被分割
            * */
            test: /[\\/]node_modules[\\/]/,
            /*
            * priority: 优先级 值越大优先级越高
            * */
            priority: -10,
            filename: 'xxx.js' // 自定义打包后的公共模块名称
        },
        default: {
            /*
            * minChunks: 最少加载几个模块才会被分割
            * */
            minChunks: 2,
            /*
            *
            * */
            priority: -20,
            /*
            * reuseExistingChunk: 如果一个模块已经被分割，就忽略，使用分割过的
            * */
            reuseExistingChunk: true,
            filename: 'xxx.js'
        }
    }
}
```
webpack默认情况下会对异步加载的代码做代码分割，如果直接在页面通过`import`引用，是不会做代码分割的，如果在没有配置`splitChunks.chunks`为`all`的情况下，可以使用异步引入来实现代码分割

**⚠️注意：** 这里需要下载`@babel/plugin-syntax-dynamic-import`，并且需要配置到`.babelrc`的`plugins`选项里面，来支持动态引入

```javascript
// import _ from 'lodash'
function fetchLibrary () {
    import('lodash').then(res => {
        console.log(res);
    })
}
fetchLibrary()
// console.log(_.join([1, 3, 5, 6], '*'));
console.log(222333);
```

再次打包

```javascript
                       Asset       Size  Chunks             Chunk Names
   1.99c1889a498c4339ee7b.js   69.4 KiB       1  [emitted]
                  index.html  230 bytes          [emitted]
main.5914a7462d284a2f1a8e.js   2.08 KiB       0  [emitted]  main
```

生成文件名是`1.99c1889a498c4339ee7b.js`,这里的1其实就是id编号，如果不想用这个id来命名，可以在引入的时候设置名称,修改index.js，再次打包

```javascript
function fetchLibrary () {
    import(/* webpackChunkName: 'lodash' */ 'lodash').then(({ default: _ }) => {
        console.log(_.join([1, 3], '-'));
    })
}
```

打包结果

```javascript
                                 Asset       Size  Chunks             Chunk Names
                            index.html  230 bytes          [emitted]
          main.261ecbde93ea7c305caa.js   2.09 KiB       0  [emitted]  main
vendors~lodash.99c1889a498c4339ee7b.js   69.4 KiB       1  [emitted]  vendors~lodash
```

我们希望同步引入的代码也进行代码分割，修改`splitChunks.chunks`为`all`,再次打包

```javascript
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
```
打包后的结果

```javascript
                               Asset       Size  Chunks             Chunk Names
                          index.html  334 bytes          [emitted]
        main.1f846f002827b3274ee1.js   1.55 KiB       0  [emitted]  main
vendors~main.9ce224d840078b7aee03.js   69.4 KiB       1  [emitted]  vendors~main
```

### 公共库分别打包

**webpack代码分割规则，当符合`splitChunks`中`cacheGroups`前面的一些条件时，会应用`cacheGroups`和`default`中的规则**

我们再修改`index.js`,添加`axios`,然后打包

```javascript
import _ from 'lodash'
import axios from 'axios'
console.log(_.join([1, 3, 5, 6], '*'));
console.log(222333);
console.log(axios);
```
结果

```javascript
                               Asset       Size  Chunks             Chunk Names
                          index.html  334 bytes          [emitted]
        main.edc8cb933712464e482e.js   1.58 KiB       0  [emitted]  main
vendors~main.7f959926e8298d6b4165.js   83.6 KiB       1  [emitted]  vendors~main
```

发现`axios`和`lodash`被打包到了一个js中。因为都符合`cacheGroups`中的规则，被打包到一个缓存组内，如果想要单独打包，可以再添加配置

我希望将`lodash`单独打包，配置`splitChunks`，再次打包

```javascript
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                lodash: {
                    test: /[\\/]node_modules[\\/]lodash[\\/]/,
                    name: 'lodash',
                    //filename: 'lodash.js', // 打包后的文件名称
                    priority: -5 // 这个一定要大于vendors中的priority，不然就会被打包到vendors中
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
```

打包结果

```javascript
                               Asset       Size  Chunks             Chunk Names
                          index.html  411 bytes          [emitted]
                           lodash.js   68.9 KiB       0  [emitted]  lodash~main
        main.0c8e7e1dc40c7e37a06e.js   1.58 KiB       1  [emitted]  main
vendors~main.e830565d963fd67ea0e2.js   14.8 KiB       2  [emitted]  vendors~main
```

也可以不写`filename`,直接写`name`,打包后结果

```javascript
                               Asset       Size  Chunks             Chunk Names
                          index.html  432 bytes          [emitted]
      lodash.e8120094fae7d1b429cf.js   68.9 KiB       0  [emitted]  lodash
        main.0c8e7e1dc40c7e37a06e.js   1.58 KiB       1  [emitted]  main
vendors~main.e830565d963fd67ea0e2.js   14.8 KiB       2  [emitted]  vendors~main
```
