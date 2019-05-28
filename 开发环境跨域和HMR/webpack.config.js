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
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
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
                            outputPath: 'image/',
                            limit: 1 * 1024,
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
        })
    ],
    devServer: {
        contentBase: resolve('dist'),
        port: 9200,
        progress: true,
        compress: false,
        // proxy: {
        //     // '/api': 'http://localhost:9300'
        //     '/api': {
        //         target: 'http://localhost:9300',
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
        proxy: [
            {
                context: ['/api', '/api1'],
                target: 'http://localhost:9300'
            }
        ]
    }
}
