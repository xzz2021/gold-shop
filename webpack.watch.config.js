
const {wsAutoReloadPlugin} = require('ws-reload-plugin')
const webpack = require('webpack')


const watchconfig = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    plugins: [
      new wsAutoReloadPlugin(),
        //可以定义全局上下文的变量
      new webpack.DefinePlugin({
          DEBUG: JSON.stringify(true),
          $: 'jquery',
        })
    ],
    watchOptions: {
      ignored: /node_modules/,
    },
    module: {  
      rules: [
        //   {
        //       oneOf:[
        //           {
        //               test: /\.css$/i,
        //               use: ["style-loader", 'css-loader'],  
        //           },
        //           {
        //               test: /\.s[ac]ss$/i,
        //               use: ["style-loader", 'css-loader','sass-loader'],
        //           }
        //       ]
        //   },
      ],
  },
};

module.exports = watchconfig