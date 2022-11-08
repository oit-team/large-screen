import type { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const routes: RouteConfig[] = [
  {
    path: '',
    redirect: '/home',
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
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
        path: '*',
        name: 'Legacy',
        component: () => import('@/views/Legacy.vue'),
      },
    ],
  },
]
