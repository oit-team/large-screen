<script>
import CryptoJS from '@/utils/crypto'
import { updatePassWord } from '@/api/account'
export default {
  name: 'ResetPassword',
  data() {
    return {
      changePwdFlag: false,
      formLabelWidth: '100px',
      pwdForm: {
        oldPwd: '',
        newPwd: '',
        conNewPwd: '',
      },
      pwdFormRules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 2 到 20 个字符以内', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]{6,20}$/, message: '只能输入6-20位字母、数字组合', trigger: 'blur' },
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 2 到 20 个字符以内', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]{6,20}$/, message: '只能输入6-20位字母、数字组合', trigger: 'blur' },
        ],
        conNewPwd: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 2 到 20 个字符以内', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]{6,20}$/, message: '只能输入6-20位字母、数字组合', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    changePwd() {
      this.changePwdFlag = true
    },

    cancelChangePwd(formName) {
      this.$refs[formName].resetFields()
      this.changePwdFlag = false
    },

    resetPwd(formName) {
      this.$refs[formName].resetFields()
    },

    async confirmChangePwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.pwdForm.newPwd !== this.pwdForm.conNewPwd) {
            this.$message({
              type: 'warning',
              message: '新密码两次输入不一致，请确认',
            })
          }
          else {
            updatePassWord({
              oldPassWord: CryptoJS.encrypt(this.pwdForm.oldPwd),
              newPassWord: CryptoJS.encrypt(this.pwdForm.newPwd),
            }).then(() => {
              this.$refs[formName].resetFields()
              this.changePwdFlag = false
              this.$message({
                type: 'success',
                message: '修改成功!',
              })
            }).catch((error) => {
              this.$message({
                type: 'warning',
                message: error.message,
              })
            })
          }
        }
        else {
          return false
        }
      })
    },
  },
}
</script>

<template>
  <ElDrawer
    title="修改密码"
    :visible.sync="changePwdFlag"
    :wrapper-closable="false"
    direction="rtl"
    size="30%"
  >
    <div class="demo-drawer__content flex flex-col">
      <ElForm ref="pwdForm" :model="pwdForm" :rules="pwdFormRules">
        <ElFormItem label="旧密码" :label-width="formLabelWidth" prop="oldPwd">
          <ElInput v-model="pwdForm.oldPwd" autocomplete="off" style="width:80%" type="password" placeholder="请输入旧密码" />
        </ElFormItem>
        <ElFormItem label="新密码" :label-width="formLabelWidth" prop="newPwd">
          <ElInput v-model="pwdForm.newPwd" autocomplete="off" style="width:80%" type="password" maxlength="32" placeholder="请输入新密码" />
        </ElFormItem>
        <ElFormItem label="确认密码" :label-width="formLabelWidth" prop="conNewPwd">
          <ElInput v-model="pwdForm.conNewPwd" autocomplete="off" style="width:80%" type="password" placeholder="请确认新密码" />
        </ElFormItem>
      </ElForm>
      <div class="mt-4 ml-5">
        <ElButton size="small" type="primary" @click="confirmChangePwd('pwdForm')">
          确 认
        </ElButton>
        <ElButton size="small" @click="resetPwd('pwdForm')">
          重置
        </ElButton>
        <ElButton size="small" @click="cancelChangePwd('pwdForm')">
          取 消
        </ElButton>
      </div>
    </div>
  </ElDrawer>
</template>

<style lang='scss' scoped>

</style>
