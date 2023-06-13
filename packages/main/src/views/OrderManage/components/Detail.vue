<script>
import { getServiceOrderDetail } from '@/api/serviceManage'
export default {
  name: 'OrderDetail',
  data: () => ({
    isLoading: false,
    id: '',
    serviceOrderInfo: {},
  }),
  created() {
    this.id = this.$route.query?.id
  },
  mounted() {
    this.getDetailInfo()
  },
  methods: {
    async getDetailInfo() {
      this.isLoading = true
      const res = await getServiceOrderDetail({
        id: this.id,
      }).finally(() => this.isLoading = false)
      this.serviceOrderInfo = res.body.serviceOrderInfo
    },
  },
}
</script>

<template>
  <div class="p-2 h-full">
    <PageHeader content="查看详情" />
    <ElDivider />
    <div v-loading="isLoading">
      <ElDescriptions border>
        <ElDescriptionsItem label="服务名称">
          {{ serviceOrderInfo.serviceName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="订单状态">
          {{ serviceOrderInfo.statusName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ serviceOrderInfo.remarks }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="用户名">
          {{ serviceOrderInfo.userName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">
          {{ serviceOrderInfo.telephone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="下单时间">
          {{ serviceOrderInfo.createTime }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预定时间">
          {{ serviceOrderInfo.appointmentTime }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="核销人员">
          {{ serviceOrderInfo.verificationUserName || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="图片">
          <ElImage
            v-if="serviceOrderInfo.resourceUrl"
            style="width: 50px; height: 50px"
            :src="serviceOrderInfo.resourceUrl"
            :preview-src-list="[serviceOrderInfo.resourceUrl]"
          />
          <div v-else class="text-gray-500">
            暂无
          </div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
