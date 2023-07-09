const path = require('path')
const webpack = require('webpack')
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const productionGzipExtensions = ['js', 'css'];
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  lintOnSave: false,
  pluginOptions: { // 第三方插件配置
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/css/base.less')], // less所在文件路径
    }
  },
  devServer: {
    proxy: {
      "/": {
      target: "http://localhost:8080",
      changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      // 直接调用js文件, 并在全局中进行配置调用变量
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Popper: ["popper.js", "default"],
        api: [path.join(__dirname, './src/api/api.js'), 'default']
      }),
      // new CompressionWebpackPlugin({
      //   asset: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),  //匹配文件名
      //   // test: /\.js$|\.html$|.\css/,
      //   threshold: 10240,  //对超过10k的数据压缩
      //   minRatio: 0.8,
      //   deleteOriginalAssets: false  //不删除源文件
      // })
    ]
  }
}
// new webpack.ProvidePlugin({
//     IScroll: "./src/assets/js/scrolloverflow.js"
// })