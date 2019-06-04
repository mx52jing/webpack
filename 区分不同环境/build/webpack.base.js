const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

module.exports = {
    entry:  path.join(__dirname, '../src/index.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "[name].[contenthash].js"
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
                    process.env.NODE_ENV === 'development' ?
                        'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
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
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../index.html'),
            filename: 'index.html',
            hash: true
        }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'myEnv': JSON.stringify('my')
        })
    ]
}
console.log(process.env, myEnv);
