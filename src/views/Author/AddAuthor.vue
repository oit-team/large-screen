<template>
  <div id="addRole" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack"></el-page-header>
    <el-divider></el-divider>
    <el-form
      ref="ruleForm"
      style="margin-top: 20px"
      :rules="rules"
      :model="ruleForm"
      label-width="90px"
      label-position="left"
    >
      <el-form-item label="作者名称" prop="authorName">
        <el-input v-model="ruleForm.authorName" placeholder="请输入作者名称" style="width:60%;"></el-input>
      </el-form-item>
      <el-form-item label="作者生日" prop="birthDate">
        <el-date-picker
          v-model="ruleForm.birthDate"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="请选择作者生日"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="作者类型" prop="category">
        <el-input v-model="ruleForm.category" placeholder="请输入作者类型" style="width:60%;"></el-input>
      </el-form-item>
      <el-form-item label="作者简介" prop="briefIntro">
        <el-input v-model="ruleForm.briefIntro" type="textarea" rows="6" placeholder="请输入作者简介" style="width:60%;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">
          保存
        </el-button>
        <el-button v-if="!editFlag" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddAuthor',
  props: {},
  data() {
    return {
      editFlag: false,
      id: '',
      title: '',
      UserId: '',
      ruleForm: {
        birthDate: '',
        briefIntro: null,
        authorName: '',
        category: '',
        id: '',
      },
      rules: {
        authorName: [
          { required: true, message: '请输入作者名称', trigger: 'blur' },
        ],
        birthDate: [
          { required: true, message: '请选择作者生日', trigger: 'blur' },
        ],
        category: [
          { required: true, message: '请输入作者类型', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.title = '编辑作者'
      this.editFlag = true
      this.ruleForm.id = this.$route.query.item.id
      this.loadManage(this.$route.query.item.id)
    } else {
      this.title = '新增作者'
    }
  },
  mounted() {},
  activated() {},
  methods: {
    isUnique() {
      return false
    },
    goBack() {
      this.$router.go(-1)
    },
    loadManage(id) {
      // getAuthorInfoById
      const _this = this
      const con = {
        id,
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.getAuthorInfoById, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.ruleForm.birthDate = res.data.body.authorInfo.birthDate
          _this.ruleForm.authorName = res.data.body.authorInfo.authorName
          _this.ruleForm.category = res.data.body.authorInfo.category
          _this.ruleForm.briefIntro = res.data.body.authorInfo.briefIntro
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {})
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const con = {
            birthDate: _this.ruleForm.birthDate,
            briefIntro: _this.ruleForm.briefIntro,
            authorName: _this.ruleForm.authorName,
            category: _this.ruleForm.category,
          }
          if (_this.editFlag) {
            con.id = _this.ruleForm.id
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateAuthorById, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑作者成功',
                  type: 'success',
                })
                con.briefIntro = null
                _this.$bus.$emit('detailShow', con)
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch((err) => {})
          } else {
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.insertAuthorInfo, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增作者成功',
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
            }).catch((err) => {})
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
  #addRole{
    min-height: calc(100% - 10px);
  }
</style>
