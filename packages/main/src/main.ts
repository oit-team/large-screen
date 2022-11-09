import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import '@/plugins/element-ui'
import '@/legacy'

import '@unocss/reset/tailwind.css'
import '@/styles/index.scss'
import 'uno.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
