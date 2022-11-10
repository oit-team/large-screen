import { router } from '@oit/legacy'
import appRouter from '@/router'
import '@oit/legacy/dist/style.css'

router.beforeEach((to, from, next) => {
  console.info('legacy', to, from)
  if (!to.matched.length) {
    if (appRouter.currentRoute.path !== to.path) appRouter.replace('/404')
  }
  next()
})
