<script setup>
import { useRoute } from 'vue-router/composables'
import Aside from './Aside.vue'
import Header from './Header.vue'
import Main from './Main.vue'

const route = useRoute()
const isReload = ref(true)
function viewReload() {
  // 如果是老项目 切换品牌整个页面刷新
  if (route.name === 'Legacy') {
    window.location.reload()
    return
  }
  isReload.value = false
  setTimeout(() => isReload.value = true)
}

provide('viewReload', viewReload)
</script>

<template>
  <ElContainer class="h-full" direction="vertical">
    <Header />
    <ElContainer class="overflow-hidden">
      <Aside />
      <Main :is-reload="isReload" />
    </ElContainer>
  </ElContainer>
</template>
