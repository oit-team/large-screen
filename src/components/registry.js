import Vue from 'vue'
import * as oitComponents from './oit'

const LOAD_STATUS = oitComponents.LoadMore.LOAD_STATUS

const TIPS = {
  [LOAD_STATUS.INACTIVE]: '点击加载',
  [LOAD_STATUS.LOADING]: '加载中...',
  [LOAD_STATUS.FAIL]: '加载失败，点击重试',
  [LOAD_STATUS.DONE]: '没有更多了',
}

Vue.use(oitComponents.LoadMore, {
  default: (h, scope) => {
    return <div class="p-2 text-center">{TIPS[scope.status]}</div>
  },
})

Object
  .entries(oitComponents)
  .forEach(([, component]) => {
    Vue.component(component.name, component)
  })
