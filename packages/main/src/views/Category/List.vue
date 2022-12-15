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
        <template #content:typeParentName="{ row }">
          <div v-if="row.typeParentName">
            {{ row.typeParentName }}
          </div>
          <div v-else class="text-gray-300">
            暂无
          </div>
        </template>
        <template #column:typeImg>
          <ElTableColumn
            prop="typeImg"
            label="图片"
            align="center"
            width="140"
          >
            <!-- table单独列拿出来处理 需要在scope前面加一个数据 空div或者123 -->
            <div />
            <template slot-scope="scope">
              <ElImage v-if="scope.row.typeImg" :src="scope.row.typeImg" class="block w-70px h-70px mx-auto" fit="cover" />
              <div v-else class="text-gray-300">
                暂无
              </div>
            </template>
          </ElTableColumn>
        </template>
      </TablePage>
    </div>
  </div>
</template>
