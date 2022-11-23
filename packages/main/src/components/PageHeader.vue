<script setup lang="ts">
defineProps({
  content: String,
})
</script>

<template>
  <div class="flex p-3 items-center">
    <ElPageHeader class="flex-1" :content="content" @back="$router.back()" />
    <slot name="actions" />
  </div>
</template>
