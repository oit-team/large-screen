<script>
import VcApprove from './Approve'
import VcUnApprove from './UnApprove'
export default {
  name: 'PublicList',
  components: {
    VcApprove,
    VcUnApprove,
  },
  data: () => ({
    activeName: 'publicJackpot',
  }),

  watch: {
    activeName: {
      immediate: true,
      async handler() {
        await this.$nextTick()
        this.$refs[this.activeName].reload()
      },
    },
  },

}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden page-container">
    <ElTabs v-model="activeName" style="height:100%" class="flex flex-col flex-1">
      <ElTabPane label="已审批" name="publicJackpot" lazy>
        <VcApprove ref="publicJackpot" />
      </ElTabPane>
      <ElTabPane label="未审批" name="second" lazy>
        <VcUnApprove ref="second" />
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
