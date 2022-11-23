<script>
import { deleteJackpotInfo, getJackpotStyleAll, updateJackpotByState } from '@/api/jackpot'
// 上下架状态
export const PUTAWAY_STATE = {
  // 下架
  SOLDOUT: 0,
  // 上架
  PUTAWAY: 2,
}

export default {
  name: 'CommonJackpot',
  data: () => ({
    PUTAWAY_STATE,
    data: {},

  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: '批量下架',
            type: 'primary',
            click: this.handleMultiple,
          },
        ],
        table: {
          rowKey: 'ROW_ID',
          reserveSelection: true,
          selection: true,
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'AddJackpot',
                  query: { jackpotId: row.jackpotId },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteJackpotInfo,
              },
              {
                tip: '下架',
                type: 'success',
                icon: 'el-icon-bottom',
                click: this.upOrDownInfo,
              },
              {
                tip: '审批记录',
                type: 'primary',
                icon: 'el-icon-notebook-2',
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

  activated() {
  },

  methods: {
    async loadData(params) {
      const res = await getJackpotStyleAll({
        ...params,
        jackpotType: 0,
      })
      this.data = res.body
    },

    addJackpot() {
      this.$router.push({
        name: 'AddJackpot',
      })
    },

    async deleteJackpotInfo({ row }) {
      await deleteJackpotInfo({
        productId: row.jackpotId,
      })
      this.$message.success('删除成功！')
      this.$refs.table.loadData()
    },

    // 下架
    async updateJackpotByState(jackpotState, jackpotId) {
      await updateJackpotByState({
        jackpotId: (Array.isArray(jackpotId)) ? jackpotId : [jackpotId],
        jackpotState,
      })
    },

    // 当前行下架
    async upOrDownInfo({ row }) {
      await this.$confirm('确定要下架该条信息吗？', '提示', { type: 'warning' })
      await this.updateJackpotByState(PUTAWAY_STATE.SOLDOUT, row.jackpotId)

      this.$message.success('下架成功！')
      this.$refs.table.loadData()
    },

    // 批量下架
    async handleMultiple() {
      if (this.$refs.table.selected.length === 0) {
        this.$message({
          message: '请至少选择其中一项数据！',
          type: 'warning',
        })
        return
      }
      const selectedIds = this.$refs.table.selected.map(({ jackpotId }) => jackpotId)

      await this.updateJackpotByState(PUTAWAY_STATE.SOLDOUT, selectedIds)
      this.$message.success('下架成功！')
      this.$refs.table.loadData()
      this.$refs.table.clearSelection()
    },
  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto>
        <template #content:impUrl="{ row }">
          <ElImage v-if="row.impUrl" :src="row.impUrl" class="file-res" fit="cover" />
        </template>
      </TablePage>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.file-res {
  height: 60px;
  width: 60px;
}
</style>

