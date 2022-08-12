<template>
  <div class="goodsDrawer">
    <el-drawer
      :title="title"
      :append-to-body="true"
      :modal-append-to-body="true"
      :before-close="handleClose"
      :visible="goodsDrawer"
      :direction="direction"
    >
      <el-form ref="historyruleForm" style="width:80%;margin: 0 auto" :model="historyRuleForm" :rules="historyRules">
        <el-form-item label="被复制场" prop="copyConferenceCode">
          <el-select v-model="historyRuleForm.copyConferenceCode" placeholder="请选择被复制的场次" @change="HistoryChange">
            <el-option
              v-for="item in options"
              :key="item.conferenceHallCode"
              :label="item.conferenceHallName"
              :value="item.conferenceHallCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场次时间" prop="copyTime">
          <el-radio-group v-if="TimeList.length > 0" v-model="historyRuleForm.copyTime" class="TimeListBox">
            <el-radio v-for="(item, index) in TimeList" :key="index" :label="item">
              {{ item }}
            </el-radio>
          </el-radio-group>
          <div v-else style="width: 100%; display: inline-block;text-align: center;color:#BFBFBF">
            暂无数据
          </div>
        </el-form-item>
      </el-form>
      <div style="width: 80%;margin:0 auto;">
        <el-button style="width:100%" type="primary" @click="submit">
          提交
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'CopyHistory',
  data() {
    return {
      title: '复制场次',
      currData: '',
      options: [],
      TimeList: [],
      currGoods: '',
      radio: '',
      goodsDrawer: false,
      direction: 'rtl',
      historyRuleForm: {
        copyConferenceCode: '',
        copyTime: '',
      },
      historyRules: {
        copyConferenceCode: [{ required: true, message: '请选择被复制的场次' }],
        copyTime: [{ required: true, message: '请选择场次时间' }],
        // roomCode: [{required: true, message: '请输入房间编号'},],
        // integralLimit: [{required: true, type:'number', message: '请输入水滴限制(数字)'},],
        // byLimit: [{required: true, type:'number', message: '请输入能量值限制(数字)'},],
      },
    }
  },
  created() {
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    handleClose() {
      this.$refs.historyruleForm.resetFields()
      this.TimeList = []
      this.goodsDrawer = false
    },
    HistoryChange() {
      this.loadTime()
      this.historyRuleForm.copyTime = ''
    },
    handleOpen(data, currData) {
      this.goodsDrawer = true
      this.options = data
      this.currData = currData
      this.title = `复制场次--${currData.conferenceHallName}`
    },
    loadTime() {
      const con = {
        conferenceCode: this.historyRuleForm.copyConferenceCode,
      }
      const _this = this
      const jsonParam = this.GLOBAL.paramJson(con)
      this.$axios.post(this.Api.getAuctionHistoryTime, jsonParam).then((res) => {
        if (res.data.head.status == 0) {
          _this.TimeList = res.data.body.resultList
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {})
    },
    submit() {
      this.$refs.historyruleForm.validate((valid) => {
        if (valid) {
          const _this = this
          const con = this.historyRuleForm
          con.conferenceCode = this.currData.conferenceHallCode
          const jsonParam = this.GLOBAL.paramJson(con)
          this.$axios.post(this.Api.addAuctionHistory, jsonParam).then((res) => {
            if (res.data.head.status == 0) {
              _this.$message({
                type: 'success',
                message: res.data.head.msg,
              })
              _this.handleClose()
              _this.$emit('CopyHistory')
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          }).catch((err) => {})
        }
      })
    },
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
  .TimeListBox{
    width: 100%;
    .el-radio{
      margin-bottom: 10px;
    }
  }
</style>
