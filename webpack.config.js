const webpack = require('webpack');
const path = require('path');
// 清除打包文件
const cleanWebpackPlugin = require('clean-webpack-plugin');
// html
const htmlWebpackPlugin = require('html-webpack-plugin');
// 当前的模式
const isDev = process.env.mode === 'development';
// 抽离css
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
// 压缩css
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const lessExtract = new extractTextWebpackPlugin({
    filename: 'css/[name]-[hash:8].css',
});
const config = {
    entry: {
        blog: path.join(__dirname, 'app.js')
    },
    output: {
        path: path.join(__dirname, 'blog'),
        filename: 'js/[name]-[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.less$/i,
                use: lessExtract.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
                        { loader: 'less-loader' }
                    ]
                })
            },
            {
                test: /\.(jpg|png)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            publicPath: '../',
                            name: 'img/[name]-[hash:8].[ext]', // 将要打包的哪个文件夹下
                            limit: 1024
                        }
                    }
                ]
            }
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
        hot: true
    };
    config.plugins.push(
        // 热模块替换功能，可以实现局部刷新，节省等待时间
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );
} else {
    config.mode = 'production';
    config.plugins.push(new cleanWebpackPlugin([path.join(__dirname, 'blog')]));
}
module.exports = config;