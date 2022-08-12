<template>
  <div class="menuDrawer">
    <el-drawer
      title="专场信息"
      :append-to-body="true"
      :modal-append-to-body="true"
      :before-close="handleClose"
      :visible="menuDrawer"
      :direction="direction"
    >
      <el-form ref="menuruleForm" style="width:80%;margin: 0 auto" :model="menuRuleForm" :rules="menuRules">
        <el-form-item label="场次名称" prop="Name">
          <el-input
            v-model.trim="menuRuleForm.Name"
            clearable
            placeholder="请输入场次名称"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="场次时间" required prop="Time">
          <el-time-picker
            v-model="menuRuleForm.Time"
            style="width: 100%;"
            is-range
            format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="请选择时间范围"
          >
          </el-time-picker>
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
  name: 'MenuDrawer',
  data() {
    return {
      isAdd: false,
      menuDrawer: false,
      direction: 'rtl',
      auctionData: {},
      menuRuleForm: {
        Name: '',
        Time: '',
      },
      menuRules: {
        Name: [{ required: true, message: '请输入场次名称' }],
        Time: [{ required: true, message: '请输入场次名称' }],
      },
    }
  },
  created() {
  },
  mounted() {
    const _this = this
  },
  methods: {
    handleClose() {
      this.$refs.menuruleForm.resetFields()
      this.menuRuleForm.Time = ''
      this.menuRuleForm.Name = ''
      this.menuDrawer = false
    },
    handleOpen(data) {
      this.menuDrawer = true
      if (data) {
        this.isAdd = false
        this.auctionData = data
        this.menuRuleForm.Name = data.conferenceHallName
        this.menuRuleForm.Id = data.id
        this.menuRuleForm.Time = this.setTime(data.startTime, data.endTime)
      } else {
        this.isAdd = true
      }
    },
    setTime(startTime, endTime) {
      return [new Date(startTime), new Date(endTime)]
    },
    submit() {
      const _this = this
      _this.$refs.menuruleForm.validate((valid) => {
        if (valid) {
          let postApi = ''
          const con = {
            conferenceHallName: this.menuRuleForm.Name,
            startTime: _this.$moment(this.menuRuleForm.Time[0]).format('HH:mm:00'),
            endTime: _this.$moment(this.menuRuleForm.Time[1]).format('HH:mm:00'),
          }
          if (this.isAdd) {
            postApi = this.Api.addConferenceHall
          } else {
            con.id = this.menuRuleForm.Id
            postApi = this.Api.updateConferenceHallById
          }
          const jsonParam = _this.GLOBAL.paramJson(con)
          this.$axios.post(postApi, jsonParam).then((res) => {
            if (res.data.head.status === 0) {
              if (this.isAdd) {
                this.$emit('reloadManage', 'menuDrawer')
              } else {
                this.$emit('reloadManage', 'menuDrawer')
              }
              _this.handleClose()
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'error',
              })
            }
          }).catch((err) => {
            console.log(err)
          })
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
</style>
