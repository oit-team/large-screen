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
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="ruleForm.menuName" placeholder="请输入菜单名称" style="width:60%;"></el-input>
      </el-form-item>
      <el-form-item label="父级菜单" prop="path">
        <el-cascader
          v-model="ruleForm.path"
          :disabled="editFlag"
          placeholder="请选择父级菜单(不选默认添加根菜单)"
          :options="menuOptions"
          :props="{ checkStrictly: true, value: 'menuId', label: 'menuName', children: 'childrenMenu' }"
          clearable
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-select
          v-model="ruleForm.menuType"
          filterable
          placeholder="请选择菜单类型"
          style="width:60%;"
          @change="changeMenuType"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.label"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单路径" prop="menuUrl">
        <el-input v-model="ruleForm.menuUrl" style="width:60%;"></el-input>
      </el-form-item>
      <el-form-item label="菜单排序" prop="orderBy">
        <el-input v-model="ruleForm.orderBy" style="width:60%;" placeholder="请输入菜单排序(数字类型)"></el-input>
      </el-form-item>
      <el-form-item label="菜单编码" prop="menuCode">
        <el-input v-model="ruleForm.menuCode" style="width:60%;" placeholder="请输入菜单编码"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="menuImg">
        <el-input v-model="ruleForm.menuImg" style="width:60%;" placeholder="请输入菜单Icon相应的name"></el-input>
      </el-form-item>
      <el-form-item label="菜单备注" prop="menuRemark">
        <el-input
          v-model="ruleForm.menuRemark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
          style="width:60%;"
        >
        </el-input>
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
  name: 'AddUser',
  props: {},
  data() {
    return {
      menuOptions: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
            },
            {
              value: 'shejiyuanze1',
              label: '设计原则1',
            },
          ],
        },
      ],
      editFlag: false,
      typeList: [
        {
          key: 0,
          label: '内部网页',
        },
        {
          key: 1,
          label: '外部链接',
        },
      ],
      title: '',
      UserId: '',
      ruleForm: {
        path: '',
        menuName: '',
        menuRemark: '',
        menuUrl: '',
        orderBy: '',
        menuCode: '',
        menuImg: '',
        menuType: '',
      },
      rules: {
        path: [
          { required: false, message: '请选择父级菜单', trigger: 'blur' },
        ],
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ],
        menuRemark: [
          { required: true, message: '请输入菜单备注', trigger: 'blur' },
        ],
        menuUrl: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
        ],
        orderBy: [
          { required: true, message: '请选择菜单排序', trigger: 'blur' },
        ],
        menuCode: [
          { required: true, message: '请输入菜单编码', trigger: 'blur' },
        ],
        menuImg: [
          { required: true, message: '请输入菜单图标', trigger: 'blur' },
        ],
        menuType: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      console.log(this.$route.query.item)
      this.title = '编辑菜单'
      this.editFlag = true
      this.$route.query.item.path = this.$route.query.item.path === '0' ? [] : this.$route.query.item.path.split(',')
      this.ruleForm = this.$route.query.item
    } else {
      this.title = '新增菜单'
    }
    this.getMenuList()
  },
  mounted() {},
  activated() {},
  methods: {
    getMenuList() {
      const con = {
        pageNum: '1',
        pageSize: '99',
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getAllMenuAndTree, jsonParam).then((res) => {
        _this.menuOptions = _this.getTreeData(res.data.body.resultMap)
      })
    },
    getTreeData(data) {
      data.forEach((item, i) => {
        console.log(item)
        if (item.menuId === this.ruleForm.menuId) {
          item.disabled = true
        }
        if (item.childrenMenu === null || item.childrenMenu.length < 1) {
          item.childrenMenu = null
        } else {
          this.getTreeData(item.childrenMenu)
        }
      })
      return data
    },
    isUnique() {
      return false
    },
    goBack() {
      this.$router.go(-1)
    },
    changeMenuType() {},
    submitForm(formName) {
      console.log(this.ruleForm.path.toString())
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const con = {
            pId: _this.ruleForm.path.toString() || '0',
            menuName: _this.ruleForm.menuName,
            menuUrl: _this.ruleForm.menuUrl,
            menuRemark: _this.ruleForm.menuRemark,
            orderBy: _this.ruleForm.orderBy,
            menuCode: _this.ruleForm.menuCode,
            menuImg: _this.ruleForm.menuImg,
            menuType: _this.ruleForm.menuType,
          }
          if (_this.editFlag) {
            con.menuId = _this.ruleForm.menuId
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateMenuById, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑菜单成功',
                  type: 'success',
                })
                _this.ruleForm.path = _this.ruleForm.path.toString()
                _this.$bus.$emit('detailShow', _this.ruleForm)
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch((err) => {
              console.log(err)
            })
          } else {
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.insertMenu, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增菜单成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm)
                _this.$bus.$emit('MenuChange', _this.ruleForm)
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch((err) => {
              console.log(err)
            })
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
</style>
