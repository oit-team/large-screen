import type { RouteConfig } from 'vue-router'
import { defineComponent } from 'vue'

const Container = defineComponent({
  name: 'Container',
  render: h => h('router-view'),
})

export const routes: RouteConfig[] = [
  {
    path: '/test',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
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
]
