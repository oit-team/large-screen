<script>
import { defineComponent } from 'vue'
import { login } from '@/api/account'
import { setToken } from '@/utils/auth'
import crypto from '@/utils/crypto'

export default defineComponent({
  name: 'Login',

  data: () => ({
    form: {
      userName: '',
      passWord: '',
    },
    rules: {
      userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      passWord: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
    },
  }),

  methods: {
    async login() {
      const params = {
        ...this.form,
        passWord: crypto.encrypt(this.form.passWord),
      }
      if (!this.form.userName) {
        this.$message.warning('请正确输入用户名和密码！')
        return
      }
      const res = await login(params)
      const userData = res.body.resultList[0]
      setToken(res.body.accessToken)
      this.$store.commit('setUserData', userData)
      sessionStorage.setItem('userId', userData.id)
      sessionStorage.setItem('brandId', userData.brandId)

      await this.$store.dispatch('updateUserData')

      this.$router.push('/home')
    },
  },
})
</script>

<template>
  <div class="login">
    <div class="login-content">
      <div class="login-logo flex flex-col justify-center">
        <img src="/images/login-logo.png" style="width:200px">
        <h2 class="text-center text-2xl text-gray-500 leading-16">
          享客易管家
        </h2>
      </div>
      <ElForm ref="form" :model="form" :rules="rules" label-width="60px">
        <ElFormItem prop="userName">
          <ElInput v-model="form.userName" type="username" placeholder="请输入用户名" clearable prefix-icon="el-icon-s-custom" />
        </ElFormItem>
        <ElFormItem prop="passWord">
          <ElInput v-model="form.passWord" type="password" placeholder="请输入密码" clearable prefix-icon="el-icon-lock" @keyup.enter.native="login" />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" class="w-full" @click="login">
            登 录
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: url('/images/login-bg.png') no-repeat center;
  background-size: cover;
  .login-content{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 600px;
    height: 400px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 2px 2px 2px rgba(247, 242, 242, 0.501);
    transform: translateX(220px);
  }
}
::v-deep{
  input::-webkit-input-placeholder {
    font-size: 12px;
  }
  .el-button--primary{
    background-color: rgb(111 167 255);
  }
}
</style>
