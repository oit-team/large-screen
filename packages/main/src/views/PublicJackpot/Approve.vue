<script>
import { getJackpotStyles, getJacpotAuditList, updateJackpotByState } from '@/api/jackpot'

// 上下架状态
export const PUTAWAY_STATE = {
  // 下架
  SOLDOUT: 0,
  // 上架
  PUTAWAY: 2,
}

export default {
  name: 'Approve',
  data: () => ({
    PUTAWAY_STATE,
    drawer: false,
    data: {},
    selectedIds: [],
    jacpotAuditList: [],
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        // actions: [
        //   {
        //     name: '新增奖券',
        //     type: 'primary',
        //     click: this.addJackpot,
        //   },
        // ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: ({ row }) => ['上架'][row.jackpotState] || '下架',
                type: 'success',
                icon: ({ row }) => ['el-icon-top'][row.jackpotState] || 'el-icon-bottom',
                click: this.upOrDownInfo,
              },
              {
                tip: '审批记录',
                type: 'primary',
                icon: 'el-icon-notebook-2',
                click: this.getJacpotAuditList,
              },
            ],
          },
        },
        pager: {
          total: this.data.count,
        },
      }
    },
  },
  mounted() {
  },

  methods: {
    reload() {
      this.$refs.table.loadData()
    },
    async loadData(params) {
      const res = await getJackpotStyles({
        ...params,
        jackpotState: 2,
        jackpotType: 0,
      })
      this.data = res.body
    },

    addJackpot() {
      this.$router.push({
        name: 'AddJackpot',
        // query: { jackpotType: 'publicJackpot' },
      })
    },

    // 上下架
    async updateJackpotByState(jackpotState, jackpotId) {
      await updateJackpotByState({
        jackpotId: (Array.isArray(jackpotId)) ? jackpotId : [jackpotId],
        jackpotState,
      })
    },

    // 当前行上下架
    async upOrDownInfo({ row }) {
      // 如果状态为0：下架 2：上架
      const jackpotType = row.jackpotState === PUTAWAY_STATE.SOLDOUT ? '上架' : '下架'
      const jackpotState = row.jackpotState === PUTAWAY_STATE.SOLDOUT ? PUTAWAY_STATE.PUTAWAY : PUTAWAY_STATE.SOLDOUT

      await this.$confirm(`确定要${jackpotType}该条信息吗？`, '提示', { type: 'warning' })
      await this.updateJackpotByState(jackpotState, row.jackpotId)

      this.$message.success(`${jackpotType}成功！`)
      this.$refs.table.loadData()
    },

    async getJacpotAuditList({ row }) {
      this.drawer = true
      const res = await getJacpotAuditList({
        jackpotId: row.jackpotId,
      })
      this.jacpotAuditList = res.body.resultList
    },
  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table">
        <template #content:impUrl="{ row }">
          <ElImage v-if="row.impUrl" :src="row.impUrl" class="file-res" fit="cover" />
        </template>
      </TablePage>
      <ElDrawer title="审批记录" :visible.sync="drawer" size="32%">
        <div v-if="jacpotAuditList.length > 0" class="h-full overflow-y-auto">
          <div v-for="(item, index) in jacpotAuditList" :key="index" class="mb-2">
            <ElCard class="box-card flex flex-col">
              <div class="flex">
                <div class="imgInfo p-2 pr-4">
                  <img class="goodsImg" :src="item.impUrl" alt="商品图片">
                </div>
                <div class="flex flex-col justify-center text-sm p-2">
                  <div class="mb-1">
                    <span class="mr-4">商品名称：{{ item.vouchersName }}</span>
                  </div>
                  <div class="mb-1">
                    <span class="mr-4">审核状态：{{ item.jackpotStateName }}</span>
                    <span>审核人：{{ item.auditName }}</span>
                  </div>
                  <div class="mb-1">
                    <span class="mr-4">申请时间：{{ item.applyForTime }}</span>
                    <span>审批时间：{{ item.auditTime }}</span>
                  </div>
                  <div class="mb-1">
                    <span class="mr-4">审核备注：{{ item.auditNote || '暂无' }}</span>
                  </div>
                </div>
              </div>
            </ElCard>
          </div>
        </div>
        <ElEmpty v-else description="暂无数据" />
      </ElDrawer>
    </div>
  </div>
</template>

<style lang='scss' scoped>
::v-deep{
  .el-drawer__header{
    padding: 10px;
    margin: 10px;
    border-bottom: 1px solid #eee;
  }
  .el-drawer__body{
    padding: 10px;
  }
  .el-card__body{
    padding: 10px;
  }
}
.file-res {
  height: 60px;
  width: 60px;
}
.imgInfo{
  width: 80px;
  height: 80px;
  border-right: 1px solid #eee;
  .goodsImg{
    width: 100%;
    height: 100%;
    background-size: cover;
  }

}
</style>
