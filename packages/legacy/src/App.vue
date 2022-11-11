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
    <Transition name="el-fade-in" mode="out-in">
      <KeepAlive :include="include">
        <RouterView />
      </KeepAlive>
    </Transition>
  </div>
</template>

<style>
#legacy {
  height: 100%;
}
</style>
