<script setup>
import { onMounted, onUnmounted } from 'vue'
import { setup } from '@oit/legacy'
import store from '@/store'

let app

onMounted(() => {
  const userData = store.state.userData
  app = setup({
    userData: {
      userId: userData.id,
      brandId: userData.brandId,
    },
  })
})

onUnmounted(() => app.$destroy())
</script>

<template>
  <div>
    <div id="legacy" />
  </div>
</template>
