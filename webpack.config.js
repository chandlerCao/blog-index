// 引入webpack
const webpack = require('webpack');
// 引入路径
const path = require('path');
// 清除打包文件
const cleanWebpackPlugin = require('clean-webpack-plugin');
// html打包
const htmlWebpackPlugin = require('html-webpack-plugin');
// 判断当前的模式
const isDev = process.env.mode === 'development';
// css单独打包
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
const config = {
    entry: path.join(__dirname, 'app.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.less$/,
                use: extractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        'postcss-loader',
                        'less-loader'
                    ],
                    publicPath: '../'
                })
            },
            {
                test: /\.(jpg|png)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            publicPath: '../',
                            name: 'img/[hash].[ext]', // 将要打包的哪个文件夹下
                            limit: 1024
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new extractTextWebpackPlugin('css/[hash:8].css'),
        new htmlWebpackPlugin({
            template: 'index.html',
            publicPath: '../'
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'assets/'),
        },
        extensions: ['.js', '.less']
    }
};
// 如果当前模式为开发模式
if (isDev) {
    config.mode = 'development';
    config.devServer = {
        port: 3333,
        host: '0.0.0.0',
        overlay: true,
        compress: true,
        hot: true // 局部刷新
    };
    config.plugins.push(
        // 热模块替换功能，可以实现局部刷新，节省等待时间
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    );
} else {
    config.mode = 'production';
    config.plugins.push(new cleanWebpackPlugin(['dist']));
}
module.exports = config;