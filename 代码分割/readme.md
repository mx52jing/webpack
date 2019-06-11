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

然后打包我们的代码,可以看到打包后的代码成了84.6kb，这是因为打包将`lodash`的内容和我们`index.js`的内容打包到了一起了，这是不合理的，因为我们的业务代码可能会经常改变，每次重新打包是可以的，但是lodash这个库我们是不会去修改他的源代码的，
所以我们希望将lodash的模块抽离出来，每次只打包业务代码，而不用每次都去打包库代码，节约了打包时间，也不用每次都加载很大体积的js。这就需要做代码分割。

```javascript
                       Asset       Size  Chunks             Chunk Names
                  index.html  230 bytes          [emitted]
main.3a08b483c0a2dd5e619a.js   84.6 KiB       0  [emitted]  main
```

### splitChunksPlugins

webpack4中使用splitChunksPlugins来做代码分割的功能
