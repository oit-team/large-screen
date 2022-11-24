<script>
import { getJackpotStyles, updateJackpotByState } from '@/api/jackpot'

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
    data: {},
    selectedIds: [],
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
    </div>
  </div>
</template>

<style lang='scss' scoped>
.file-res {
  height: 60px;
  width: 60px;
}
</style>
