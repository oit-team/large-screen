<script>
import { addJackpotInfoRequest, deleteJackpotInfo, getJackpotStyleAll, updateJackpotByState } from '@/api/jackpot'

// 上下架状态
export const PUTAWAY_STATE = {
  // 下架
  SOLDOUT: 0,
  // 审批中
  CHECKING: 1,
  // 上架
  PUTAWAY: 2,
}
// 上下架传参状态
export const PUTAWAY_PARAMS = {
  // 下架
  SOLDOUT: 1,
  // 上架
  PUTAWAY: 0,
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
  inject: ['jackpot'],
  data: () => ({
    PUTAWAY_STATE,
    PUTAWAY_STATE_TIPS,
    PUTAWAY_STATE_TEXT,
    PUTAWAY_STATE_ICON,
    data: {},
    selectedIds: [],
    joinPublicDrawer: false,
    joinPublicTableData: [],
    joinPublicForm: {},
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
            click: () => {
              if (!this.$refs.table.checkSelected()) return
              this.joinPublicDrawer = true
              this.joinPublicTableData = this.$refs.table.selected
              this.joinPublicForm = this.$refs.table.selected.reduce((acc, cur) => {
                acc[cur.jackpotId] = cur.jackpotInventory
                return acc
              }, {})
            },
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
                disabled: ({ row }) => row.jackpotState === PUTAWAY_STATE.CHECKING,
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
  watch: {
    'jackpot.activeName': function () {
      this.$refs.table.loadData()
    },
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
      await this.$confirm('确定要删除该商品吗？', '提示', { type: 'warning' })
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
        jackpotType: 1,
      })
    },

    // 当前行上下架
    async upOrDownInfo({ row }) {
      const jackpotState = row.jackpotState === 0 ? 2 : 0
      const jackpotType = PUTAWAY_STATE_TIPS[row.jackpotState]

      await this.$confirm(`确定要${jackpotType}该商品吗？`, '提示', { type: 'warning' })
      await this.updateJackpotByState(jackpotState, row.jackpotId)

      this.$message.success(`${jackpotType}成功！`)
      this.$refs.table.loadData()
    },

    // 奖池：批量上下架
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

    async addJackpotInfoRequest() {
      const table = this.$refs.table
      if (!table.checkSelected()) return
      await addJackpotInfoRequest({
        productList: Object.entries(this.joinPublicForm).map(([k, v]) => ({
          productId: k,
          jackpotNum: v,
        })),
      })
      this.$refs.table.loadData()
      this.joinPublicDrawer = false
      this.$message.success('添加成功')
    },
  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1669614378709">
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
    </div>
    <ElDrawer
      title="加入公共奖池"
      :visible.sync="joinPublicDrawer"
      direction="rtl"
    >
      <div class="flex flex-col h-full overflow-hidden">
        <div class="h-full overflow-hidden">
          <ElTable
            ref="tableRef"
            :data="joinPublicTableData"
            style="width: 100%;"
            height="100%"
          >
            <ElTableColumn
              prop="vouchersName"
              label="图片"
              width="100"
            >
              <template #default="{ row }">
                <ElImage v-if="row.impUrl" :src="row.impUrl" class="w-60px h-60px" fit="cover" />
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="vouchersName"
              label="名称"
            />
            <ElTableColumn
              prop="jackpotInventory"
              label="库存"
            >
              <template #default="{ row }">
                <ElInputNumber v-model="joinPublicForm[row.jackpotId]" class="mr-3" :min="0" :max="row.jackpotInventory" label="描述文字" />
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
        <div class="p-2 text-right">
          <ElButton type="primary" @click="addJackpotInfoRequest()">
            提交
          </ElButton>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<style lang='scss' scoped>
.file-res {
  height: 60px;
  width: 60px;
}
</style>
