// webpack 是node写出来的 所以是node的写法
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src/index.js'), // 入口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    // {
                    //     loader: 'style-loader'
                    // },
                    {
                      loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    // },
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            filename: 'index.html',
            hash: true,
            minify: {

            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
    // optimization: {
    //     minimizer: [
    //         new UglifyJsPlugin(),
    //         new OptimizeCSSAssetsPlugin()
    //     ]
    // },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9100,
        progress: true,
        compress: false,
        // open: true
    }
}
