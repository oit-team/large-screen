import type { RouteConfig } from 'vue-router'
import { defineComponent } from 'vue'
import Layout from '@/layout/index.vue'

const Container = defineComponent({
  render(h) {
    return h('router-view')
  },
})

export const routes: RouteConfig[] = [
  {
    path: '',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/product/list',
        component: () => import('@/views/Product/List.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: '/product/new',
        component: () => import('@/views/Product/Update.vue'),
      },
      {
        path: '/product/edit/:id',
        component: () => import('@/views/Product/Update.vue'),
        meta: {
          edit: true,
        },
      },
      // 奖池
      {
        path: '/jackpot/merchant',
        name: 'JackpotList',
        component: () => import('@/views/Jackpot/List.vue'),
      },
      // 新增奖池
      {
        path: '/jackpot/addJackpot',
        name: 'AddJackpot',
        component: () => import('@/views/Jackpot/Update.vue'),
      },
      {
        path: '/404',
        component: () => import('@/views/404.vue'),
      },
      {
        path: '*',
        name: 'Legacy',
        component: () => import('@/views/Legacy.vue'),
      },
    ],
  },
  // 不要在这里添加新的路由，上面已定义*通配符路由
]
