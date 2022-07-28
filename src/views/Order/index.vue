<template>
  <div id="customerList" class="pageCommonStyle" style="height:100%">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="height:100%;display:flex;flex-direction:column">
      <el-tab-pane label="购物订单" name="ShoppingOrder" id="shoppingOrder" style="height:100%">
        <vc-shoppingOrder></vc-shoppingOrder>
      </el-tab-pane>
      <el-tab-pane label="竞拍订单" name="AuctionOrder">
        <vc-auctionOrder></vc-auctionOrder>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VcSearch from '../../components/basic/CommonSearch'
import VcShoppingOrder from './ShoppingOrder'
import VcAuctionOrder from './AuctionOrder'

export default {
  components: {
    VcSearch,
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
  created() {
  },
  computed:{
  },
  mounted() {
  },
  activated() {
  },
  watch: {},
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