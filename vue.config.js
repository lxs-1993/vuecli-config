const { defineConfig } = require('@vue/cli-service')
const prod = process.env.NODE_ENV === 'production' // 判断是否是生产环境
// PurgecssPlugin去除无用的css
const PurgecssPlugin = require('purgecss-webpack-plugin');
// const CompressionPlugin = require("compression-webpack-plugin"); // 版本是 5.0.1 开启gzip压缩， 按需引用
//gzip压缩插件
const glob = require('glob-all');
const path = require('path');
let cdn = {
  css: [],
  js: [
    // vue must at first!
    'https://cdn.bootcss.com/vue/2.6.10/vue.min.js', // vuejs
    'https://cdn.bootcss.com/vue-router/3.0.7/vue-router.min.js', // vue-router js
    'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js', // vuex js
  ]
}
module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  productionSourceMap: !prod, // map地图
  devServer:{
    port: 9527,
    host: 'localhost',
    open: true,  // 自动打开浏览器
  },
  configureWebpack:config=> {

    // PurgecssPlugin去除无用的css
        // 公共代码抽离
        // config.optimization = {
        //   splitChunks: {
        //     cacheGroups: {
        //       vendor: {
        //         chunks: 'all',
        //         test: /node_modules/,
        //         name: 'vendor',
        //         minChunks: 1,
        //         maxInitialRequests: 5,
        //         minSize: 0,
        //         priority: 100
        //       },
        //       common: {
        //         chunks: 'all',
        //         test: /[\\/]src[\\/]js[\\/]/,
        //         name: 'common',
        //         minChunks: 2,
        //         maxInitialRequests: 5,
        //         minSize: 0,
        //         priority: 60
        //       },
        //       runtimeChunk: {
        //         name: 'manifest'
        //       }
        //     }
        //   }
        // }
        config.plugins.push(
          new PurgecssPlugin({
            paths: glob.sync([
              path.join(__dirname, './src/index.html'),
              path.join(__dirname, './**/*.vue'),
              path.join(__dirname, './src/**/*.js')
            ])
          }),
        )
  },
  chainWebpack: config => {
    // js压缩插件 相当于webpack中的terser-webpack-plugin
    if (prod) {
      // css压缩
      config.optimization
        .minimizer('css')
        .tap(args => [...args, { cssProcessorOptions: { safe: false } }])
      // 图片压缩
      config.module
        .rule('images')
        // .test(/\.(jpg|png|gif)$/)
        // .set('parser', {
        //   dataUrlCondition: {
        //     maxSize: 10000 * 1024, // 10KiB
        //   },
        // })
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true
        })
        .end()
    }
    // js压缩
    config.optimization.minimize(true)
      .minimizer('terser')
      .tap(args => {
        let { terserOptions } = args[0];
        // 去除console
        terserOptions.compress.drop_console = true;
        terserOptions.compress.drop_debugger = true;
        return args
      });
    // 排除npm包
    config.externals({
      "vue": "Vue",
      "vue-router": "VueRouter",
      "vuex": "Vuex",
    });
    // 注入cdn变量 (打包时会执行)
    config.plugin('html').tap(args => {
      args[0].cdn = cdn // 配置cdn给插件
      return args
    });
  }
})
