import Vue from 'vue'
import VueRouter from 'vue-router'
// @ts-expect-error: ignore
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

router.beforeEach(async (to, from, next) => {
  console.info('main', to, from)

  // 路由验证，meta.auth为false时不验证
  const auth = [...to.matched].reverse().every(item => item.meta?.auth === undefined || item.meta?.auth)
  if (auth) {
    if (!isLogin()) return next('/login')
    if (from === VueRouter.START_LOCATION) {
      const loading = Loading.service({
        text: '加载中...',
      })
      // 获取用户数据
      store.dispatch('updateUserData')
        .then(next)
        .catch((err) => {
          next('/login')
          return Promise.reject(err)
        })
        .finally(() => loading.close())

      return
    }
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
