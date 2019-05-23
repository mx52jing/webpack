## 处理图片和字体文件


### url-loader和file-loader

在scss文件中对样式进行调整

```scss
.content {
    p {
        width: 300px;
        height: 300px;
        border: 1px solid #ddd;
        background: url('./img/dog.jpg');
    }
}
```

发现报错

```javascript
ERROR in ./src/img/dog.jpg 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type.
(Source code omitted for this binary file)
```
报错告诉我们需要合适的loader来处理，因为webpack默认是不能解析图片的，需要借助`file-loader`和`url-loader`

- file-loader: 主要功能是处理图片文件，包括文件名和路径，并将处理好的文件输送到打包目录中
- url-loader: url-loader的效果类似file-loader，只不过url-loader可以将资源文件(一般就是图片)转换成base64字符串，url-loader的配置中需要配置一下limit的值，当打包的图片大小`小于limit的值`的时候，图片会被转成base64字符串，打包到js中，
当图片大小大于limit的值，默认会交给file-loader来处理

**⚠️注意：** 在使用url-loader时，一定要配置limit参数，不然不管图片大小有多大，都一直会把图片转换成base64字符串，打包到js中

```javascript
            {
                test: /\.(jpg|jpeg|png|svg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 20 * 1024
                        }
                    }
                ]
            }
``` 

#### `url-loader`配置参数：

- limit: 20 * 1024表示，小于20k的图片转换成base64字符串打包到js中。大于20kb的图片使用file-loader来处理
- mimetype: 转换成的base64字符串的`data:image/xxx;base64,xxxxxx`,如果配置为`image/png`,那么不管是jpg还是png，都会转换成`data:image/png；base64,xxxxxx`,默认就是图片自己的后缀
- fallback: 默认情况下，当打包图片超出limit的值的时候，会使用file-loader来处理，但是如果有其他需要，就要配置fallback中指定的loader来处理

例如：

```javascript
{
  loader: 'url-loader',
    options: {
        limit: 20 * 1024,
        fallback: 'responsive-loader'
    }
}
```
#### `file-loader`配置参数：

**在使用url-loader时，file-loader的参数可以写到url-loader的options中**

- name: 就是图片本身的名字，一般我们不去配置这个参数，`ext`就是文件原始后缀名，默认值是`[hash].[ext]`

```javascript
            {
                test: /\.(jpg|jpeg|png|svg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: '[name].[ext]',
                            limit: 20 * 1024,
                            mimetype: 'image/svg'
                        }
                    }
                ]
            }
```

- outputPath: 如果我们想吧图片打包到目录下面，可以配置这个参数

下面的配置可以把图片打包到`dist目录下的image文件夹下`

```javascript
            {
                test: /\.(jpg|jpeg|png|svg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            outputPath: 'image/',
                            limit: 20 * 1024,
                        }
                    }
                ]
            }
```

- publicPath: 有时候我们会把图片放到CDN服务器上面，和我们代码不在一个域名下,可以单独设置引入图片的域名前缀

例如图片放在： `http://www.img.com/image`目录下，我们就可以配置`publicPath`


```javascript
            {
                test: /\.(jpg|jpeg|png|svg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            outputPath: 'image/',
                            limit: 20 * 1024,
                            publicPath: 'http://www.mxing.com/image'
                        }
                    }
                ]
            }
```
打包后看到，css中，图片路径就发生了变化

```scss
.content p {
  width: 300px;
  height: 300px;
  border: 1px solid #ddd;
  background: url(http://www.img.com/image/dog.jpg); }
```

### html-withimg-loader

现在在scss中通过url()和js中通过import引入的图片路径都可以解析成功，但是如果在html中直接写`<img src="./src/img/dog.jpg" alt="">`这样在html中的图片路径还是没有解析出来，这时需要借助一个loader`html-withimg-loader`

下载并且配置module中的rules

```javascript
    {
        test: /\.html$/,
        use: 'html-withimg-loader'
    }
```

配置过后再次运行，html页面中的图片就展现出来了

### 处理字体文件iconfont

先在阿里的[字体文件网站](https://www.iconfont.cn/)下载几个图标文件

将`iconfont.eot`,`iconfont.ttf`,`iconfont.svg`,`iconfont.woff`复制到项目的fonts目录下，将`iconfont.css`中的代码复制到`index.scss`中，并且修改引入文件的路径

我们直接使用file-loader来处理字体文件，并且吧字体文件打包到fonts目录下

为了避免处理字体文件的svg和页面引入svg冲突，可以在处理字体文件中添加`include`字段为fonts，这样就只处理fonts下面的svg

````javascript
            {
                test: /\.(eot|ttf|woff|svg)$/,
                include: /fonts/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
````

