<script>
import { getProcurementOrderById } from '@/api/order'
import { convertImageSize } from '@/utils/helper'

export default {
  name: 'Detail',
  data: () => ({
    orderId: '',
    formData: {}, // 订单信息
    orderGoodsList: [], // 采购商品
  }),
  created() {
  },
  mounted() {
    if (this.$route.query) {
      this.orderId = this.$route.query.orderId
      this.getProcurementOrderById(this.orderId)
    }
  },

  methods: {
    convertImageSize,
    goBack() {
      this.$router.go(-1)
    },
    async getProcurementOrderById(orderId) {
      const res = await getProcurementOrderById({
        orderId,
      })
      this.formData = res.body
      this.orderGoodsList = res.body.styleList
    },
  },
}
</script>

<template>
  <div id="OrderDetail" class="h-full flex overflow-hidden flex-col page-container" back-top>
    <ElPageHeader content="订单详情" class=" text-sm" @back="goBack" />
    <ElDivider />
    <div class="flex-1 flex flex-col justify-center">
      <ElDescriptions :column="4" title="基本信息">
        <ElDescriptionsItem label="编号">
          {{ formData.orderNo || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="下单人">
          {{ formData.userName || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="下单时间">
          {{ formData.createTime || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="所属店铺">
          {{ formData.shopName || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          <ElTag size="small">
            {{ formData.stateName || '暂无' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="总金额">
          {{ formData.orderMoney || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="总数量">
          {{ formData.procurementNum || '暂无' }}
        </ElDescriptionsItem>
      </ElDescriptions>
      <div class="mt-8 flex flex-1 flex-col overflow-hidden">
        <div class="text-base font-semibold mb-4">
          商品信息
        </div>
        <ElCard class="flex-1 flex flex-col box-card">
          <ElTable
            :data="orderGoodsList"
            height="100%"
            style="width: 100%"
          >
            <ElTableColumn
              label="图片"
              prop="imgUrl"
            >
              <template slot-scope="scope">
                <ElImage
                  style="width: 60px; height: 60px"
                  :src="convertImageSize(scope.row.imgUrl)"
                  fit="contain"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="名称"
              prop="vouchersName"
            />
            <ElTableColumn
              label="数量"
              prop="jackpotNum"
            />
            <ElTableColumn
              label="采购价格"
              prop="jackpotBuyPrice"
            />
            <ElTableColumn
              label="有效期类型"
              prop="effectiveType"
            />
            <ElTableColumn
              label="有效天数"
              prop="effectiveDay"
            />
            <ElTableColumn
              label="生效时间"
              prop="effectiveStart"
              show-overflow-tooltip
            />
            <ElTableColumn
              label="失效时间"
              prop="effectiveEnd"
              show-overflow-tooltip
            />
          </ElTable>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
::v-deep{
  .el-card__body{
    flex: 1;
  }
}
</style>
