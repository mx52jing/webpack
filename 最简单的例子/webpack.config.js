const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src/index.js'), // 入口文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            filename: 'index.html',
            hash: true,
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9100,
        progress: true,
        compress: false,
        open: false
    }
}
