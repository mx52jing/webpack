## 处理js

### es6转es5

我们在index.js写一段es6代码

```javascript
    const foo = () => {
        console.log('foo');
    }
    foo()
```

然后执行`npx webpack`，找到打包后的js文件，发现我们的const语法和箭头函数并没有被转换成es5，这可能使代码在低版本浏览器(例如低版本IE),无法运行。
这就需要我们把es6高级语法转成es5语法

我们需要用到`babel-loader`

下载依赖

```
yarn add babel-loader @babel/core @babel/preset-env -D
```

然后在根目录新建`.babelrc`文件

```javascript
    {
      "presets": [
        "@babel/preset-env"
      ]
    }
```

并且配置loader

```javascript
    {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
    }
```

然后再次打包，进入打包后目录查看,会发现const已经被转换成var语法，箭头函数也被转换成普通函数

### 处理更高级语法

比如我们在写class的时候想直接这么写

```javascript
    class Foo {
        state = {
            name: 'asd'
        }
    }

    console.log(new Foo());
```

运行打包，发现会报错

```javascript
Support for the experimental syntax 'classProperties' isn't currently enabled
```
提示我们这种语法还在提案中，不能直接使用，在向下看

```javascript
Add @babel/plugin-proposal-class-properties (https://git.io/vb4SL) to the 'plugins' section of your Babel config to enable transformation.
```

通过提示我们知道需要安装`@babel/plugin-proposal-class-properties`来支持我们这种语法

安装并且在`.babelrc`文件配置

```javascript
    {
      "presets": [
        "@babel/preset-env"
      ],
      "plugins": [
        "@babel/plugin-proposal-class-properties"
      ]
    }
```
再次打包就不报错了


我们再写这样一段代码

```javascript
const str = 'asdasdasd'

console.log(str.includes('s'));
```

再执行打包，在打包后js中发现并没有将includes这种语法做转换，这在低版本的IE(我打开的是IE9)必然会报错，不光是includes，还有`Promise`等语法也都不会帮助我们解析，那这就需要我们自己配置
需要用到`@babel/polyfill`

下载`@babel/polyfill`并且在`入口文件顶部`引入`@babel/polyfill`

再次在IE中打开，就不会报错了。

**引入`@babel/polyfill`之后,我们发现main.js大了好多,打包之前4k,打包之后400k,
这是因为项目入口引入`@babel/polyfill`之后,打包代码会把低版本浏览器没有的原生方法全部重写放到`main.js`中,
这样没用到的方法也被写入了,会使main.js很大,要解决这个问题可以，修改`.babelrc`配置**

```javascript
{
  "presets": [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": "usage"
        }
      ]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
}
```

再次进行打包,会看到下面这一段话，提示我们按照上面配置可以吧入口文件引入的`@babel/polyfill`去掉,
我们把入口文件的`import '@babel/polyfill'` 去掉，再次打包，这时发现main.js已经只有60多k了

```
  When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
  Please remove the `import '@babel/polyfill'` call or use `useBuiltIns: 'entry'` instead.
```

**⚠️注意：**： 如果打包报错的话，安装一下`core-js@2`

