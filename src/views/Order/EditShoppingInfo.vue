<template>
  <div id="addRole" class="pageCommonStyle" >
    <el-page-header @back="goBack" :content="title"></el-page-header>
    <el-divider></el-divider>
    <div class="content">
      <el-descriptions>
        <el-descriptions-item label="用户名称">{{ruleForm.userName}}</el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{ruleForm.nickName}}</el-descriptions-item>
        <el-descriptions-item label="订单编号">{{ruleForm.orderCode}}</el-descriptions-item>
        <el-descriptions-item label="商品数量">{{ruleForm.goodsNum}}</el-descriptions-item>
        <el-descriptions-item label="订单金额">{{ruleForm.totalAmount}}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ruleForm.createTime}}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ruleForm.paymentTime}}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <span v-if="ruleForm.state == 0">所有</span>
          <span v-if="ruleForm.state == 1">待付款</span>
          <span v-if="ruleForm.state == 2">待收货</span>
          <span v-if="ruleForm.state == 3">已完成</span>
        </el-descriptions-item>
        
      </el-descriptions>
      <div class="InfoContent">
  <!--      <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="(item,index) in ruleForm.orderDetailed" :title="item.goodsName" :name="index">
            <div class="itemInfo">
              <div class="imgBox">
                <div class="left">
                  <el-image
                    v-if="item.resUrl"
                    style="width: 100px; height: 100px"
                    fit="scale-down"
                    :src="item.resUrl"></el-image>
                  <span v-else='item.resUrl' style="color:#BFBFBF">暂无图片</span>
                </div>
                <div class="right">
                  <span>{{item.goodsName}}</span>
                  <span>{{item.goodsCode}}</span>
                </div>
              </div>
              <div>
                <span>商品数量:{{item.goodsNum}}</span>
              </div>
              <div>
                <span>付款金额:{{item.paymentNum}}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse> -->
        <div class="itemBox" v-for="(item,index) in ruleForm.orderDetailed">
          <!-- <div class="itemTitle">{{item.goodsName}}</div> -->
          <div class="itemInfo">
            <div class="imgBox">
              <div class="left">
                <el-image
                  v-if="item.resUrl"
                  style="width: 100px; height: 100px"
                  fit="scale-down"
                  :src="item.resUrl"></el-image>
                <span v-else='item.resUrl' style="color:#BFBFBF">暂无图片</span>
              </div>
              <div class="right">
                <span>{{item.goodsName}}</span>
                <span>{{item.goodsCode}}</span>
              </div>
            </div>
            <div>
              <span>商品数量:{{item.goodsNum}}</span>
            </div>
            <div>
              <span>付款金额:{{item.paymentNum}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from '../../assets/js/CryptoJS'
export default {
  name: 'addUser',
  props: {},
  data() {
    return {
      stateOptions: [
        {
          value: 0,
          label: '所有'
        },{
          value: 1,
          label: '待付款'
        },{
          value: 2,
          label: '待收货'
        },{
          value: 3,
          label: '已完成'
        },
      ],
      title: '购物订单详情',
      UserId: '',
      ruleForm: {
        userName: '',
        nickName: '',
        orderCode: '',
        paymentTime: '',
        createTime: '',
        state: '',
        orderDetailed: [],
      },
      rules: {
      },
    }
  },
  created() {
    if (this.$route.query.item) {
      // this.ruleForm = this.$route.query.item
      this.getAuctionInfo(this.$route.query.item)
    }
  },
  mounted() {},
  activated() {},
  watch: {},
  methods: {
    handleChange(val) {
    },
    isUnique() {
      return false
    },
    goBack() {
      this.$router.go(-1)
    },
    getAuctionInfo(data) {
      const con = {
        orderCode: data.orderCode,
      }
      const _this = this
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.getAllShoppingOrderDetailed, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.ruleForm = res.data.body
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-collapse-item__header{
    padding-left:10px;
    color: #303133;
    font-size: 16px;
    font-weight: 700;
  }
  .content{
    width:70%;
    min-width:800px;
  }
  .InfoContent{
    background:#efefef;
    padding:10px;
    .itemBox{
      span{
        font-size:14px;
      }
      margin-bottom:10px;
      .itemTitle{
        color: #303133;
        font-size: 16px;
        font-weight: 700;
        margin-bottom:10px;
        margin-left:10px;
      }
    }
    .itemBox:last-child{
      margin-bottom:0px;
    }
  }
  .itemInfo{
    background:#fff;
    padding:10px;
    display: flex;
    justify-content: space-between;
    >div{
      float:left;
      display: flex;
      align-items: center;
      height: 100px;
      width:33%;
      text-align: left;
    }
    .imgBox{
      .left{
        float: left;
        margin-right:10px;
      }
      .right{
        float: right;
        span{
          display: block;
          text-align: center;
        }
      }
    }
  }
</style>
