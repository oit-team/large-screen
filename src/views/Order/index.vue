<template>
  <div id="customerList" class="pageCommonStyle">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="购物订单" name="ShoppingOrder">
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
