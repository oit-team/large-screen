<script>
import { getJackpotStyles, updateJackpotAuditState } from '@/api/jackpot'
import { convertImageSize } from '@/utils/helper'

// 上下架状态
export const PUTAWAY_STATE = {
  // 下架
  SOLDOUT: 0,
  // 上架
  PUTAWAY: 2,
}

export default {
  name: 'UnApprove',
  inject: ['publicJackpot'],
  data: () => ({
    PUTAWAY_STATE,
    drawer: false,
    data: {},
    selectjackpotId: null,
    form: {
      jackpotBuyPrice: '',
      jackpotNote: '',
    },
    checkState: null,
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.resultList,
          actions: {
            width: 120,
            buttons: [
              {
                tip: '通过',
                type: 'success',
                icon: 'el-icon-check',
                click: this.putAway,
              },
              {
                tip: '不通过',
                type: 'warning',
                icon: 'el-icon-close',
                click: this.soldOut,
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
    'publicJackpot.activeName': function () {
      this.$refs.table.loadData()
    },
  },

  methods: {
    convertImageSize,
    async loadData(params) {
      const res = await getJackpotStyles({
        ...params,
        jackpotState: 1,
        jackpotType: 0,
      })
      this.data = res.body
    },

    // 通过
    putAway({ row }) {
      this.drawer = true
      this.selectjackpotId = row.jackpotId
      this.checkState = 2
    },
    // 不通过
    soldOut({ row }) {
      this.drawer = true
      this.selectjackpotId = row.jackpotId
      this.checkState = 0
    },
    // 当前行上下架
    async upOrDownInfo({ row }) {
      // 如果状态为0：下架 2：上架
      const jackpotType = row.jackpotState === PUTAWAY_STATE.SOLDOUT ? '上架' : '下架'
      const jackpotState = row.jackpotState === PUTAWAY_STATE.SOLDOUT ? PUTAWAY_STATE.PUTAWAY : PUTAWAY_STATE.SOLDOUT

      await this.$confirm(`确定要${jackpotType}改商品吗？`, '提示', { type: 'warning' })
      await this.updateJackpotAuditState(jackpotState, row.jackpotId)

      this.$message.success(`${jackpotType}成功！`)
      this.$refs.table.loadData()
    },

    // 通过
    async passJackpotAuditState() {
      await updateJackpotAuditState({
        jackpotId: this.selectjackpotId,
        jackpotState: this.checkState,
        jackpotBuyPrice: this.form.jackpotBuyPrice,
      })
    },
    // 不通过
    async outJackpotAuditState() {
      const res = await updateJackpotAuditState({
        jackpotId: this.selectjackpotId,
        jackpotState: this.checkState,
        jackpotNote: this.form.jackpotNote,
      })
    },
    async toSubmit() {
      await this.checkState === 2 ? this.passJackpotAuditState() : this.outJackpotAuditState()
      this.$message.success('提交成功！')
      this.drawer = false
      this.form = {}
      this.$refs.table.loadData()
    },
  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" field-key="1669627381942" auto>
        <template #column:impUrl>
          <ElTableColumn
            prop="impUrl"
            label="图片"
            align="center"
            width="140"
          >
            <div />
            <template slot-scope="scope">
              <ElImage v-if="scope.row.impUrl" :src="convertImageSize(scope.row.impUrl)" class="block w-70px h-70px mx-auto" fit="cover" />
              <div v-else class="text-gray-300">
                暂无
              </div>
            </template>
          </ElTableColumn>
        </template>
      </TablePage>
    </div>

    <ElDrawer title="审核" :visible.sync="drawer" size="40%">
      <div class="p-4">
        <ElForm ref="form" :model="form" label-width="80px">
          <ElFormItem v-if="checkState === 2" prop="jackpotBuyPrice" label="采购价格">
            <ElInput v-model="form.jackpotBuyPrice" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" />
          </ElFormItem>
          <ElFormItem v-if="checkState === 0" prop="jackpotNote" label="审核原因">
            <ElInput v-model="form.jackpotNote" maxlength="20" show-word-limit />
          </ElFormItem>
        </ElForm>
        <ElButton class="add" type="primary" @click="toSubmit('form')">
          提交
        </ElButton>
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
