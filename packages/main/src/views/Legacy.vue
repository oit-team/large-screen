<script setup>
import { onMounted, onUnmounted } from 'vue'
import { setup } from '@oit/legacy'

let app

onMounted(() => {
  app = setup()
})

onUnmounted(() => app.$destroy())
</script>

<template>
  <div>
    <div id="legacy" />
  </div>
</template>
