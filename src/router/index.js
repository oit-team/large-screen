import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/business/Layout/'
Vue.use(VueRouter)

const routes = [
  {
    path: '/Login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: false,
      requiresAuth: false,
    },
    component: () => import('@/views/Login'),
  },
  {
    path: '',
    component: Layout,
    meta: {
      keepAlive: true,
      requiresAuth: true,
    },
    children: [
      {
        path: '/',
        name: 'Home',
        meta: {
          title: '首页',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Home'),
      },
      {
        path: 'role/roleList',
        name: 'RoleList',
        meta: {
          title: '角色列表',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Role/RoleList'),
      },
      {
        path: 'Menu/MenuList',
        name: 'MenuList',
        meta: {
          title: '菜单列表',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Menu/MenuList'),
      },
      {
        path: 'brand/goodslist',
        name: 'GoodsList',
        meta: {
          title: '商品管理',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Brand/GoodsList'),
      },
      {
        path: 'brand/addgoods',
        name: 'AddGoods',
        meta: {
          title: '商品管理',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Brand/AddGoods'),
      },
      {
        path: 'author/authorlist',
        name: 'AuthorList',
        meta: {
          title: '作者管理',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Author/AuthorList'),
      },
      {
        path: '/role/roleList',
        name: 'RoleList',
        meta: {
          title: '角色管理',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Role/RoleList'),
      },
      {
        path: 'author/userlist',
        name: 'UserList',
        meta: {
          title: '用户管理',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Author/UserList'),
      },
      {
        path: 'author/edituserinfo',
        name: 'edituserinfo',
        meta: {
          title: '用户管理',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Author/EditUserInfo'),
      },
      {
        path: 'log/logList',
        name: 'LogInfo',
        meta: {
          title: '日志记录',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('@/views/LogList/index'),
      },
      {
        path: '/role/addRole',
        name: 'RoleList',
        meta: {
          title: '角色管理',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Role/addRole'),
      },
      {
        path: '/role/roleUsersByRoleId',
        name: 'roleUsersByRoleId',
        meta: {
          title: '角色管理',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Role/RoleUsersByRoleId'),
      },
      {
        path: 'author/addauthor',
        name: 'AddAuthor',
        meta: {
          title: '作者管理',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Author/AddAuthor'),
      },
      {
        path: 'Auction/AuctionConfig',
        name: 'AuctionConfig',
        meta: {
          title: '竞拍配置',
          keepAlive: false,
          requiresAuth: false,
        },
        component: () => import('@/views/Auction/AuctionConfig'),
      },
      {
        path: 'Order',
        name: 'Order',
        meta: {
          title: '订单管理',
          keepAlive: true,
          requiresAuth: false,
        },
        component: () => import('@/views/Order/index'),
      },
      {
        path: 'Order/EditAuctionInfo',
        name: 'EditAuctionInfo',
        meta: {
          title: '竞拍订单详情',
          keepAlive: false,
          requiresAuth: false,
        },
        component: () => import('@/views/Order/EditAuctionInfo'),
      },
      {
        path: 'Order/EditShoppingInfo',
        name: 'EditShoppingInfo',
        meta: {
          title: '购物订单详情',
          keepAlive: false,
          requiresAuth: false,
        },
        component: () => import('@/views/Order/EditShoppingInfo'),
      },
      {
        path: 'withdraw/list',
        name: 'WithdrawList',
        component: () => import('@/views/Withdraw/List')
      },
      {
        path: 'coupons/list',
        name: 'CouponsList',
        component: () => import('@/views/Coupons/List')
      },
    ],
  },
]
const router = new VueRouter({
  routes,
})

export default router
