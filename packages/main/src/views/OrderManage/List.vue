<script>
import { getServiceOrderList } from '@/api/serviceManage'
import { convertImageSize } from '@/utils/helper'
export default {
  name: 'OrderManageList',
  data: () => ({
    data: {}, // 列表数据
  }),
  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.serviceOrderInfoList,
          actions: {
            width: 100,
            buttons: [
              {
                tip: '详情',
                type: 'success',
                icon: 'el-icon-view',
                click: ({ row }) => this.$router.push({
                  name: 'OrderDetail',
                  query: { id: row.id },
                }),
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
      const res = await getServiceOrderList({
        ...params,
      })
      this.data = res.body
    },
  },
}
</script>

<template>
  <div class="h-full p-2">
    <TablePage v-bind="tablePageOption" ref="table" field-key="1686626533689" auto>
      <template #column:resourceUrl>
        <ElTableColumn
          prop="resourceUrl"
          label="图片"
          align="center"
          width="120"
        >
          <div />
          <template slot-scope="scope">
            <ElImage v-if="scope.row.resourceUrl" :src="convertImageSize(scope.row.resourceUrl)" class="block w-70px h-70px mx-auto" fit="cover" />
            <div v-else class="text-gray-300">
              暂无
            </div>
          </template>
        </ElTableColumn>
      </template>
    </TablePage>
  </div>
</template>

<style lang='scss' scoped>

</style>
