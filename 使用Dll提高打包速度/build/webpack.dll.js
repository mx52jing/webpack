const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    react: ['react', 'react-dom', 'react-router-dom'],
    lodash: ['lodash']
  },
  output: {
    path: path.resolve(__dirname, '../build:dll'),
    filename: "[name]_dll.js",
    library: '[name]_dll'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: "[name]_dll",
      path: path.resolve(__dirname, '../build:dll/[name]_dll.manifest.json')
    })
  ]
}
