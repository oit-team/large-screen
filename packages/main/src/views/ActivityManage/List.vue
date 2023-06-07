<script>
import { Message, MessageBox } from 'element-ui'
import { deleteActivity, getActivityList, updateActivityStatus } from '@/api/jackpot'

export default {
  data() {
    return {
      data: {},
    }
  },
  computed: {
    userData() {
      return this.$store.state.userData
    },
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            slot: 'addConfig',
          },
          {
            slot: 'multiple',
          },
          {
            slot: 'deleteItem',
          },
        ],
        table: {
          data: this.data?.resultList,
          selection: true,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '关联奖券',
                type: 'primary',
                icon: 'el-icon-connection',
                click: ({ row }) => this.$router.push({
                  name: 'ActivityTicket',
                  query: {
                    id: `${row.activityId}`,
                  },
                }),
              },
              {
                tip: ({ row }) => ['上架', '下架'][row.shelfStatusKey],
                icon: ({ row }) => ['el-icon-top', 'el-icon-bottom'][row.shelfStatusKey],
                type: ({ row }) => ['primary', 'warning'][row.shelfStatusKey],
                click: async ({ row }) => {
                  const state = row.shelfStatusKey === 0 ? 1 : 0
                  const type = ['上架', '下架'][row.shelfStatusKey]
                  await MessageBox.confirm(`要${type}该商品吗？`, '提示')
                  await updateActivityStatus({
                    activityIds: [row.activityId],
                    shelfStatus: state,
                  })
                  Message.success(`${type}成功`)
                  row.shelfStatusKey = state
                },
              },
              {
                tip: '编辑',
                type: 'success',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'ActivityUpdate',
                  query: {
                    activityId: row.activityId,
                    type: 'edit',
                  },
                }),
                disabled: ({ row }) => row.shelfStatusKey !== 0,
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: async ({ row }) => {
                  await MessageBox.confirm('确认删除吗', '提示', {
                    type: 'warning',
                  })

                  await deleteActivity({
                    activityIds: [row.activityId],
                  })
                  Message.success('删除成功')
                  this.$refs.table.loadData()
                },
                disabled: ({ row }) => row.shelfStatusKey !== 0,
              }],
          },
        },
        pager: {
          total: this.data?.pageTotal,
        },
      }
    },
  },
  methods: {
    async loadData(params) {
      const res = await getActivityList({ ...params })
      this.data = res.body
    },
    toAdd() {
      this.$router.push({
        name: 'ActivityUpdate',
        query: {
          type: 'add',
        },
      })
    },
    async dltActivity(e) {
      const selected = this.$refs.table.selected.map(item => item.activityId)
      if (selected?.length === 0) return

      await MessageBox.confirm('确认删除吗', '提示', {
        type: 'warning',
      })

      await deleteActivity({
        activityIds: selected,
      })
      Message.success('删除成功')
      this.$refs.table.loadData()
    },
    // 批量上下架
    async handleMultiple(num) {
      const selected = this.$refs.table.selected.map(item => item.activityId)
      if (selected?.length === 0) return

      const type = ['下架', '上架'][num]
      await MessageBox.confirm(`确认${type}吗`, '提示', {
        type: 'warning',
      })

      await updateActivityStatus({
        activityIds: selected,
        shelfStatus: num,
      })
      Message.success('成功')
      this.$refs.table.loadData()
    },
  },
}
</script>

<template>
  <div class="w-full h-full p-3">
    <div class="h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1685607618740">
        <template slot="actions:addConfig">
          <ElButton size="small" type="primary" icon="el-icon-plus" @click="toAdd">
            新增
          </ElButton>
        </template>

        <template slot="actions:multiple">
          <ElDropdown class="mx-2">
            <ElButton type="primary" size="small">
              批量管理<i class="el-icon-arrow-down el-icon--right" />
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
        <template slot="actions:deleteItem">
          <ElButton size="small" type="primary" @click="dltActivity()">
            批量删除
          </ElButton>
        </template>
      </TablePage>
    </div>
  </div>
</template>

<style scoped>

</style>
