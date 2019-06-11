const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const resolve = (...paths) => path.resolve.call(__dirname, '../', ...paths)

module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
        contentBase: resolve('dist'),
        port: '8100',
        progress: true
    }
})
