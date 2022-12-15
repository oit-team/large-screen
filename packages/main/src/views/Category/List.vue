<script>
import { deleteProductType, getProductTypeList } from '@/api/category'
import { convertImageSize } from '@/utils/helper'

export default {
  name: 'CategoryList',
  data: () => ({
    data: {},
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: '新增品类',
            type: 'primary',
            to: '/category/update',
          },
        ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '编辑',
                type: 'success',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'UpdateCategory',
                  query: { typeId: row.typeId },
                }),
                // disabled: ({ row }) => row.jackpotState !== PUTAWAY_STATE.SOLDOUT,
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteProductType,
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
      const res = await getProductTypeList({
        ...params,
      })
      this.data = res.body
    },

    // convertImageSize,

    async deleteProductType({ row }) {
      await this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
      await deleteProductType({
        typeId: row.typeId,
      })
      this.$message.success('删除成功！')
      this.$refs.table.loadData()
    },
  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1671013223008">
        <template #content:typeImg="{ row }">
          <ElImage v-if="row.typeImg" :src="row.typeImg" class="file-res" fit="cover" />
        </template>
      </TablePage>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.file-res {
  height: 80px;
  width: 80px;
}
</style>
