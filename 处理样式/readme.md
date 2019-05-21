## 处理样式

### 先说一个插件`clean-webpacl-plugin`

我们每次修改了文件内容然后重新打包后，每次都会生成新的文件放到打包目录下(我的是dist目录)，而且老的生成的文件也在，这样看起来非常不方便，
`clean-webpack-plugin`帮助解决这个问题，在每次打包的时候，`回先把dist目录清空`，然后再把打包后的文件放到`dist目录` 。

需要在plugins数组内添加这个插件，插件的使用都一样， 使用的时候需要new一下

```javascript
const CleanWebpackPlugin = require('clean-webpack-plugin')

plugins: [
    new CleanWebpackPlugin()
]
```

### 处理css

在`index.js`中添加一段代码，然后引入`index.css`，使用`webpack-dev-server`运行会报错，这是因为webpack默认只认识js代码，不能自己处理css，如果想要webpack也对css进行打包，就要借助于`loader`,
在webpack中，`loader`的执行功能是单一的，只会解析打包对应的匹配资源
**注意⚠️**：`loader的执行顺序`是`从右往左，从下往上`的。所哟在写loader的时候要注意顺序

处理css需要用到`style-loader`和`css-loader`

- css-loader: 解析处理css中的url路径(@import/图片路径)，把css文件变成一个模块
- style-loader: 将解析后的css放入style标签，然后插入到页面的head标签中

在导出对象添加`module`

```javascript
module: {
    rules: [
        {
            test: /\.css$/, // 匹配以css结尾的文件
            use: ['style-loader', 'css-loader']
        }
    ]
}
```

再次运行会发现样式已经生效。

### 添加浏览器前缀

有时候会在css中用到一些有兼容性的属性，例如`transform`,希望在打包的时候自动为我们添加浏览器前缀，以此来适配不同浏览器。这时要用到`postcss-loader`中的一个插件`autoprefixer`。

修改配置文件

这里有几种写法

写法一：
```javascript
module: {
    rules: [
        {
            test: /\.css$/, // 匹配以css结尾的文件
            use: ['style-loader', 'css-loader', 'postcss-loader']
        }
    ]
}
```
然后在同级目录下新建`postcss.config.js`,导出一个对象

```javascript
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```

第二种写法，直接在`webpack.config.js`中的loader配置处写

```javascript
module: {
    rules: [
        {
            test: /\.css$/, // 匹配以css结尾的文件
            use: [
                'style-loader', 
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('autoprefixer')
                        ]
                    }
                }
            ] 
        }
    ]
}
```

个人比较喜欢第一种😂，再次运行，打开浏览器检查样式，会发现已经为我们添加了兼容前缀。

### 处理scss

处理scss要用到`scss-loader`和`node-sass`，先安装,然后新建`style.scss`并引入，然后修改配置文件

```javascript
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    }
```

这样就可以处理scss文件了

### 全局共享样式

有时候我们希望定义一些颜色变量和方法，然后在其他scss文件中直接使用,这时可以用`style-resources-loader`,具体可以查看[文档](https://www.npmjs.com/package/style-resources-loader)。
新建`common.scss`

```scss
$base-radius: 5px;
$base-color: red;

@mixin basic-center() {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

然后修改配置

```javascript
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader'
                    },
                    'postcss-loader',
                    'sass-loader',
                    {
                        loader: 'style-resources-loader',
                        options: {
                            patterns: [
                                resolve('src', 'common.scss')
                            ]
                        }
                    }
                ]
            }
        ]
    }
```

然后再任意scss文件中可以随时使用,这样就方便了很多

```scss
.content {
    span {
        font-weight: 500;
    }
    p {
        border: 1px solid #ff5588;
        user-select: auto;
        border-radius: $base-radius;
        @include basic-center;
    }
}
```

### 单独打包css

现在我们使用`style-loader`来将css插入head，这样会把css和js打包到一个文件中-`main.js`,如果项目中的js和css会很多，这将会使main.js体积十分大，加载的时候会很慢，
所以我们希望把css单独打包，这时就要用到一个插件`mini-css-extract-plugin`，文档地址在[这里](https://www.npmjs.com/package/mini-css-extract-plugin)，
我们引入这个插件然后修改配置：

在plugins中添加

```javascript
    new MiniCssExtractPlugin({
        filename: '[name].css'
    })
```
修改module

```javascript
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                    {
                        loader: 'style-resources-loader',
                        options: {
                            patterns: [
                                resolve('src', 'common.scss')
                            ]
                        }
                    }
                ]
            }
        ]
    }
```

重新打包会发现，css已经单独打包到`dist`目录下了,如果想打包到dist下的css目录下，修改filename就行
```javascript
    new MiniCssExtractPlugin({
        filename: 'css/[name].css'
    })
```
**注意⚠️:** MiniCssExtractPlugin目前还不支持热更新，所以尽量不要在开发环境使用
