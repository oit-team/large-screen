<script setup>
import Footer from './Footer.vue'
</script>

<template>
  <ElContainer class="overflow-auto" direction="vertical">
    <ElMain class="bg-gray-100 p-3">
      <div class="bg-white rounded-lg h-full">
        <Transition name="el-fade-in" mode="out-in">
          <KeepAlive>
            <RouterView class="h-full overflow-auto" />
          </KeepAlive>
        </Transition>
      </div>
    </ElMain>
    <Footer />
  </ElContainer>
</template>
