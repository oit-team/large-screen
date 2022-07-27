<template>
  <div id="addRole" class="pageCommonStyle" >
    <el-page-header @back="goBack" :content="title"></el-page-header>
    <el-divider></el-divider>
    <el-form
      style="margin-top: 20px"
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
      label-width="90px"
      label-position="left">
      <div style="width: 50%;display: inline-block;float: left;border-right: 1px solid #DCDFE6;padding-right: 20px;">
        <el-form-item label="用户姓名">
          <el-input v-model="ruleForm.userName" :disabled="true" placeholder="请输入用户姓名" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item v-if="editFlag" label="用户状态" prop="status">
          <el-select filterable
            v-model="ruleForm.status"
            :disabled="true"
            placeholder="请选择用户状态"
            style="width:100%;">
            <el-option v-for="(item,index) in statusList"
              :key="index"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐码">
          <el-input v-model="ruleForm.invitationCode" :disabled="true" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="推荐人">
          <el-select
            clearable
            filterable
            v-model="ruleForm.recommender"
            placeholder="请选择推荐人"
            style="width:100%;">
            <el-option v-for="(item,index) in userList"
              :key="index"
              :label="item.nickName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宝玉" prop="bys">
          <el-input
            type="number"
            readonly
            :value="ruleForm.bys"
            placeholder="请输入宝玉"
            @input="ruleForm.bys = ruleForm.bys.substring(0, 10)"
            @click.native="drawer = true"
            maxlength="10"
            style="width:100%;">
          </el-input>
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input
            type="number"
            readonly
            :value="ruleForm.integral"
            placeholder="请输入积分"
            @input="ruleForm.integral = ruleForm.integral.substring(0, 10)"
            @click.native="drawer = true"
            maxlength="10"
            style="width:100%;">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="ruleForm.passWord" placeholder="请输入新密码" show-password style="width:100%;"></el-input>
        </el-form-item>

      </div>
      <div style="width: 50%;display: inline-block;float: left;padding-left: 20px;">
        <el-form-item label="真实姓名">
          <el-input v-model="ruleForm.nickName" :disabled="true" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-input v-model="ruleForm.birthDate" :disabled="true" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-if="ruleForm.sex == 0" :disabled="true" value="男" style="width:100%;"></el-input>
          <el-input v-else-if="ruleForm.sex == 1" :disabled="true" value="女" style="width:100%;"></el-input>
          <el-input v-else-if="ruleForm.sex == -1" :disabled="true" value="暂无" style="width:100%;"></el-input>
          <el-input v-else :disabled="true" v-model="ruleForm.sex" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="ruleForm.telephone" :disabled="true" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="ruleForm.address" :disabled="true" style="width:100%;"></el-input>
        </el-form-item>

        <el-form-item label="用户头像">
          <el-image
            v-if="ruleForm.headPortrait"
            style="width: 100px; height: 100px"
            :src="ruleForm.headPortrait"></el-image>
          <span v-else='ruleForm.headPortrait' style="color:#BFBFBF">暂无头像</span>
        </el-form-item>
      </div>
      <div style="clear: both;text-align: center;">
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <!-- <el-button size="small" icon="el-icon-refresh" v-if="!editFlag" @click="resetForm('ruleForm')">重置</el-button> -->
      </div>
    </el-form>

    <el-drawer
      title="编辑宝玉/积分"
      :visible.sync="drawer"
    >
      <el-form class="px-6" label-position="top" :model="valueForm">
        <el-form-item label="宝玉" prop="bys">
          <el-input
            type="number"
            v-model="valueForm.bys"
            placeholder="请输入宝玉"
            @input="valueForm.bys = valueForm.bys.substring(0, 10)"
            @click.native="drawer = true"
            maxlength="10">
          </el-input>
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input
            type="number"
            v-model="valueForm.integral"
            placeholder="请输入积分"
            @input="valueForm.integral = valueForm.integral.substring(0, 10)"
            @click.native="drawer = true"
            maxlength="10">
          </el-input>
        </el-form-item>
        <el-form-item label="方式" prop="byAddType">
          <el-radio-group v-model="valueForm.byAddType">
            <el-radio :label="0" border>用户充值</el-radio>
            <el-radio :label="1" border>平台赠送</el-radio>
          </el-radio-group>
        </el-form-item>
        <div>
          <el-button type="primary" class="w-full" @click="confirmValue()">确定</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import CryptoJS from '../../assets/js/CryptoJS'
export default {
  name: 'addUser',
  props: {},
  data() {
    return {
      userList:'',
      passWord:'',
      editFlag: false,
      statusList: [
        {
          key: 0,
          label: '启用',
        },
        {
          key: 1,
          label: '停用',
        },
      ],
      title: '',
      UserId: '',
      ruleForm: {
        userName: '',
        bys: '',
        integral: '',
        recommender: '',
      },
      valueForm: {
        bys: '',
        integral: '',
        byAddType: 0,
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        bys: [
          { required: true, message: '请输入宝玉', trigger: 'blur' },
        ],
        integral: [
          { required: true, message: '请输入积分', trigger: 'blur' },
        ],
        passWord: [
          { required: false, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少输入6位数字/字母', trigger: 'blur' },
          { max: 20, message: '最多输入20位数字/字母', trigger: 'blur' },
        ],
      },
      drawer: false,
    }
  },
  created() {
    this.getUserList()
    if (this.$route.query.item) {
      this.title = '编辑用户'
      this.editFlag = true
      // this.ruleForm = this.$route.query.item
      this.getUserInfo(this.$route.query.item)
    } else {
      this.title = '新增用户'
    }
  },
  mounted() {},
  activated() {},
  watch: {},
  methods: {
    isUnique() {
      return false
    },
    goBack() {
      this.$router.go(-1)
    },
    getUserInfo(data) {
      const con = {
        userId: data.id
      }
      const _this = this
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.getUserById, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (res.data.body.userInfo.recommender == '0') {
            res.data.body.userInfo.recommender = res.data.body.userInfo.recommenderName
          }
          _this.ruleForm = res.data.body.userInfo

          this.rawForm = Object.freeze(JSON.parse(JSON.stringify(_this.ruleForm)))
          this.valueForm.bys = this.ruleForm.bys
          this.valueForm.integral = this.ruleForm.integral
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
    getUserList() {
      const con = {
        pageNum: 1,
        pageSize: 9999,
      }
      const _this = this
      const jsonParam = this.GLOBAL.paramJson(con)

      this.$axios.post(this.Api.getUsers,jsonParam).then((res) => {
        if (res.data.head.status == 0) {
          _this.userList = res.data.body.usersList
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let recommender = this.ruleForm.recommender == this.ruleForm.recommenderName ? '0' :this.ruleForm.recommender
          let valueForm = {}

          if (this.rawForm.bys !== this.ruleForm.bys || this.rawForm.integral !== this.ruleForm.integral) {
            valueForm = {
              bys: this.ruleForm.bys,
              integral: this.ruleForm.integral,
              byAddType: this.ruleForm.byAddType,
            }
          }

          let con = {
            recommender:recommender,
            ...valueForm,
          }
          let encryPwd = ''
          if (_this.editFlag) {
            if (_this.ruleForm.passWord) {
              encryPwd = CryptoJS.encrypt(_this.ruleForm.passWord);
              con.password = encryPwd
            }
            con.id = _this.ruleForm.id
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateUserById, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑用户成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm)
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.insertUser, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增用户成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm)
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    confirmValue() {
      Object.assign(this.ruleForm, this.valueForm)
      this.drawer = false
    },
  },
}
</script>
<style lang="less" scoped>
</style>
