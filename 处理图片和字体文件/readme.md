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

- file-loader 主要功能是处理图片文件，包括文件名和路径，并将处理好的文件输送到打包目录中
- url-loader url-loader的效果类似file-loader，只不过url-loader需要配置一下limit的值，当打包的图片大小小于limit的值的时候，图片会被转成base6，
当图片大小大于limit的值，默认会交给file-loader来处理

**⚠️注意：** 在使用url-loader时，一定要配置limit参数，不然一直会把图片打包成base64

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

#### 配置参数：

- limit: 20 * 1024表示，小于20k的图片转换成base64字符串打包到js中。大于20kb的图片使用file-loader来处理
- mimetype: 转换成的base64字符串的`data:image/xxx;base64`,如果配置为`image/png`,那么不管是jpg还是png，都会转换成`data:image/png；base64`,默认就是图片自己的后缀
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
