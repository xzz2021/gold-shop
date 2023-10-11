// Generated using webpack-cli https://github.com/webpack/webpack-cli
const proconfig = require('./webpack.pro.config.js')
const watchconfig = require('./webpack.watch.config.js')
const { merge } = require('webpack-merge')
const path = require('path');
// const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const comconfig = {
    entry: {
        background: './background.js',
        content: './content.js',
        inject: './inject.js',
        popup: './popup.js',
    },
    output: {
        // filename: (pathData) => {
        //     return pathData.chunk.name === 'background' ? './[name].js' : './js/[name].js';
        //   },
        path: path.resolve(__dirname, 'xzz2022'),
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    stats: {
        orphanModules: true,
      },
    plugins: [
        new HtmlWebpackPlugin({    // 可以实现自动生成新的html并自动导入js
            template: './popup.html', 
            filename: 'popup.html', 
            chunks: ['popup'],   
            inject: 'body',
        }),
        new CopyWebpackPlugin({
            patterns: [
            {from: 'logo.png', to: './logo.png'},
            {from: 'manifest.json', to: './manifest.json'}
        ]})
    ],
    module: {  
        rules: [
            {
                oneOf:[
                    {
                        test: /\.(js|jsx)$/i,
                        exclude: /node_modules/,
                        use: {
                        loader: 'babel-loader', //调用babelcore把源代码转换成抽象语法树,解析遍历生成,
                        options: {
                            cacheDirectory: true,
                            presets: [
                                ['@babel/preset-env'],
                                ['@babel/preset-react'],
                              ],
                        }
                    }
                    },
                    
                    {
                        test: /\.css$/i,
                        use: ["style-loader", 'css-loader'],  
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: ["style-loader", 'css-loader','sass-loader'],
                    }

                ]
            },
        ],
    },
    resolve: {
        extensions: ['.jsx', '.js'],
      },
}


module.exports = (env,args) => {
    if (env.WEBPACK_WATCH) {
        return merge(comconfig, watchconfig)
    }else{
        return merge(comconfig, proconfig)
    }
}

