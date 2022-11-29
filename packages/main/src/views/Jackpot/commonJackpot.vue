<script>
import { PUTAWAY_PARAMS, PUTAWAY_STATE, PUTAWAY_STATE_ICON, PUTAWAY_STATE_TEXT, PUTAWAY_STATE_TIPS } from './MyJackpot'
import { deleteJackpotInfo, getJackpotStyleAll, getJacpotAuditList, updateJackpotByState } from '@/api/jackpot'

export default {
  name: 'CommonJackpot',
  data: () => ({
    PUTAWAY_STATE,
    drawer: false,
    jacpotAuditList: [],
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
            width: 220,
            buttons: [
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'AddJackpot',
                  query: { jackpotId: row.jackpotId, name: 'second' },
                }),
                disabled: ({ row }) => row.jackpotState !== PUTAWAY_STATE.SOLDOUT,
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteJackpotInfo,
                disabled: ({ row }) => row.jackpotState !== PUTAWAY_STATE.SOLDOUT,
              },
              // 上下架
              {
                tip: ({ row }) => ['上架'][row.jackpotState] || '下架',
                type: 'success',
                icon: ({ row }) => ['el-icon-top'][row.jackpotState] || 'el-icon-bottom',
                click: this.upOrDownInfo,
                disabled: ({ row }) => row.jackpotState !== PUTAWAY_STATE.PUTAWAY,
              },
              {
                tip: '提交审批',
                type: 'info',
                icon: 'el-icon-folder-checked',
                click: this.upOrDownInfo,
                disabled: ({ row }) => row.jackpotState !== PUTAWAY_STATE.SOLDOUT,
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
      await this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
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
        jackpotType: 0,
      })
    },

    // 当前行下架、审批
    async upOrDownInfo({ row }) {
      // 如果状态为0：下架 1: 审批
      const jackpotState = row.jackpotState === 0 ? 1 : 0
      const jackpotType = PUTAWAY_STATE_TIPS[row.jackpotState]

      await this.$confirm(`确定要${jackpotType}该条信息吗？`, '提示', { type: 'warning' })
      await this.updateJackpotByState(jackpotState, row.jackpotId)

      if (jackpotType === '审核') {
        this.$message.success(`完成${jackpotType}提交！`)
      }
      else {
        this.$message.success(`${jackpotType}成功！`)
      }
      this.$refs.table.loadData()
    },

    // 公共池：批量1审批、0下架
    async handleMultiple(state) {
      if (this.$refs.table.selected.length === 0) {
        this.$message({
          message: '请至少选择其中一项数据！',
          type: 'warning',
        })
        return
      }

      const curState = state === 0 ? 2 : 0
      const selectItems = []
      this.$refs.table.selected.forEach((item) => {
        if (item.jackpotState === 0 && curState === 0) {
          selectItems.push(item.jackpotId)
        }
        else if (item.jackpotState === 2 && curState === 2) {
          selectItems.push(item.jackpotId)
        }
      })

      const jackpotType = PUTAWAY_STATE_TEXT[state]

      if (selectItems.length === 0) {
        this.$message.warning('没有符合条件的商品，请重新勾选！')
        this.$refs.table.clearSelection()
        return
      }

      await this.updateJackpotByState(state, selectItems)
      if (jackpotType === '审批') {
        this.$message.success(`完成${jackpotType}提交！`)
      }
      else {
        this.$message.success(`${jackpotType}成功！`)
      }
      this.$refs.table.loadData()
      this.$refs.table.clearSelection()
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
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1669286174849">
        <template #content:impUrl="{ row }">
          <ElImage v-if="row.impUrl" :src="row.impUrl" class="file-res" fit="cover" />
        </template>
        <template slot="actions:multiple">
          <ElDropdown class="mx-2">
            <ElButton type="primary" size="small">
              批量管理<i class="el-icon-arrow-down el-icon--right" />
            </ElButton>
            <ElDropdownMenu slot="dropdown">
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
      <ElDrawer title="审批记录" :visible.sync="drawer" size="35%">
        <div v-if="jacpotAuditList.length > 0" class="h-full overflow-y-auto">
          <div v-for="(item, index) in jacpotAuditList" :key="index" class="mb-2">
            <ElCard class="box-card flex flex-col justify-center item-center">
              <div class="flex">
                <div class="imgInfo w1/5 p-2 pr-4">
                  <img v-if="item.impUrl" class="goodsImg" :src="item.impUrl" alt="商品图片">
                  <ElAvatar v-else :size="60" src="https://empty" @error="errorHandler">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
                  </ElAvatar>
                </div>
                <div class="flex w4/5 flex-col justify-center text-sm p-2">
                  <div class="mb-1">
                    <span class="mr-4">商品名称：{{ item.vouchersName }}</span>
                  </div>
                  <div class="mb-1">
                    <span class="mr-4">审核状态：{{ item.jackpotStateName }}</span>
                    <span>审核人：{{ item.auditName || '暂无' }}</span>
                  </div>
                  <div class="mb-1">
                    <span class="mr-4">申请时间：{{ item.applyForTime }}</span>
                  </div>
                  <div class="mb-1">
                    <span>审批时间：{{ item.auditTime || '暂无' }}</span>
                  </div>
                  <div class="mb-1">
                    <ElTooltip class="item" effect="light" :content="item.auditNote" placement="bottom-start">
                      <div class="mr-4 truncate">
                        审核说明：{{ item.auditNote || '暂无' }}
                      </div>
                    </ElTooltip>
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
.file-res {
  height: 60px;
  width: 60px;
}
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
  .imgInfo{
    display: flex;
    align-items: center;
    width: 130px;
    border-right: 1px solid #eee;
  .goodsImg{
    width: 100%;
    height: 120px;
    background-size: cover;
  }

  }
}
</style>

