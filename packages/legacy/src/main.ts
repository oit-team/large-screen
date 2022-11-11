import Vue from 'vue'
import ElementUi from 'element-ui'
import Axios from 'axios'
import globalVariable from './assets/js/globalFun'
import bus from './assets/js/eventBus'
import App from '@/App.vue'
import router from '@/router'

import 'tailwindcss/tailwind.css'
import './components/classify'

Vue.prototype.GLOBAL = globalVariable
Vue.prototype.$bus = bus

const axios = Axios.create({
  // 请求超时时间
  timeout: 60000,
  baseURL: '/api',
})

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const headers = config.headers || {}
    if (!headers.userId) {
      headers.userId = sessionStorage.userId
    }
    if (!headers.token) {
      headers.token = sessionStorage.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

Vue.prototype.$axios = axios

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(ElementUi)

function setup(options: any = {}) {
  const app = new Vue({
    router,
    render: h => h(App),
  })
  app.$mount('#legacy')
  console.log(app)
  return app
}

export { router, setup }
