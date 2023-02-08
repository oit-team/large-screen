<script>
import { Message, MessageBox } from 'element-ui'
import { getIndustryList, updateIndustryState } from '@/api/systemConfig'

export default {
  data() {
    return {
      // formData: {
      //   pageNum: 1,
      //   pageSize: 20,
      //   industryName: '',
      //   startcreateTime: '',
      //   endcreateTime: '',
      //   startupdateTime: '',
      //   endupdateTime: '',
      // },
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
        ],
        table: {
          data: this.data?.resultList,
          actions: {
            width: 150,
            buttons: [
              {
                tip: ({ row }) => ['上架', '下架'][row.state],
                icon: ({ row }) => ['el-icon-top', 'el-icon-bottom'][row.state],
                type: 'warning',
                click: async ({ row }) => {
                  const state = row.state === 0 ? 1 : 0
                  const type = ['上架', '下架'][row.state]
                  await MessageBox.confirm(`要${type}该商品吗？`, '提示')
                  await updateIndustryState({
                    industryId: row.industryId,
                    state,
                  })
                  Message.success(`${type}成功`)
                  row.state = state
                },
              },
              {
                tip: '编辑',
                type: 'success',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'TradeUpdate',
                  params: {
                    industryId: row.industryId,
                    type: 'edit',
                  },
                }),
              }, {
                tip: '查看',
                type: 'info',
                icon: 'el-icon-view',
                click: ({ row }) => this.$router.push({
                  name: 'TradeUpdate',
                  params: {
                    industryId: row.industryId,
                    type: 'see',
                  },
                }),
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
      const res = await getIndustryList({ ...params })
      this.data = res.body
    },
    toAdd() {
      this.$router.push({
        name: 'TradeUpdate',
        params: {
          type: 'add',
        },
      })
    },
  },
}
</script>

<template>
  <div class="w-full h-full p-3">
    <div class="h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1675734854183">
        <template slot="actions:addConfig">
          <ElButton v-if="userData.isMenagerRole === 1" size="small" type="primary" icon="el-icon-plus" @click="toAdd">
            新增
          </ElButton>
        </template>
      </TablePage>
    </div>
  </div>
</template>

<style scoped>

</style>
