<script>
import TablePage from '@/components/classify/TablePage/TablePage'
import { batchDeleteAdvertsRes, getAdvertsRes } from '@/api/liveStream'
import PreviewFile from '@/components/classify/PreviewFile'
import FILE_TYPE from '@/enums/FILE_TYPE'
import { convertImageSize } from '@/utils/helper'

export default {
  name: 'CarouselResourcesList',

  components: { TablePage },

  data: () => ({
    FILE_TYPE,
    data: {},
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: '上传文件',
            type: 'primary',
            to: 'CarouselResourcesUpload',
          },
          {
            name: '批量删除',
            type: 'primary',
            click: this.selectedDelete,
          },
        ],
        table: {
          data: this.data.result,
          selection: true,
        },
        pager: {
          total: this.data.totalCount,
        },
      }
    },
  },

  methods: {
    convertImageSize,
    loadData(params) {
      return getAdvertsRes(params).then((res) => {
        this.data = res.body
      })
    },
    previewFile(file) {
      PreviewFile([{
        name: file.resName,
        url: file.resUrl,
        type: file.resType,
      }])
    },
    // 批量删除
    async selectedDelete() {
      if (this.$refs.table.selected.length === 0) {
        this.$message({
          message: '请至少勾选其中一项数据！',
          type: 'warning',
        })
        return
      }
      const idList = this.$refs.table.selected.map(item => item.id)
      await this.$confirm('确定要删除勾选数据？', '提示', { type: 'warning' })
      await batchDeleteAdvertsRes({
        idList,
      })
      this.$message.success('删除成功！')
      this.$refs.table.loadData()
    },
  },
}
</script>

<template>
  <page-container>
    <table-page ref="table" v-bind="tablePageOption" auto @row-click="previewFile">
      <template #column:resUrl>
        <el-table-column
          prop="resUrl"
          label="资源"
          align="center"
          width="140"
        >
          <div />
          <template slot-scope="scope">
            <el-image v-if="scope.row.resType === FILE_TYPE.IMAGE" :src="convertImageSize(scope.row.resUrl)" class="block imgSize w-70px h-70px mx-auto" fit="cover" />
            <el-image v-else-if="scope.row.resType === FILE_TYPE.VIDEO" :src="scope.row.videoImg" class="block imgSize w-70px h-70px mx-auto" fit="cover" />
            <div v-else class="text-gray-300">
              暂无
            </div>
          </template>
        </el-table-column>
      </template>
    </table-page>
  </page-container>
</template>

<style scoped lang="less">
.imgSize{
  width: 70px;
  height: 70px;
}
</style>
