<script>
export default {
  data() {
    return {
      lastTime: null, // 最后一次点击的时间
      currentTime: null, // 当前点击的时间
      timeOut: 5 * 60 * 1000, // 设置超时时间:40分钟
    }
  },
  created() {
    this.lastTime = new Date().getTime()
  },
  mounted() {
  },
  methods: {
    // 判断超时，页面超过一小时没有操作，即视为超时，跳转到登陆页面
    isTimeOut() {
      this.currentTime = new Date().getTime() // 记录这次点击的时间
      if ((this.currentTime - this.lastTime) > this.timeOut) { // 判断上次最后一次点击的时间和这次点击的时间间隔是否大于30分钟
        // 判断是不是已登录状态
        if (sessionStorage.userId) {
          this.$message({
            type: 'warning',
            message: '由于长时间无操作，会话已被注销',
          })
          localStorage.clear()
          sessionStorage.clear()
          this.$router.replace({
            path: '/login',
          })
        }
        else {
          this.lastTime = new Date().getTime()
        }
      }
      else {
        this.lastTime = new Date().getTime() // 如果在30分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
      }
    },
  },
}
</script>

<template>
  <div id="app" @click="isTimeOut">
    <RouterView />
  </div>
</template>

<style lang="scss">
html, #app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
