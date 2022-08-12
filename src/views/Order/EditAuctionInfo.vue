<template>
  <div id="addRole" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack"></el-page-header>
    <el-divider></el-divider>
    <div class="content">
      <el-descriptions>
        <el-descriptions-item label="场次名称">
          {{ ruleForm.conferenceHallName }}
        </el-descriptions-item>
        <el-descriptions-item label="分区名称">
          {{ ruleForm.roomName }}
        </el-descriptions-item>
        <!-- <el-descriptions-item label="支付能量值">{{ruleForm.paymentNum}}</el-descriptions-item> -->
        <el-descriptions-item label="扣除水滴">
          {{ ruleForm.deductPoints }}
        </el-descriptions-item>
        <el-descriptions-item label="个人收益">
          {{ ruleForm.personalIncome }}
        </el-descriptions-item>
        <el-descriptions-item label="平台分润">
          {{ ruleForm.platformRevenum }}
        </el-descriptions-item>
        <el-descriptions-item label="应付定金">
          {{ ruleForm.deposit }}
        </el-descriptions-item>
        <el-descriptions-item label="竞拍时间">
          {{ ruleForm.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="支付时间">
          {{ ruleForm.paymentTime }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="InfoContent">
        <div class="itemBox">
          <!-- <div class="itemTitle">{{item.goodsName}}</div> -->
          <div class="itemInfo">
            <div class="imgBox">
              <div class="left">
                <el-image
                  v-if="ruleForm.resUrl"
                  style="width: 100px; height: 100px"
                  fit="scale-down"
                  :src="ruleForm.resUrl"
                ></el-image>
                <span v-else style="color:#BFBFBF">暂无图片</span>
              </div>
              <div class="right">
                <span>{{ ruleForm.goodsName }}</span>
                <span>{{ ruleForm.goodsCode }}</span>
              </div>
            </div>
            <div>
              <span>商品数量:{{ ruleForm.goodsNum }}</span>
            </div>
            <div>
              <span>商品价格:{{ ruleForm.goodsPrice }}</span>
            </div>
          </div>
          <!--          <div class="itemFoot">
            <span>支付能量值:{{ruleForm.paymentNum}}</span>
            <span>支付水滴:{{ruleForm.deductPoints}}</span>
            <span>个人分润:{{ruleForm.deductPoints}}</span>
            <span>平台分润:{{ruleForm.personalIncome}}</span>
            <span>应付定金:{{ruleForm.deposit}}</span>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddUser',
  props: {},
  data() {
    return {
      stateOptions: [
        {
          value: 0,
          label: '未付款',
        }, {
          value: 1,
          label: '未挂拍',
        }, {
          value: 2,
          label: '取消挂拍',
        }, {
          value: 3,
          label: '已完成',
        },
      ],
      activeNames: [0],
      title: '竞拍订单详情',
      UserId: '',
      ruleForm: {
        userName: '',
        bys: '',
        integral: '',
        recommender: '',
      },
      rules: {
      },
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      // this.ruleForm = this.$route.query.item
      this.getAuctionInfo(this.$route.query.item)
    }
  },
  mounted() {},
  activated() {},
  methods: {
    handleChange() {

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
      _this.$axios.post(_this.Api.getAllAuctionDetailed, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.ruleForm = res.data.body
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {})
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
    .itemBox:not(:last-child){
      margin-bottom:10px;
      span{
        font-size:14px;
      }
      .itemTitle{
        color: #303133;
        font-size: 16px;
        font-weight: 700;
        margin-bottom:10px;
        margin-left:10px;
      }
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
  .itemFoot{
    display: flex;
    justify-content: space-between;
    padding:10px;
    background:#fff;
    border-top:1px solid #DCDFE6;
  }
</style>
