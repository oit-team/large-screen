import Vue from 'vue'
import VueRouter from 'vue-router'
import { router as LegacyRouter } from '@oit/legacy'
import { Loading } from 'element-ui'
import { routes } from './routers'
import store from '@/store'
import { isLogin } from '@/utils/auth'

Vue.use(VueRouter)

const router = new VueRouter({
  base: '/',
  mode: 'hash',
  routes,
})

router.beforeEach((to, from, next) => {
  console.info('main', to, from)
  if (isLogin()) {
    // Loading.service({
    //   text: '加载中...',
    // })
    // store.dispatch('updateUserData')
  }
  // 旧项目路由转发
  if (to.name === 'Legacy' && to.name === from.name && to.path !== from.path) {
    LegacyRouter.push({
      path: to.path,
      query: to.query,
      params: to.params,
    })
  }
  next()
})

export default router
