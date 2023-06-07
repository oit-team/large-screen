<script>
import VcPurchaseJackpot from './ActivityJackpot'

export default {
  name: 'Ticket',
  components: {
    VcPurchaseJackpot,
  },
  provide() {
    return {
      jackpot: this,
    }
  },
  data: () => ({
    id: '',
  }),
  created() {
    this.id = this.$route.query.id
  },
  methods: {
    goBack() {
      this.$router.back()
    },
  },
}
</script>

<template>
  <div class="h-full flex flex-col page-container overflow-hidden">
    <ElPageHeader content="活动奖券" @back="goBack" />

    <div class="mt-4 flex-1 overflow-hidden">
      <VcPurchaseJackpot :id="id" ref="third" />
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
