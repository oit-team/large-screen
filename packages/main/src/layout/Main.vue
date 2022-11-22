<script setup>
import { useRoute } from 'vue-router/composables'
import Footer from './Footer.vue'

defineProps({
  isReload: Boolean,
})

const route = useRoute()
</script>

<template>
  <ElContainer class="overflow-auto" direction="vertical">
    <ElMain class="bg-gray-100 p-3">
      <div class="bg-white rounded-lg h-full">
        <KeepAlive>
          <Transition v-if="route.meta.keepAlive" name="el-fade-in" mode="out-in">
            <KeepAlive v-if="isReload">
              <RouterView class="h-full overflow-auto" />
            </KeepAlive>
          </Transition>
        </KeepAlive>
        <Transition v-if="!route.meta.keepAlive" name="el-fade-in" mode="out-in">
          <RouterView v-if="isReload" class="h-full overflow-auto" />
        </Transition>
      </div>
    </ElMain>
    <Footer />
  </ElContainer>
</template>
