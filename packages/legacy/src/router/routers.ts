import type { RouteConfig } from 'vue-router'
import { defineComponent } from 'vue'

const Container = defineComponent({
  render: h => h('router-view'),
})

export const routes: RouteConfig[] = [
  {
    path: '/test',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  // 大屏相关
  {
    path: '/live-stream',
    component: Container,
    children: [
      {
        path: 'device',
        component: Container,
        children: [
          {
            path: 'list',
            component: () => import('@/views/LiveStream/Device/List.vue'),
          },
        ],
      },
      {
        path: 'carousel-resources',
        component: Container,
        children: [
          {
            path: 'list',
            component: () => import('@/views/LiveStream/CarouselResources/List.vue'),
          },
        ],
      },
    ],
  },
  // 系统设置相关（角色管理、菜单管理、品牌入驻）
  {
    path: '/role/roleList',
    name: 'roleList',
    component: () => import ('@/components/role/roleList.vue'),
    meta: {
      keepAlive: true,
      requiresAuth: true,
    },
  },
  {
    path: '/role/addRole',
    name: 'addRole',
    component: () => import ('@/components/role/addRole.vue'),
    meta: {
      keepAlive: false,
      requiresAuth: true,
    },
  },
  {
    path: '/role/authUsersByRoleId',
    name: 'authUsersByRoleId',
    component: () => import ('@/components/role/authUsersByRoleId.vue'),
    meta: {
      keepAlive: false,
      requiresAuth: true,
    },
  },
  {
    path: '/menu/menuList',
    name: 'menuList',
    component: () => import ('@/components/menu/menuList.vue'),
    meta: {
      keepAlive: true,
      requiresAuth: true,
    },
  },
  {
    path: '/menu/addMenu',
    name: 'addMenu',
    component: () => import ('@/components/menu/addMenu.vue'),
    meta: {
      keepAlive: false,
      requiresAuth: true,
    },
  },
  {
    path: '/brand/brandList',
    name: 'brandList',
    component: () => import ('@/components/brand/brandList.vue'),
    meta: {
      keepAlive: true,
      requiresAuth: true,
    },
  },
  {
    path: '/brand/addBrand',
    name: 'addBrand',
    component: () => import ('@/components/brand/addBrand.vue'),
    meta: {
      keepAlive: false,
      requiresAuth: true,
    },
  },
  {
    path: '/brand/editBrand',
    name: 'editBrand',
    component: () => import ('@/components/brand/editBrand.vue'),
    meta: {
      keepAlive: false,
      requiresAuth: true,
    },
  },
  {
    path: '/brand/brandInteManage',
    name: 'brandInteManage',
    component: () => import ('@/components/brand/brandInteManage.vue'),
    meta: {
      keepAlive: true,
      requiresAuth: true,
    },
  },
  {
    path: '/brand/addUser',
    name: 'addUser',
    component: () => import ('@/components/brand/addUser.vue'),
    meta: {
      keepAlive: false,
      requiresAuth: true,
    },
  },
  {
    path: '/brand/goodsList',
    name: 'goodsList',
    component: () => import ('@/components/brand/goodsList.vue'),
    meta: {
      keepAlive: true,
      requiresAuth: true,
    },
  },
  {
    path: '/brand/addGoods',
    name: 'addGoods',
    component: () => import ('@/components/brand/addGoods.vue'),
    meta: {
      keepAlive: false,
      requiresAuth: true,
    },
  },
  {
    path: '/brand/goodStock',
    name: 'goodStock',
    component: () => import ('@/components/brand/goodStock.vue'),
    meta: {
      keepAlive: false,
      requiresAuth: true,
    },
  },
]
