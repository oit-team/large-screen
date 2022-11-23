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
      <ElTabPane label="已审批" name="publicJackpot" lazy>
        <VcApprove />
      </ElTabPane>
      <ElTabPane label="未审批" name="second" lazy>
        <VcUnApprove />
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
