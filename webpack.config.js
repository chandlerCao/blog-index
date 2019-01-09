const webpack = require('webpack');
const path = require('path');
// 清除打包文件
const cleanWebpackPlugin = require('clean-webpack-plugin');
// html
const htmlWebpackPlugin = require('html-webpack-plugin');
// 当前的模式
const mode = process.env.mode ? process.env.mode : 'production';
const isDev = mode === 'development';
// 抽离css
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const hash = process.env.test || isDev ? '' : '-[hash]';

const lessExtract = new MiniCssExtractPlugin({
    filename: `css/[name]${hash}.css`
});
// 拷贝插件
const copyWebpackPlugin = require('copy-webpack-plugin');
const config = {
    mode,
    entry: {
        blog: path.join(__dirname, 'app.js')
    },
    output: {
        path: path.join(__dirname, '../koa-blog/index/view'),
        filename: `js/[name]${hash}.js`
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.less$/i,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(jpg|png)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            publicPath: '../',
                            name: `img/[name]${hash}.[ext]`, // 将要打包的哪个文件夹下
                            limit: 1024
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        lessExtract,
        new htmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            favicon: './assets/img/logo.ico',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            // chunks: ['blog'],
            hash: true
        }),
        new copyWebpackPlugin([
            {
                from: path.join(__dirname, 'assets/img/WeChat-qr-code.jpg'),
                to: path.join(__dirname, '../koa-blog/index/view/img/[name].[ext]')
            },
            {
                from: path.join(__dirname, 'assets/img/QQ-qr-code.jpg'),
                to: path.join(__dirname, '../koa-blog/index/view/img/[name].[ext]')
            },
            {
                from: path.join(__dirname, 'assets/img/snow.png'),
                to: path.join(__dirname, '../koa-blog/index/view/img/[name].[ext]')
            }
        ])
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
    config.devServer = {
        port: 8090,
        host: '0.0.0.0',
        overlay: true,
        compress: true,
        hot: true
    };
    config.plugins.push(
        // 热模块替换功能，可以实现局部刷新，节省等待时间
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );
} else {
    // config.plugins.push(new cleanWebpackPlugin([path.join(__dirname, '../koa-blog/index/view')]));
}
module.exports = config;