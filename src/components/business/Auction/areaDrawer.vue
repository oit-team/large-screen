<template>
  <div class="areaDrawer">
    <el-drawer
      title="房间信息"
      :append-to-body="true"
      :modal-append-to-body="true"
      :before-close="handleClose"
      :visible="areaDrawer"
      :direction="direction">
      <el-form style="width:80%;margin: 0 auto" :model="areaRuleForm" :rules="areaRules" ref="arearuleForm">
        <el-form-item label="房间名称" prop="roomName">
          <el-input
            v-model.trim="areaRuleForm.roomName"
            clearable
            placeholder="请输入房间名称">
          </el-input>
        </el-form-item>
<!--        <el-form-item label="水滴限制" prop="integralLimit">
          <el-input
            v-model.number="areaRuleForm.integralLimit"
            clearable
            placeholder="请输入水滴限制">
          </el-input>
        </el-form-item>
        <el-form-item label="能量值限制" prop="byLimit">
          <el-input
            v-model.number="areaRuleForm.byLimit"
            clearable
            placeholder="请输入能量值限制">
          </el-input>
        </el-form-item> -->
      </el-form>
      <div style="width: 80%;margin:0 auto;">
        <el-button style="width:100%" type="primary" @click="submit">提交</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>

export default {
  name: 'areaDrawer',
  data() {
    return {
      isAdd: false,
      areaDrawer:false,
      direction: 'rtl',
      areaRuleForm:{
        roomName: '',
        integralLimit: '',
        byLimit: '',
      },
      areaRules:{
        roomName: [{required: true, message: '请输入房间名称'},],
        // roomCode: [{required: true, message: '请输入房间编号'},],
        // integralLimit: [{required: true, type:'number', message: '请输入水滴限制(数字)'},],
        // byLimit: [{required: true, type:'number', message: '请输入能量值限制(数字)'},],
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
      this.$refs.arearuleForm.resetFields()
      this.areaDrawer = false
    },
    handleOpen(data) {
      this.areaDrawer = true
      if(data) {
        this.isAdd = false
        this.$nextTick(function(){
            this.areaRuleForm = JSON.parse(JSON.stringify(data))
        })
      }else {
        this.isAdd = true
      }
    },
    submit() {
      const _this = this
      this.$refs.arearuleForm.validate((valid) => {
        if (valid) {
          let postApi = ''
          let con = {
            roomName: this.areaRuleForm.roomName,
          }
          if(this.isAdd) {
            postApi = this.Api.addRoomInfo
          } else {
            con.id = this.areaRuleForm.roomId
            postApi = this.Api.updateRoomInfo
          }
          const jsonParam = _this.GLOBAL.paramJson(con)
          this.$axios.post(postApi, jsonParam).then((res) => {
            if (res.data.head.status === 0) {
              if (this.isAdd) {
                this.$emit('reloadManage', 'areaDrawer')
              } else {
                this.$emit('reloadManage', 'areaDrawer', con)
              }
              _this.handleClose()
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'error',
              })
            }
          }).catch(err => {
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
