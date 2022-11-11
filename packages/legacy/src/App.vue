<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    include: [],
  }),
  watch: {
    $route() {
      const name = this.$route.matched.at(-1).components.default.name
      const keepAlive = this.$route.meta.keepAlive
      if (keepAlive && name) {
        this.include = [...new Set([...this.include, name])]
      }
    },
  },
})
</script>

<template>
  <div id="legacy">
    <transition name="el-fade-in" mode="out-in">
      <keep-alive :include="include">
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<style>
#legacy {
  height: 100%;
}
</style>
