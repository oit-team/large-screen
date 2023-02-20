const pxtoviewport = require('postcss-px-to-viewport')
const autoprefixer = require('autoprefixer')
const projectConfig = require('./src/project.config')

module.exports = {
  publicPath: './',
  transpileDependencies: [
    'vuetify',
  ],
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer,
          pxtoviewport({
            viewportWidth: projectConfig.viewportWidth, // UI设计稿的宽度
            unitPrecision: 6, // 保留精度
          }),
        ],
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.9.65:8089',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      '/gdy': {
        target: 'http://222.186.58.235:18104/gdy',
        changeOrigin: true,
        pathRewrite: {
          '^/gdy': '',
        },
      },
    },
  },
}
