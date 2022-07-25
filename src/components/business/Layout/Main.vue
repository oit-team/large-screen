<template>
  <el-main id="elMain">
    <keep-alive v-if="isRouterAlive">
      <router-view :key="$route.fullPath" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view :key="$route.fullPath" v-if="!$route.meta.keepAlive"></router-view>
  </el-main>
</template>

<script>
export default {
  name: 'VcMain',
  data() {
    return {
      isRouterAlive: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.el-main {
  overflow: auto;
  padding: 10px;
}
</style>
