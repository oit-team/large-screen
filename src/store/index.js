import Vue from 'vue'
import Vuex from 'vuex'
import aside from './modules/aside'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageBtnRole: [],
  },
  mutations: {
    setPageBtnRole(state, v) {
      state.pageBtnRole = v
    },
  },
  actions: {
  },
  modules: {
    aside,
  },
})
