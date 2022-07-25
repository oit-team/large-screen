
module.exports = {
  productionSourceMap:false, //不输出.map文件
  publicPath: './',
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // eslint 是否在保存时检查
  assetsDir: 'static', // 配置js、css静态资源二级目录的位置
  devServer: {
    port: 2051,
    proxy: {
      '/api': {
        target: 'http://192.168.9.67:11011',
        // target: 'http://home.zjbyxpm.com:8082/api',
        changeOrigin: true,
        pathRewrite: {'^/api': ''}
      }
    }
  },
}
