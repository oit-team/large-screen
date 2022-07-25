<template>
  <div class="goodsDrawer">
    <el-drawer
      title="选择资源"
      size="50%"
      :append-to-body="true"
      :modal-append-to-body="true"
      :before-close="handleClose"
      :visible="goodsDrawer"
      :direction="direction">
        <div class="operateBtn">
          <el-button size="small" @click='CopyPrice'  icon="el-icon-plus" type="primary">复制价格</el-button>
        </div>
        <el-divider></el-divider>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中..."
          :data="tableData"
          :row-key="getRowKey"
          border
          ref="elTable"
          style="width: 100%">
          </el-table-column>
          <el-table-column label="选择" align="center" width="65">
            <template scope="scope">
              <el-radio v-model="radio"
              :label="scope.row.goodsCode"
              @change.native="getCurrentRow(scope.row)">
              {{""}}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            sortable
            v-for="(item,index) in headTitArrNew"
            :key="index"
            :min-width="GLOBAL.minCellWidth"
            :prop="item.fieldKey"
            :label="item.fieldName">
            <template slot-scope="scope">
              <span v-if='item.fieldKey=="status"'>
                <span style="color: #FF0000;" v-if="scope.row.status === 0">未上架</span>
                <span style="color: #42B983;" v-else>已上架</span>
              </span>
              <span class="imgBox" v-else-if='item.fieldKey=="resUrl"'>
                <img style="display:block;margin:0 auto;"  v-if='scope.row.mainImage&&scope.row.mainImage.length>0&&scope.row.mainImage[0].resUrl' :src="scope.row.mainImage[0].resUrl" alt="">
                <img style="display:block;margin:0 auto;"  v-else-if='scope.row.resUrl' :src="scope.row.resUrl" alt="">
                <span v-else>无</span>
              </span>
              <div v-else>
                <span>{{scope.row[(item.fieldKey)]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
    </el-drawer>
  </div>
</template>

<script>
import VcSearch from '../../basic/CommonSearch'

export default {
  name: 'copyPrice',
  components: {
    VcSearch,
  },
  data() {
    return {
      currGoods:'',
      radio:'',
      goodsDrawer:false,
      direction: 'rtl',
      loading: true,
      tableData: [],
      headTitArr: [],
    }
  },
  computed:{
    headTitArrNew() {
      return this.headTitArr.filter(item => !item.noTableShow)
    },
  },
  created() {
    const headTitArr = '[{"fieldName":"商品名称","fieldType":"文本","fieldKey":"goodsName","dbField":"GOODS_NAME"},{"fieldName":"商品图片","fieldType":"图片","fieldKey":"resUrl","dbField":"RES_URL"}]'
    this.headTitArr = JSON.parse(headTitArr)
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
  },
  mounted() {
  },
  activated() {
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
  },
  methods: {
    getRowKey(row) {
      return row.goodsId
    },
    handleClose() {
      this.radio = ''
      this.goodsDrawer = false
    },
    loadManage() {

    },
    changeLoad(val) {
      this.loading = val
    },
    handleOpen(res,data) {
      this.goodsDrawer = true
      const goodsList = data.filter(item => item.goodsCode != res.goodsCode&&item.price instanceof Array)
      this.tableData = goodsList;
      this.loading = false;
      this.currGoods = res
    },
    CopyPrice(){
      const radioGoods = this.tableData.find(item => item.goodsCode == this.radio)
      this.currGoods.price = radioGoods.price
      this.currGoods.startingPrice = radioGoods.startingPrice
      this.currGoods.transactionPrice = radioGoods.transactionPrice
      this.currGoods.premiumRatio = radioGoods.premiumRatio
      this.currGoods.integralRatio = radioGoods.integralRatio
      this.currGoods.depositRatio = radioGoods.depositRatio
      this.$emit('CopyGoodsPrice', this.currGoods)
      this.handleClose()
    },
    getCurrentRow(row) {
    }
  },
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-range-separator{
    width: 8%;
  }
  ::v-deep .checkBox{
    i{
      color:#409EFF;
      cursor: pointer;
      font-size: 26px;
    }
  }
  ::v-deep .el-drawer{
    padding:0 10px;
  }
  .imgBox img{
    max-width:100%;
    height:auto;
    max-height:50px;
  }
</style>
