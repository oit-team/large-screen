<script setup lang="ts">
defineProps({
  content: String,
})
</script>

<template>
  <ElPageHeader class="py-3 px-4" :content="content" @back="$router.back()" />
</template>
