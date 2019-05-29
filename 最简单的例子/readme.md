## 简单例子

#### 入口entry

打包代码的入口文件，可以是一个`字符串`,也可以是一个`对象`，

字符串

```javascript
entry: path.join(__dirname, 'src/index.js');
```
对象

```javascript
entry: {
    foo: path.join(__dirname, 'src/foo.js'),
    baz: path.join(__dirname, 'src/baz.js'),
}
```

#### output

是指打包后代码存放的目录

```javascript
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
}
```
output选项

|选项|说明|
|--|--|
|path|打包代码存放的目录，**必须是绝对路径**|
|filename|打包后的文件名称，可以写死例如`bundle.js`<br>[name]: 当`entry`是字符串时，`[name]`默认是`main`，当`entry`是对象时，`[name]`是`对象路径对应的key值`。|

**filename 中的hash， chunkhash，contenthash**

- hash 是根据整个项目来生成的，只要项目中有一个文件改变了，项目生成的hash值都会改变
- chunkhash 指的是同一chunk只要内容不变，chunkhash内容就不会变
- contenthash 是根据文件内容来生成的唯一hash，只有当文件内容改变了，contenthash才会改变


#### webpack-dev-server

webpack-dev-server是webpack自带的一个服务，开启后可以在本地浏览项目

webpack-dev-server也会将当前项目打包，不过不会放到磁盘内，而是放在内存里面，因此我们修改内容后可以浏览到修改的变化，但是打包目录代码还是没变的。

```javascript
devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: 'localhost',
    port: 9000,
    compress: true,
    progress: true,
    open: true
}
```

相关选项

|选项|说明|
|--|--|
|contentBase|告诉服务器从哪个目录中提供内容|
|host|指定使用一个host,默认是localhost|
|port|端口号，默认是8080|
|compress|服务器返回内容是否启用gzip压缩，默认false|
|progress|是否显示打包进度(在命令行可看到)，默认false|
|open|是否自动打开浏览器，默认false|

#### html-webpack-plugin

webpack插件中的一个，**webpack的插件都是类**，使用的时候需要new

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
        filename: 'index.html',
        hash: true,
        minify: {
            collapseWhitespace: true,
            removeAttributeQuotes: true
        }
    })
]
```

每次改了文件内容打包后会生成新的js或者其他资源，不可能每次去改打包后html中引入的文件的名称。而`html-webpack-plugin`会以指定的html为模版，生成一个html,每次修改并打包后html中引入模块的内容也会改变

相关选项

|选项|说明|
|--|--|
|template|基础模版的路径|
|filename|生成的文件名，一般为`index.html`|
|hash|引入文件带hash值，例如: `main.js?hash值`|
|minify|优化项<br>collapseWhitespace: 移除html中的换行<br>removeAttributeQuotes: 移除html中的双引号|
