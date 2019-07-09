# 使用Dll提升打包速度

### 背景

先搭建一个简单的能运行`react`代码的环境，添加`react`,`react-dom`,`react-router-dom`,`lodash`,到代码中。
然后执行，`yarn build`

第一次打包
```javascript
  Time: 1178ms
```

第二次打包
```javascript
Time: 897ms
```
第三次打包
```javascript
Time: 863ms
```
第四次打包
```javascript
Time: 874ms
```
第五次打包
```javascript
Time: 882ms
```

可以看到，每次打包基本就在`860-900`ms之间了，时间还是挺久的。
现在这种用法，每次在打包的时候，都回去分析`node_modules`中的库文件代码，这是比较耗费时间的操作，而且这些第三方库文件我们一般是不会轻易修改的，
那么如果不想每次打包都去分析这些库文件，可以使用`webpack自带的动态链接库(Dll)功能`

**这里要用到webpack的两个插件`DllPlugin`和`DllReferencePlugin`**

### 使用DllPlugin

在`build`目录下新建`webpack.dll.js`,内容如下

```javascript
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    react: ['react', 'react-dom', 'react-router-dom'],
    lodash: ['lodash']
  },
  output: {
    path: path.resolve(__dirname, '../build:dll'),
    filename: "[name].dll.js",
    library: '[name]_dll'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: "[name]_dll",
      path: path.resolve(__dirname, '../build:dll/[name]_dll.manifest.json')
    })
  ]
}
```
新建配置文件，并且将打包后的文件放到`build:dll`目录下,打包过后会生成对应的2个文件，一个是`js`，一个是`minifest.json`文件,js文件中就是打包后的库代码，而`minifest.json`就是表示了当前库的对应关系。
在打包的时候，webpack不用再去分析`node_modules`中的第三方库，而是读取`minifest.json`对应关系。

执行`yarn build:dll`,build:dll目录下会生成4个文件(因为入口中有2个配置)

### 使用DllReferencePlugin

在打包好dll库之后，还需要对象的插件去读取，修改`webpack.base.js`,因为可能打包多个dll文件，所以封装一个函数来读取，同时，要把生成的dll.js文件放到html文件中，需要用到另一个插件`add-asset-html-webpack-plugin`

添加读取dll配置的plugins函数,同时在plugins内添加执行这个函数。

```javascript
const otherPlugins = () => {
  let files = fs.readdirSync(path.resolve(__dirname, '../build:dll'))
  return files.map(file => {
    if(/.+_dll\.js/.test(file)) {
      return new AddAssetsHtmlPlugin({
        filepath: path.resolve(__dirname, '../build:dll', file)
      })
    }
    if(/.+_dll.manifest\.json/.test(file)) {
      return new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '../build:dll', file)
      })
    }
  })
}
```

添加了`dll插件后`，然后再次执行`yarn build`

第一次打包
```javascript
Time: 479ms
```
第二次打包
```javascript
Time: 483ms
```
第三次打包
```javascript
Time: 508ms
```
第四次打包
```javascript
Time: 499ms
```
第五次打包
```javascript
Time: 493ms
```
测试的效果很明显，使用dll动态链接库之后，打包的速度大大提升。
