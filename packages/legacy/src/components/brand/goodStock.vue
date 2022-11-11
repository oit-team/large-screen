<script>
export default {
  name: 'GoodStock',
  components: {},
  data() {
    return {
      searchKey: '',
      tableData: [],
      count: 0, // 相应商品总库存
      shopCount: 0,
      sizeList: [],
    }
  },
  created() {
    // console.log('query',this.$route.query.item);
  },
  mounted() {
    this.getGoodStockList()
  },
  methods: {
    goBack() {
      this.$router.go(-1) // 查看直接返回
    },
    getGoodStockList() {
      const _this = this
      const con = {
        pageNum: 1,
        pageSize: 100,
        brandId: sessionStorage.brandId,
        styleNo: this.$route.query.item.styleNo,
        // styleNo:'XNGES4571AC',
        shopName: _this.searchKey,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.data_manager_server}/dataStockInfo/getStockInfo`, jsonParam).then((res) => {
        if (res.data.head.status == 0) {
          // console.log("获取商品库存数",res.data.body);
          _this.count = res.data.body.count
          _this.shopCount = res.data.body.shopCount
          _this.tableData = res.data.body.resultList
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    clickSearch() {
      this.getGoodStockList()
    },
    clearSearch() {
      this.searchKey = ''
      this.getGoodStockList()
    },

  },
}
</script>

<template>
  <div id="goodStock" class="pageCommonStyle">
    <el-page-header content="查看库存分布" @back="goBack" />
    <el-divider />
    <div class="operateBox">
      <el-input
        v-model="searchKey"
        type="text"
        placeholder="请输入搜索关键词"
        @keyup.enter.native="clickSearch()"
      />
      <el-button size="small" type="primary" @click="clickSearch">
        搜索
      </el-button>
      <el-button size="small" type="primary" @click="clearSearch">
        清空搜索
      </el-button>
      <span class="shopCount">店铺总数：{{ shopCount }}</span>
      <span class="count">商品总库存：{{ count }}</span>
    </div>
    <el-divider />
    <div class="stockContainerBox">
      <div v-if="tableData && tableData.length > 0" class="stockContainer">
        <div v-for="(item, index) in tableData" :key="index" class="itemBox">
          <div class="baseBox">
            <p class="shopName">
              {{ item.shopName }}
            </p>
            <p class="shopCount">
              {{ item.amountTo }}
            </p>
          </div>
          <div class="maskBg">
            <span v-for="(sizeCountItem, index) in item.quantityCount" :key="index" class="item">{{ sizeCountItem }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <p style="text-align:center;line-height:200px;">
          暂无数据
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
@deep:~'>>>';
#goodStock{
  min-height: 82vh;
  text-align: left;
  .operateBox{
    display: flex;
    @{deep} .el-input{
      width:240px;
    }
    span{
      // margin-left:auto;
      line-height: 35px;
    }
    .shopCount{
      margin-left:auto;
      margin-right:20px;
    }

  }
  .stockContainer{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .itemBox{
      width:160px;
      height:120px;
      // line-height: 32px;
      text-align: center;
      border:1px solid #ccc;
      margin:0px 12px 12px 0;
      border-radius: 12px;
      position: relative;
      .shopName{
        line-height: 50px;
      }
      .shopCount{
        font-size: 32px;
      }
      .maskBg{
        position: absolute;
        top:40px;
        left:0;
        width:160px;
        height: 80px;
        background: rgba(0, 0, 0,0.7);
        opacity: 0;
        color:#fff;
        border-radius:0px 0px 12px 12px;
        display: flex;
        flex-wrap: wrap;
        padding:10px;
        box-sizing: border-box;
        .item{
          width:33%;
          display: inline-block;
          text-align: center;
          font-size: 14px;
          // padding:0px 0px;
          // line-height: 60px;
        }
      }
    }
    .itemBox:hover .maskBg{
      opacity: 1;
    }
  }

}
</style>
