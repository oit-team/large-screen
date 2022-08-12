<template>
  <el-main id="elMain">
    <keep-alive v-if="isRouterAlive">
      <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath"></router-view>
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
