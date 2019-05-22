const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const resolve = (...paths) => path.resolve(__dirname, ...paths)

module.exports = {
    mode: 'development',
    entry: resolve('src/index.js'), // 入口文件
    output: {
        path: resolve('dist'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
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
            },
            {
                test: /\.(jpg|jpeg|png|svg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            // limit: 200 * 1024
                            mimetype: 'image/svg'
                        }
                    }
                ]
            },
            // {
            //     test: /\.html$/,
            //     use: 'html-withimg-loader'
            // }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: resolve('index.html'),
            filename: 'index.html',
            hash: true,
            // minify: {
            //     removeAttributeQuotes: true,
            //     collapseWhitespace: true
            // }
        })
    ],
    devServer: {
        contentBase: resolve('dist'),
        port: 9100,
        progress: true,
        compress: false,
        open: false
    }
}
