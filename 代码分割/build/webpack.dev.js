const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
    mode: 'development',
    output: {
        filename: '[name].[hash].js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        port: '8100',
        progress: true,
        open: true
    }
})
