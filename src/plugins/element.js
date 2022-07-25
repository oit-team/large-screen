import Vue from 'vue'
import Element from 'element-ui'
import '@/styles/element-ui.scss'
Vue.prototype.$message = Element.Message
// 全局注册Element组件库
Vue.use(Element)