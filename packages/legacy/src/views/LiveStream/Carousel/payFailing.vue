<script>
export default {
  name: 'PayFailing',
  methods: {
    goBack() {
      this.$router.replace({
        path: '/live-stream/carousel/public-release',
      })
    },
  },
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <el-result icon="error" title="支付失败" sub-title="请根据提示进行操作">
      <template slot="extra">
        <el-button type="primary" size="medium">
          返回
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<style lang='scss' scoped>

</style>
