import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/carousel',
    name: 'Carousel',
    component: () => import('@/views/Carousel.vue'),
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('@/views/Video.vue'),
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('@/views/Recommend.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
