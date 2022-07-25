

```shell
# 安装依赖
npm install
# 启动服务
npm serve
# 构建
npm build


## 项目结构

* src - 主目录
  * api - 接口
  * assets - 资源
  * components - 组件
    * basic - 基础组件
    * business - 业务组件
  * plugins - 插件
    * element.js - element配置
  * router - 路由
  * store - vuex状态管理
    * modules - 模块
      * aside.js - 侧边栏
  * styles - 样式
    * element-variables.scss - element变量配置
    * reset.scss - css样式重置
    * scrollbar.scss - 自定义滚动条
    * utils.scss - css工具类
  * views - 页面
* .eslintrc.js - eslint配置
* babel.config.js - babel配置

## 依赖说明

* 组件
  * [element-ui](https://element.eleme.cn/#/zh-CN) - UI框架
* CSS
  * [sass](https://sass-lang.com/) - css预处理器
  * [modern-normalize](https://www.npmjs.com/package/modern-normalize) - css标准化

## 风格约定

* 组件文件名的应为大驼峰（PascalCase）
* 基础组件名使用`Vc`做前缀，如：`VcButton`，`v`表示vue，`c`表示组件
* 在模板中，使用kebab-case表示组件，如`<vc-button></vc-button>`
