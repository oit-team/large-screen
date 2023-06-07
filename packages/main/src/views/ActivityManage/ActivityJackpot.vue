<script>
import { PUTAWAY_STATE, PUTAWAY_STATE_ICON, PUTAWAY_STATE_TEXT, PUTAWAY_STATE_TIPS } from '../Jackpot/MyJackpot'
import Purchase from '../Jackpot/components/Purchase.vue'
import { deleteJackpotInfos, getActivityJackpotList, updateJackpotByState } from '@/api/jackpot'
import { convertImageSize } from '@/utils/helper'

export default {
  name: 'MyJackpot',
  components: {
    Purchase,
  },

  inject: ['jackpot'],
  props: {
    id: String,
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
            width: 100,
            buttons: [
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteJackpotInfo,
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
    convertImageSize,
    async loadData(params) {
      const res = await getActivityJackpotList({
        ...params,
        activityId: this.id,
        jackpotType: 0,
      })
      this.data = res.body
    },

    // 解除关联/删除关联奖券 单个
    async deleteJackpotInfo({ row }) {
      await this.$confirm('确定要解除关联吗？', '提示', { type: 'warning' })
      await deleteJackpotInfos({
        jackpotIds: [row.jackpotId],
      })
      this.$message.success('解除成功！')
      this.$refs.table.loadData()
    },

    // 解除关联/删除关联奖券 批量
    async handleMultiple() {
      if (this.$refs.table.selected.length === 0) {
        this.$message({
          message: '请至少选择其中一项数据！',
          type: 'warning',
        })
        return
      }
      await this.$confirm('确定要解除关联吗？', '提示', { type: 'warning' })

      const jackpotIds = this.$refs.table.selected.map(({ jackpotId }) => jackpotId)

      await deleteJackpotInfos({
        jackpotIds,
      })

      this.$message.success('解除成功！')
      this.$refs.table.loadData()
      this.$refs.table.clearSelection()
    },
  },
}
</script>

<template>
  <div class="h-full page-container--column overflow-hidden">
    <ElTabs type="card" class="flex-1 page-container--column overflow-hidden">
      <ElTabPane label="已关联" class="h-full">
        <TablePage v-bind="tablePageOption" ref="table" auto field-key="1669614378709" class="flex-1">
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
          <template slot="actions:multiple">
            <ElButton type="primary" size="small" @click="handleMultiple">
              批量删除
            </ElButton>
          </template>
        </TablePage>
      </ElTabPane>
      <ElTabPane label="未关联奖券" class="h-full overflow-hidden">
        <Purchase :id="id" :is-ticket="1" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style lang='scss' scoped>
.file-res {
  height: 60px;
  width: 60px;
}
:deep(.el-tabs__content){
  flex: 1 1 0%;
}
</style>
