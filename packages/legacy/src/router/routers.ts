import type { RouteConfig } from 'vue-router'

export const routes: RouteConfig[] = [
  {
    path: '/test',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
]
