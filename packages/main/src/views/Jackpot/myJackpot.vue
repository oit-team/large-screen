<script>
import { deleteJackpotInfo, getJackpotStyleAll, updateJackpotByState } from '@/api/jackpot'

// 上下架状态
export const PUTAWAY_STATE = {
  // 下架
  SOLDOUT: 0,
  // 审批中
  CHECKING: 1,
  // 上架
  PUTAWAY: 2,
}

export const PUTAWAY_STATE_TIPS = {
  [PUTAWAY_STATE.SOLDOUT]: '上架',
  [PUTAWAY_STATE.CHECKING]: '审批',
  [PUTAWAY_STATE.PUTAWAY]: '下架',
}

export const PUTAWAY_STATE_TEXT = {
  [PUTAWAY_STATE.SOLDOUT]: '下架',
  [PUTAWAY_STATE.CHECKING]: '审批',
  [PUTAWAY_STATE.PUTAWAY]: '上架',
}

export const PUTAWAY_STATE_ICON = {
  [PUTAWAY_STATE.SOLDOUT]: 'el-icon-top',
  [PUTAWAY_STATE.CHECKING]: 'el-icon-reading',
  [PUTAWAY_STATE.PUTAWAY]: 'el-icon-bottom',
}

export default {
  name: 'MyJackpot',
  data: () => ({
    PUTAWAY_STATE,
    PUTAWAY_STATE_TIPS,
    PUTAWAY_STATE_TEXT,
    PUTAWAY_STATE_ICON,
    data: {},
    selectedIds: [],
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: '新增奖券',
            type: 'primary',
            click: this.addJackpot,
          },
          {
            name: '加入公共奖池',
            type: 'primary',
          },
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
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'AddJackpot',
                  query: { jackpotId: row.jackpotId },
                }),
                disabled: ({ row }) => row.jackpotState !== PUTAWAY_STATE.SOLDOUT,
              },
              {
                tip: ({ row }) => PUTAWAY_STATE_TIPS[row.jackpotState],
                type: 'success',
                icon: ({ row }) => PUTAWAY_STATE_ICON[row.jackpotState],
                click: this.upOrDownInfo,
                disabled: ({ row }) => row.jackpotState !== PUTAWAY_STATE.SOLDOUT,
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteJackpotInfo,
                disabled: ({ row }) => row.jackpotState === PUTAWAY_STATE.PUTAWAY,
              },
              // {
              //   tip: '审批记录',
              //   type: 'primary',
              //   icon: 'el-icon-notebook-2',
              // },
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
    async loadData(params) {
      const res = await getJackpotStyleAll({
        ...params,
        jackpotType: 1,
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

    // 上下架
    async updateJackpotByState(jackpotState, jackpotId) {
      await updateJackpotByState({
        jackpotId: (Array.isArray(jackpotId)) ? jackpotId : [jackpotId],
        jackpotState,
      })
    },

    // 当前行上下架
    async upOrDownInfo({ row }) {
      const jackpotState = row.jackpotState
      const jackpotType = PUTAWAY_STATE_TIPS[row.jackpotState]

      await this.$confirm(`确定要${jackpotType}该条信息吗？`, '提示', { type: 'warning' })
      await this.updateJackpotByState(jackpotState, row.jackpotId)

      this.$message.success(`${jackpotType}成功！`)
      this.$refs.table.loadData()
    },

    // 批量上下架
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
    <div class="p-2 h-full">
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
              <ElDropdownItem @click.native="handleMultiple(1)">
                审批
              </ElDropdownItem>
              <ElDropdownItem @click.native="handleMultiple(0)">
                下架
              </ElDropdownItem>
            </ElDropdownMenu>
          </ElDropdown>
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
