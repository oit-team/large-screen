<template>
  <div id="login">
    <div class="login_head">
      <div class="content">
        <div class="LoginBox">
          <div class="headBox">
            <div class="head_img">
              <img src="../assets/images/logo.png" height="35" width="35">
              <span>立得拍卖</span>
            </div>
          </div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="userName">
              <el-input
                v-model.trim="ruleForm.userName"
                clearable
                placeholder="请输入用户名">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model.trim="ruleForm.password"
                clearable
                placeholder="请输入密码"
                @keyup.enter.native="login('ruleForm')">
              </el-input>
            </el-form-item>
            <el-form-item prop="tryCode">
              <el-input
                type="test"
                v-model.trim="ruleForm.tryCode"
                clearable
                style="width:118px;"
                placeholder="验证码"
                @keyup.enter.native="login('ruleForm')">
              </el-input>
              <img class="checkCodeImg" :src="checkCodeUrl" @click="loadCheckCodeUrl" alt="">
            </el-form-item>
          </el-form>
          <div class="loginBtn">
            <el-button class="btn_submit" type="primary" @click="login('ruleForm')">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from '../assets/js/CryptoJS';
export default {
  name: 'login',
  props: {},
  data() {
    return {
      checkCodeUrl: '',
      token: '',
      mobile: '',
      checkList: [],
      ruleForm: {
        userName: '',
        password: '',
        tryCode: '',
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
          },
        ],
        tryCode: [
          {
            required: true,
            message: '请输入验证码',
          },
        ],
      },
    }
  },
  created() {
    Object.keys(this.ruleForm).map(key => {
      return false
    })
  },
  mounted() {
    this.loadCheckCodeUrl()
  },
  activated() {},
  watch: {},
  methods: {
    loadCheckCodeUrl() {
      this.checkCodeUrl = `${this.Api.checkCodeImg}?token=${Math.random()}`
    },
    login(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const encryPwd = CryptoJS.encrypt(_this.ruleForm.password);
          const con = {
            userName: _this.ruleForm.userName,
            password: encryPwd,
            tryCode: _this.ruleForm.tryCode,
          }
          const jsonParam = _this.GLOBAL.paramJson(con)
          _this.$axios.post(_this.Api.login, jsonParam).then((res) => {
            if (res.data.head.status === 0) {
              sessionStorage.accessToken = res.data.body.accessToken
              sessionStorage.userId = res.data.body.resultList.id
              sessionStorage.userName = res.data.body.resultList.nickName
              // sessionStorage.de = res.data.body.de
              // sessionStorage.mod = res.data.body.mod
              // sessionStorage.userName = res.data.body.name
              // sessionStorage.accountType = res.data.body.accountType
              // sessionStorage.employeeNum = res.data.body.employeeNum
              // sessionStorage.cdaMsg = res.data.body.cdaMsg
              _this.$router.push({
                path: '/',
              })
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          })
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  .content{
    position: absolute;
    width: 100%;
    height: 100%;
    background:url(../assets/images/loginbg.jpg) no-repeat center center;
    background-size: cover;
  }
  .LoginBox{
    width: 300px;
    position:absolute;
    left:50%;
    top:50%;
    margin-left:120px;
    margin-top:-180px;
    padding:46px 20px;
    background: #fff;
    border:1px solid #efefef;
    border-radius: 6px;
  }
  .headBox{
    display: flex;
    justify-content: center;
    .head_img{
      overflow:hidden;
      display: inline-block;
      margin-bottom:20px;
      img{
        display: inline-block;
        float: left;
      }
      span{
        float: left;
        font-size:20px;
        font-weight: bolder;
        line-height: 34px;
        margin-left:20px;
      }
    }
  }
  .checkCodeImg{
    width:130px;
    float: right;
    height: 40px;
    cursor:pointer;
  }
  .btn_submit{
    width: 100%;
  }
</style>
