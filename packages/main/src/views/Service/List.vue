<script>
import { deleteServiceInfo, getServiceInfoList, upAndDownServiceInfo } from '@/api/serviceManage'
import { convertImageSize } from '@/utils/helper'
// 上下架状态
export const PUTAWAY_STATE = {
  // 已下架
  DOWN: 0,
  // 已上架
  UP: 1,
}
// 上下架传参状态
export const PUTAWAY_PARAMS = {
  // 要下架
  DOWN: 0,
  // 要上架
  UP: 1,
}

export const PUTAWAY_STATE_TIPS = {
  [PUTAWAY_STATE.DOWN]: '上架',
  [PUTAWAY_STATE.UP]: '下架',
}

export const PUTAWAY_STATE_TEXT = {
  [PUTAWAY_STATE.UP]: '下架',
  [PUTAWAY_STATE.DOWN]: '上架',
}

export const PUTAWAY_STATE_ICON = {
  [PUTAWAY_STATE.DOWN]: 'el-icon-top',
  [PUTAWAY_STATE.UP]: 'el-icon-bottom',
}
export default {
  name: 'ServiceList',
  data: () => ({
    PUTAWAY_STATE,
    PUTAWAY_PARAMS,
    PUTAWAY_STATE_TIPS,
    PUTAWAY_STATE_TEXT,
    PUTAWAY_STATE_ICON,
    data: {},
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: '新增',
            type: 'primary',
            icon: 'el-icon-plus',
            to: 'ServiceUpdate',
          },
          {
            name: '批量删除',
            type: 'primary',
            icon: 'el-icon-delete',
            click: this.batchDelete,
          },
          {
            slot: 'multiple',
          },
        ],
        table: {
          data: this.data.advertsList,
          selection: true,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '详情',
                type: 'success',
                icon: 'el-icon-view',
                click: ({ row }) => this.$router.push({
                  name: 'ServiceDetail',
                  query: {
                    isCheck: true,
                    id: row.id,
                  },
                }),
              },
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'ServiceUpdate',
                  query: {
                    isEdit: true,
                    id: row.id,
                  },
                }),
                disabled: ({ row }) => row.shelfStatus === PUTAWAY_STATE.UP,
              },
              {
                tip: ({ row }) => PUTAWAY_STATE_TIPS[row.shelfStatus],
                type: 'primary',
                icon: ({ row }) => PUTAWAY_STATE_ICON[row.shelfStatus],
                click: this.upAndDownServiceInfo,
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteServiceInfo,
                disabled: ({ row }) => row.shelfStatus === PUTAWAY_STATE.UP,
              },
            ],
          },
        },
        pager: {
          total: this.data.totalCount,
        },
      }
    },
  },
  methods: {
    convertImageSize,
    async loadData(params) {
      const res = await getServiceInfoList({
        ...params,
      })
      this.data = res.body
    },

    // 单项删除
    async deleteServiceInfo({ row }) {
      await this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
      await deleteServiceInfo({
        idList: [row.id],
      })
      this.$message.success('删除成功！')
      this.$refs.table.loadData()
    },
    // 批量删除
    async batchDelete() {
      if (this.$refs.table.selected.length === 0) {
        this.$message({
          message: '请至少勾选其中一项数据！',
          type: 'warning',
        })
        return
      }

      const selectItems = []
      this.$refs.table.selected.forEach((item) => {
        if (item.shelfStatus !== PUTAWAY_STATE.UP) {
          selectItems.push(item.id)
        }
      })

      if (selectItems.length === 0) {
        this.$message.warning('没有符合条件的商品，请重新勾选！')
        this.$refs.table.clearSelection()
        return
      }

      await this.$confirm('确定要删除勾选数据？', '提示', { type: 'warning' })
      await deleteServiceInfo({
        idList: selectItems,
      })
      this.$message.success('删除成功！')
      this.$refs.table.loadData()
    },

    // 单项上下架
    async upAndDownServiceInfo({ row }) {
      const type = PUTAWAY_STATE_TIPS[row.shelfStatus]
      const status = row.shelfStatus === PUTAWAY_STATE.DOWN ? PUTAWAY_PARAMS.UP : PUTAWAY_PARAMS.DOWN

      await this.$confirm(`要${type}该服务吗？`, '提示', { type: 'warning' })
      await upAndDownServiceInfo({
        idList: [row.id],
        shelfStatus: status,
      })
      this.$message.success(`${type}成功！`)
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
      const selectedIdList = this.$refs.table.selected.map(({ id }) => id)
      const type = state === 0 ? '下架' : '上架'

      await this.$confirm(`要批量${type}该服务吗？`, '提示', { type: 'warning' })
      await upAndDownServiceInfo({
        idList: selectedIdList,
        shelfStatus: state,
      })
      this.$message.success(`${type}成功！`)
      this.$refs.table.loadData()
    },
  },
}
</script>

<template>
  <div class="h-full p-2 flex flex-col overflow-hidden page-container">
    <TablePage v-bind="tablePageOption" ref="table" field-key="1685512904100" auto>
      <template slot="actions:multiple">
        <ElDropdown class="mx-2">
          <ElButton type="primary" size="small">
            批量上/下架<i class="el-icon-arrow-down el-icon--right" />
          </ElButton>
          <ElDropdownMenu slot="dropdown">
            <ElDropdownItem @click.native="handleMultiple(1)">
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
</template>

<style lang='scss' scoped>

</style>
