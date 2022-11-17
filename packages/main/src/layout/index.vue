<script setup>
import Aside from './Aside.vue'
import Header from './Header.vue'
import Main from './Main.vue'

const isReload = ref(true)
function viewReload() {
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
