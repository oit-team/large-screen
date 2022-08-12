<template>
  <div id="customerList" class="pageCommonStyle" style="height:100%">
    <el-tabs v-model="activeName" style="height:100%;display:flex;flex-direction:column" @tab-click="handleClick">
      <el-tab-pane id="shoppingOrder" label="购物订单" name="ShoppingOrder" style="height:100%">
        <VcShoppingOrder></VcShoppingOrder>
      </el-tab-pane>
      <el-tab-pane label="竞拍订单" name="AuctionOrder" style="height:100%">
        <VcAuctionOrder></VcAuctionOrder>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VcShoppingOrder from './ShoppingOrder'
import VcAuctionOrder from './AuctionOrder'

export default {
  components: {
    VcShoppingOrder,
    VcAuctionOrder,
  },
  props: {
  },
  data() {
    return {
      activeName: 'ShoppingOrder',
    }
  },
  computed: {
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    handleClick(val) {
    },
  },
}
</script>

<style lang="scss" scoped>
.el-tabs::v-deep .el-tabs__content{
  flex: 1;
}
#shoppingOrder{
  height: 100%;
}
</style>
