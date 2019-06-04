const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const resolve = (...paths) => path.resolve.call(__dirname, ...paths)

module.exports = {
    mode: 'development',
    entry: resolve('src/index.js'), // 入口文件
    output: {
        path: resolve('dist'),
        filename: '[name].[contenthash].js'
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
                            // name: '[name].[ext]',
                            outputPath: 'image/',
                            limit: 1 * 1024,
                            // publicPath: 'http://www.mxing.com/image'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },
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
