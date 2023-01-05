<script>
export default {
  name: 'PurchasePaySuccess',
  created() {
    // console.log(this.$route.query, '支付后url参数')
  },
  methods: {
    goBack() {
      this.$router.replace({
        path: '/jackpot/merchant',
      })
    },
  },
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <ElResult icon="success" title="支付成功" sub-title="请根据提示进行操作">
      <template slot="extra">
        <ElButton type="primary" size="medium" @click="goBack">
          返回
        </ElButton>
      </template>
    </ElResult>
  </div>
</template>

<style lang='scss' scoped>

</style>

