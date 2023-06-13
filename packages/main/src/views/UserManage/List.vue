<script>
import { convertImageSize } from '@/utils/helper'
import { getWeChatUserInfoList } from '@/api/userManage'

export default {
  name: 'UserManageList',
  data: () => ({
    data: {},
  }),
  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.resultList,
        },
        pager: {
          total: this.data.pageTotal,
        },
      }
    },
  },
  methods: {
    convertImageSize,
    async loadData(params) {
      const res = await getWeChatUserInfoList({
        ...params,
      })
      this.data = res.body
    },
  },
}
</script>

<template>
  <div class="h-full p-2">
    <TablePage ref="table" v-bind="tablePageOption" field-key="1686635645706" auto>
      <template #column:headPortrait>
        <ElTableColumn
          prop="headPortrait"
          label="图片"
          align="center"
          width="120"
        >
          <div />
          <template slot-scope="scope">
            <ElImage v-if="scope.row.headPortrait" :src="convertImageSize(scope.row.headPortrait)" class="block w-70px h-70px mx-auto" fit="cover" />
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
