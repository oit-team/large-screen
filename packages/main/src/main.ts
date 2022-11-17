import Vue from 'vue'
import { TablePage } from '@oit/element-ui-extend'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import '@/plugins/element-ui'
import '@/legacy'

import '@unocss/reset/tailwind.css'
import '@/styles/index.scss'
import 'uno.css'

Vue.use(TablePage, {
  setFields: () => {
    const fields = sessionStorage.getItem('headTitString')
    if (fields)
      return JSON.parse(fields)
  },
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
