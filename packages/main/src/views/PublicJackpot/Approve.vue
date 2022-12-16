<script>
import { getJackpotStyles, getJacpotAuditList, updateJackpotByState } from '@/api/jackpot'
import { convertImageSize } from '@/utils/helper'

// 上下架状态
export const PUTAWAY_STATE = {
  // 下架
  SOLDOUT: 0,
  // 上架
  PUTAWAY: 2,
}

export default {
  name: 'Approve',
  inject: ['publicJackpot'],
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
        table: {
          data: this.data.resultList,
          actions: {
            width: 120,
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
  watch: {
    'publicJackpot.activeName': function () {
      this.$refs.table.loadData()
    },
  },
  mounted() {
  },

  methods: {
    convertImageSize,
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

      await this.$confirm(`确定要${jackpotType}该商品吗？`, '提示', { type: 'warning' })
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
      <ElDrawer title="审批记录" :visible.sync="drawer" size="35%">
        <div v-if="jacpotAuditList.length > 0" class="h-full overflow-y-auto">
          <div v-for="(item, index) in jacpotAuditList" :key="index" class="mb-2">
            <ElCard class="box-card flex flex-col justify-center item-center">
              <div class="flex">
                <div class="imgInfo w1/5 p-2 pr-4">
                  <img v-if="item.impUrl" class="goodsImg" :src="convertImageSize(item.impUrl)" alt="商品图片">
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
                    <ElTooltip class="item" effect="light" :content="item.auditNote || '暂无'" placement="bottom-start">
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
</style>
