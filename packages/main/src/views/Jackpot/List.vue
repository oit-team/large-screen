<script>
import VcCommonJackpot from './CommonJackpot'
import VcMyJackpot from './MyJackpot'
import VcPurchaseJackpot from './PurchaseJackpot'
export default {
  name: 'JackpotList',
  components: {
    VcCommonJackpot,
    VcMyJackpot,
    VcPurchaseJackpot,
  },
  provide() {
    return {
      jackpot: this,
    }
  },

  data: () => ({
    activeName: 'myJackpot',
  }),

  mounted() {
    const activeName = this.$route.query.name
    this.activeName = activeName || 'myJackpot'
  },

}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden page-container">
    <ElTabs v-model="activeName" style="height:100%" class="flex flex-col flex-1">
      <ElTabPane label="我的奖池" name="myJackpot" lazy>
        <VcMyJackpot ref="myJackpot" />
      </ElTabPane>
      <ElTabPane label="我的公共池" name="second" lazy>
        <VcCommonJackpot ref="common" />
      </ElTabPane>
      <ElTabPane label="我的采购池" name="third" lazy>
        <VcPurchaseJackpot ref="third" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style lang='scss' scoped>
::v-deep{
  .el-tabs .el-tabs--top{
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-tabs .el-tabs__content{
    flex: 1;
    height: 100%;
    .el-tab-pane{
      height: 100%;
    }
  }
}
</style>
