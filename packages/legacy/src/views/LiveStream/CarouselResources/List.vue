<script>
import TablePage from '@/components/classify/TablePage/TablePage'
import { getAdvertsRes } from '@/api/liveStream'
import PreviewFile from '@/components/classify/PreviewFile'
import FILE_TYPE from '@/enums/FILE_TYPE'

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
        ],
        table: {
          data: this.data.result,
        },
        pager: {
          total: this.data.totalCount,
        },
      }
    },
  },

  methods: {
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
  },
}
</script>

<template>
  <PageContainer>
    <TablePage v-bind="tablePageOption" auto @row-click="previewFile">
      <template slot="content:resUrl" slot-scope="{ row }">
        <template v-if="row.resType === FILE_TYPE.IMAGE">
          <ElImage class="file-res" :src="row.resUrl" fit="cover" />
        </template>
        <template v-if="row.resType === FILE_TYPE.VIDEO">
          <ElImage class="file-res" :src="row.videoImg" fit="cover" />
        </template>
      </template>
    </TablePage>
  </PageContainer>
</template>

<style scoped lang="less">
.file-res {
  height: 60px;
  width: 60px;
}
</style>
