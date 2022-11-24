<script setup>
import { Message } from 'element-ui'
import { useRouter } from 'vue-router/composables'
import { isLogin } from '@/utils/auth'

const { idle } = useIdle(15 * 60 * 1000)
const router = useRouter()

watch(idle, () => {
  if (idle.value && isLogin()) {
    Message({
      type: 'warning',
      message: '由于长时间无操作，会话已被注销',
    })
    localStorage.clear()
    sessionStorage.clear()
    router.replace({
      path: '/login',
    })
  }
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style lang="scss">
html,
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
