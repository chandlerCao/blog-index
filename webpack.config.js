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
                test: /\.less$/,
                use: extractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: 0
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
        new extractTextWebpackPlugin('css/[name]-[hash:8].css'),
        new htmlWebpackPlugin({
            template: 'index.html',
            publicPath: '../'
        }),
        // 全局配置
        new webpack.DefinePlugin({
            'process.env': {
                m: isDev ? '"development"' : '"production"'
            }
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
    // 如果页面报错，会提示给你开发模式下的报错信息，不会把压缩后的报错信息给你
    config.devtool = '#cheap-module-eval-source-map';
    config.devServer = {
        port: 3333,
        host: '0.0.0.0',
        overlay: {
            error: true, // 打包过程的错误，会直接显示在网页上面！
        },
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
