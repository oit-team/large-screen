<template>
  <div id="app">
    <router-view/>
    <div class="text-center leading-[4vh]">Copyright  2021-present 浙江宝瀛轩拍卖有限公司 版权所有 浙ICP备2022010515号</div>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    if (window.performance.navigation.type === 1) {
      this.$router.replace({
        path: '/',
      })
    }
  }
}
</script>

<style lang="scss">
html, body {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  font-size: 13px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
