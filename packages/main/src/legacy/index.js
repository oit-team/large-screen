import { router } from '@oit/legacy'
import appRouter from '@/router'

router.beforeEach((to, from, next) => {
  console.log(to, from, appRouter)
  if (!to.matched.length) {
    if (appRouter.currentRoute.path !== to.path) appRouter.push(to.path)
    return
  }
  next()
})
