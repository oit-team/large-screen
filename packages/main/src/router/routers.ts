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
      // 首页看板
      {
        path: '/dashboard/data',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/data/index.vue'),
      },
      // 角色管理
      {
        path: '/role/roleList',
        name: 'RoleList',
        component: () => import ('@/views/Role/RoleList.vue'),
      },
      {
        path: '/role/addRole',
        name: 'AddRole',
        component: () => import ('@/views/Role/AddRole.vue'),
      },
      {
        path: '/role/authUsersByRoleId',
        name: 'AuthUsersByRoleId',
        component: () => import ('@/views/Role/AuthUsersByRoleId.vue'),
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
      {
        path: '/category/list',
        name: 'CategoryList',
        component: () => import('@/views/Category/List.vue'),
      },
      {
        path: '/category/update',
        name: 'UpdateCategory',
        component: () => import('@/views/Category/Update.vue'),
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
      // 公共奖池
      {
        path: '/jackpot/public',
        name: 'PublicList',
        component: () => import('@/views/PublicJackpot/PublicList.vue'),
      },
      // 支付成功
      {
        path: '/jackpot/pay-success',
        name: 'PurchasePaySuccess',
        component: () => import('@/views/Jackpot/components/purchasePaySuccess.vue'),
      },
      // 支付失败
      {
        path: '/jackpot/pay-fail',
        name: 'PurchasePayFail',
        component: () => import('@/views/Jackpot/components/purchasePayFail.vue'),
      },
      // 核销记录
      {
        path: '/jackpot/LotteryRecordList',
        name: 'LotteryList',
        component: () => import('@/views/LotteryRecods/LotteryList.vue'),
      },
      // 订单管理
      {
        path: '/jackpot/OrderList',
        name: 'OrderList',
        component: () => import('@/views/Order/OrderList.vue'),
      },
      {
        path: '/jackpot/OrderList/detail',
        name: 'Detail',
        component: () => import('@/views/Order/Detail.vue'),
      },
      // 积分流水
      {
        path: '/jackpot/integralList',
        name: 'IntegralList',
        component: () => import('@/views/Integral/IntegralList.vue'),
      },
      // 配置管理（系统配置）
      {
        path: '/config/systemConfig',
        name: 'SystemConfig',
        component: () => import('@/views/ConfigManage/SystemConfig/List.vue'),
      },
      {
        path: '/config/updateConfig',
        name: 'UpdateConfig',
        component: () => import('@/views/ConfigManage/SystemConfig/Update.vue'),
      },
      // 商场配置
      {
        path: '/config/market',
        name: 'MarketConfig',
        component: () => import('@/views/ConfigManage/MarketConfig/List.vue'),
      },
      // 行业配置
      {
        path: '/config/tradeConfig',
        name: 'TradeConfig',
        component: () => import('@/views/ConfigManage/TradeConfig/List.vue'),
      },
      {
        path: '/config/tradeUpdate/:industryId/:type',
        name: 'TradeUpdate',
        component: () => import('@/views/ConfigManage/TradeConfig/Update.vue'),
      },
      // 用户管理
      {
        path: '/user/list',
        name: 'UserManageList',
        component: () => import('@/views/UserManage/List.vue'),
      },
      // 服务管理
      {
        path: '/service/list',
        name: 'ServiceList',
        component: () => import('@/views/Service/List.vue'),
      },
      // 服务编辑
      {
        path: '/service/update',
        name: 'ServiceUpdate',
        component: () => import('@/views/Service/components/Update.vue'),
      },
      // 服务详情
      {
        path: '/service/detail',
        name: 'ServiceDetail',
        component: () => import('@/views/Service/components/Detail.vue'),
      },
      // 订单管理
      {
        path: '/service/order/list',
        name: 'OrderManageList',
        component: () => import('@/views/OrderManage/List.vue'),
      },
      // 订单详情
      {
        path: '/service/order/detail',
        name: 'OrderDetail',
        component: () => import('@/views/OrderManage/components/Detail.vue'),
      },
      // 活动管理
      {
        path: '/activity/list',
        name: 'ActivityList',
        component: () => import('@/views/ActivityManage/List.vue'),
      },
      {
        path: '/activity/update',
        name: 'ActivityUpdate',
        component: () => import('@/views/ActivityManage/Update.vue'),
      },
      {
        path: '/activity/ticket',
        name: 'ActivityTicket',
        component: () => import('@/views/ActivityManage/Ticket.vue'),
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
