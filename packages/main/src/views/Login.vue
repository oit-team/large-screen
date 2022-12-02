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
      <div class="login-logo">
        <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" height="125" width="125">
      </div>
      <ElForm ref="form" :model="form" :rules="rules" label-width="100px">
        <ElFormItem prop="userName">
          <ElInput v-model="form.userName" type="username" clearable prefix-icon="el-icon-s-custom" />
        </ElFormItem>
        <ElFormItem prop="passWord">
          <ElInput v-model="form.passWord" type="password" clearable prefix-icon="el-icon-lock" @keyup.enter.native="login" />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" class="w-full" @click="login">
            登录
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
</style>
