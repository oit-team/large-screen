<script>
import { PUTAWAY_STATE, PUTAWAY_STATE_ICON, PUTAWAY_STATE_TEXT, PUTAWAY_STATE_TIPS } from './MyJackpot'
import Purchase from './components/Purchase.vue'
import { deleteJackpotInfo, getJackpotStyleAll, updateJackpotByState } from '@/api/jackpot'

export default {
  name: 'MyJackpot',

  components: {
    Purchase,
  },

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
            slot: 'multiple',
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
                tip: ({ row }) => PUTAWAY_STATE_TIPS[row.jackpotState],
                type: 'success',
                icon: ({ row }) => PUTAWAY_STATE_ICON[row.jackpotState],
                click: this.upOrDownInfo,
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteJackpotInfo,
                disabled: ({ row }) => row.jackpotState !== PUTAWAY_STATE.SOLDOUT,
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

  methods: {
    async loadData(params) {
      const res = await getJackpotStyleAll({
        ...params,
        jackpotType: 2,
      })
      this.data = res.body
    },
    addJackpot() {
      this.$router.push({
        name: 'AddJackpot',
      })
    },

    async deleteJackpotInfo({ row }) {
      await this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
      await deleteJackpotInfo({
        productId: row.jackpotId,
      })
      this.$message.success('删除成功！')
      this.$refs.table.loadData()
    },
    // 上下架
    async updateJackpotByState(jackpotState, jackpotId) {
      await updateJackpotByState({
        jackpotId: (Array.isArray(jackpotId)) ? jackpotId : [jackpotId],
        jackpotState,
        jackpotType: 2,
      })
    },

    // 当前行上下架
    async upOrDownInfo({ row }) {
      // 如果状态为0：下架 2：上架
      const jackpotState = row.jackpotState === 0 ? 2 : 0
      const jackpotType = PUTAWAY_STATE_TIPS[row.jackpotState]

      await this.$confirm(`确定要${jackpotType}该条信息吗？`, '提示', { type: 'warning' })
      await this.updateJackpotByState(jackpotState, row.jackpotId)

      this.$message.success(`${jackpotType}成功！`)
      this.$refs.table.loadData()
      this.$refs.table.clearSelection()
    },

    // 采购池：批量上下架
    async handleMultiple(state) {
      if (this.$refs.table.selected.length === 0) {
        this.$message({
          message: '请至少选择其中一项数据！',
          type: 'warning',
        })
        return
      }
      const selectedIds = this.$refs.table.selected.map(({ jackpotId }) => jackpotId)
      const jackpotType = PUTAWAY_STATE_TEXT[state]

      await this.updateJackpotByState(state, selectedIds)
      this.$message.success(`${jackpotType}成功！`)
      this.$refs.table.loadData()
      this.$refs.table.clearSelection()
    },
  },
}
</script>

<template>
  <div class="h-full">
    <ElTabs type="card">
      <ElTabPane label="已采购">
        <TablePage v-bind="tablePageOption" ref="table" auto>
          <template #content:impUrl="{ row }">
            <ElImage v-if="row.impUrl" :src="row.impUrl" class="file-res" fit="cover" />
          </template>
          <template slot="actions:multiple">
            <ElDropdown class="mx-2">
              <ElButton type="primary" size="small">
                批量管理<i class="el-icon-arrow-down el-icon--right" />
              </ElButton>
              <ElDropdownMenu slot="dropdown">
                <ElDropdownItem @click.native="handleMultiple(2)">
                  上架
                </ElDropdownItem>
                <ElDropdownItem @click.native="handleMultiple(0)">
                  下架
                </ElDropdownItem>
              </ElDropdownMenu>
            </ElDropdown>
          </template>
        </TablePage>
      </ElTabPane>
      <ElTabPane label="采购奖券">
        <Purchase />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style lang='scss' scoped>
.file-res {
  height: 60px;
  width: 60px;
}
</style>
