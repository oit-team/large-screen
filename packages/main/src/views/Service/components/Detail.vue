<script>
import { getServiceInfoDetail } from '@/api/serviceManage'
export default {
  name: 'ServiceDetail',
  data: () => ({
    infoLoading: false,
    isCheck: false,
    id: '',
    info: {},
    url: '',
    checkedImgList: [],
  }),
  created() {
    const params = this.$route?.query
    if (params) {
      this.isCheck = params?.isCheck
      this.id = params?.id
      this.getServiceInfoDetail()
    }
  },
  methods: {
    async getServiceInfoDetail() {
      this.infoLoading = true
      const res = await getServiceInfoDetail({
        id: this.id,
      }).finally(() => this.infoLoading = false)
      this.info = res.body.serviceInfo
      this.checkedImgList = res.body.serviceInfo.resourceList.map(item => item.resourceUrl)
      this.url = this.checkedImgList[0]
    },
  },
}
</script>

<template>
  <div class="p-2 h-full">
    <PageHeader content="查看详情" />
    <ElDivider />
    <ElDescriptions v-loading="infoLoading" class="margin-top" :column="3" border>
      <ElDescriptionsItem label="服务名称">
        {{ info.name }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="服务内容">
        {{ info.content }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="价格">
        {{ info.price }}
      </ElDescriptionsItem>
      <!-- <ElDescriptionsItem label="上架状态">
        <ElTag size="small">
          可用
        </ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="服务状态">
        <ElTag size="small">
          可用
        </ElTag>
      </ElDescriptionsItem> -->
      <ElDescriptionsItem label="备注">
        {{ info.remarks }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="图片">
        <div v-if="checkedImgList.length === 0">
          暂无
        </div>
        <div v-else>
          <ElImage
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="checkedImgList"
          />
        </div>
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<style lang='scss' scoped>

</style>
