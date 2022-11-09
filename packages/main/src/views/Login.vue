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
  }),

  methods: {
    async submit() {
      const params = {
        ...this.form,
        passWord: crypto.encrypt(this.form.passWord),
      }
      const res = await login(params)
      const userData = res.body.resultList[0]
      setToken(res.body.accessToken)
      this.$store.commit('setUserData', userData)
      sessionStorage.setItem('userId', userData.id)
      sessionStorage.setItem('brandId', userData.brandId)

      this.$router.push('/home')
    },
  },
})
</script>

<template>
  <div>
    <ElForm ref="form" :model="form" label-width="100px">
      <ElFormItem label="密码" prop="pass">
        <ElInput v-model="form.userName" type="username" />
      </ElFormItem>
      <ElFormItem label="确认密码" prop="password">
        <ElInput v-model="form.passWord" type="password" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="submit">
          提交
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>
