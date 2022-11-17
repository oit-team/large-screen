import Vue from 'vue'
import Vuex from 'vuex'
import { getTokenUser } from '../api/account'
import { clearToken } from '@/utils/auth'
import router from '@/router'

Vue.use(Vuex)

let updateUserDataPromise = null

export default new Vuex.Store({
  state: {
    userData: {},
  },
  getters: {},
  mutations: {
    setUserData(state, data) {
      state.userData = data
    },
  },
  actions: {
    // 更新用户数据，单例模式
    updateUserData(ctx) {
      if (!updateUserDataPromise) updateUserDataPromise = getTokenUser()
      return updateUserDataPromise
        .then((res) => {
          ctx.commit('setUserData', res.body)
          return res
        })
        .catch((err) => {
          err.message = '登录过期，请重新登录'
          ctx.dispatch('logout')
          return Promise.reject(err)
        })
        .finally(() => {
          updateUserDataPromise = null
        })
    },
    logout(ctx, toLogin = true) {
      ctx.commit('setUserData', {})
      clearToken()
      toLogin && router.push({ name: 'Login' })
    },
  },
})
