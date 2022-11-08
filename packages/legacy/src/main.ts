import _Vue from 'vue'
import ElementUi from 'element-ui'
import App from '@/App.vue'
import router from '@/router'

import 'uno.css'

// 继承Vue，避免影响Vue实例
class Vue extends _Vue {}

Vue.config.productionTip = false

Vue.use(ElementUi)

function setup() {
  const app = new Vue({
    router,
    render: h => h(App),
  })
  app.$mount('#legacy')
  return app
}

export { router, setup }
