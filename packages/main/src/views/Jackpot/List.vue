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
  data: () => ({
    activeName: 'myJackpot',
  }),
  mounted() {
    const activeName = this.$route.query.name
    this.activeName = activeName || 'myJackpot'
  },

  activated() {
  },

  methods: {

    handleClick(tab, event) {
      // console.log(tab, event)
    },
  },
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden page-container">
    <ElTabs v-model="activeName" style="height:100%" class="flex flex-col flex-1" @tab-click="handleClick">
      <ElTabPane label="我的奖池" name="myJackpot" lazy>
        <VcMyJackpot />
      </ElTabPane>
      <ElTabPane label="我的公共池" name="second" lazy>
        <VcCommonJackpot />
      </ElTabPane>
      <ElTabPane label="我的采购池" name="third" lazy>
        <VcPurchaseJackpot />
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
