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
      <el-form-item class="halfWidth" label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称" style="width:80%;"></el-input>
      </el-form-item>
      <el-form-item class="halfWidth" label="角色备注" prop="roleRemark">
        <el-input
          placeholder="请输入备注"
          style="width:80%;"
          v-model="ruleForm.roleRemark">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm', 0)">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" v-if="!editFlag" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="权限分配">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="菜单权限" name="menuTab">
            <el-tree
               :data="TreeMenuList"
               :default-expand-all="true"
               ref="MenuTree"
               show-checkbox
               :default-checked-keys="defaultCheck"
               node-key="menuId"
               :props="defaultProps">
             </el-tree>
          </el-tab-pane>
          <el-tab-pane label="部门权限" name="deptTab">
            <el-tree
              :data="TreeDeptList"
              :default-expand-all="true"
              ref="DeptTree"
              show-checkbox
              :default-checked-keys="defaultDeptCheck"
              node-key="deptCode"
              :props="defaultDeptProps">
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm', 1)">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" v-if="!editFlag" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'addUser',
  props: {},
  data() {
    return {
      id:'',
      defaultDeptProps: {
        label: 'deptName',
        children: 'childrenDept',
      },
      CheckList: [],
      defaultDeptCheck: [],
      TreeDeptList: [],
      activeName: 'menuTab',
      defaultProps: {
        label: 'menuName',
        children: 'childrenMenu',
      },
      defaultCheck: [],
      TreeMenuList: [],
      editFlag: false,
      title: '',
      UserId: '',
      ruleForm: {
        roleName: '',
        roleRemark: '',
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleRemark: [
          { required: true, message: '请输入角色备注', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    if (this.$route.query.item) {
      this.title = '编辑角色'
      this.editFlag = true
      this.ruleForm = this.$route.query.item
      this.getRoleMenuList()
    } else {
      this.title = '新增角色'
    }
    this.getAllMenuAndTree()
    this.getDeptTree()
  },
  mounted() {},
  activated() {},
  watch: {},
  methods: {
    handleClick(tab, event) {},
    getRoleMenuList() {
      const _this = this
      const con = {
        roleId: this.ruleForm.roleId,
      }
      const defaultCheck = []
      const jsonParam = this.GLOBAL.paramJson(con)
      this.$axios.post(_this.Api.getRoleMenuList, jsonParam).then((res) => {
        if (res.data.body.resultMap) {
          res.data.body.resultMap.forEach((item,i) => {
            if (item.menuType === 2) {
              defaultCheck.push(item.menuId)
            }
          })
          _this.defaultCheck = defaultCheck
        }
      })
    },
    getRoleDeptList() {
      const con = {
        roleCode: this.ruleForm.roleCode,
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getRoleDeptList, jsonParam).then((res) => {
        _this.getDefaultDeptCheck(res.data.body.isAssociatedDept,_this.TreeDeptList)
        _this.defaultDeptCheck = _this.CheckList
        console.log(_this.defaultDeptCheck)
      })
    },
    getDefaultDeptCheck(isAssociatedDept, TreeDeptList) {
      const _this = this
      TreeDeptList.forEach((item,i) => {
        if (item.childrenDept.length > 0) {
          _this.getDefaultDeptCheck(isAssociatedDept, item.childrenDept)
        } else if (isAssociatedDept.indexOf(item['deptCode']) !== -1 && item.childrenDept.length === 0) {
          _this.CheckList.push(item['deptCode'])
        }
      })
    },
    getAllMenuAndTree() {
      const con = {}
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getAllMenuAndTree, jsonParam).then((res) => {
        _this.TreeMenuList = res.data.body.resultMap
      })
    },
    getDeptTree() {
      const con = {}
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getDeptTree, jsonParam).then((res) => {
        _this.TreeDeptList = res.data.body.resultMap
        //判断是编辑角色的时候 获取部门权限树形菜单后再获取已勾选数据
        if (_this.editFlag) {
          _this.getRoleDeptList()
        }
      })
    },
    isUnique() {
      return false
    },
    goBack() {
      this.$router.go(-1)
    },
    changeMenuType() {},
    submitForm(formName, type) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let con = ''
          let updateApi = ''
          let insterApi = ''
          let msg = ''
          if (type === 0) {
            updateApi = _this.Api.updateRoleInfoById// 修改基本信息
            insterApi = _this.Api.insertRoleInfo// 新增基本信息
            msg = '基本信息'
            con = {
              roleId: _this.ruleForm.roleId,
              roleName: _this.ruleForm.roleName,
              roleCode: _this.ruleForm.roleCode,
              roleRemark: _this.ruleForm.roleRemark,
            }
          } else if (type === 1) {
            updateApi = _this.Api.updateRoleMenuById// 修改角色菜单关系
            insterApi = _this.Api.insertRoleMenu// 新增角色菜单权限
            msg = '权限信息'
            const menuIds = [..._this.$refs.MenuTree.getHalfCheckedKeys(true),..._this.$refs.MenuTree.getCheckedKeys()]
            const deptCodes = [..._this.$refs.DeptTree.getHalfCheckedKeys(true),..._this.$refs.DeptTree.getCheckedKeys()]
            con = {
              menuIds: menuIds.toString(),
              deptCodes: deptCodes.toString(),
              roleId: _this.ruleForm.roleId,
              roleCode: _this.ruleForm.roleCode,
              id: _this.id,
            }
          }
          if (_this.editFlag) {
            const jsonParam = _this.GLOBAL.paramJson(con)
            console.log(jsonParam)
            _this.$axios.post(updateApi, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: `编辑菜单${msg}成功`,
                  type: 'success',
                })
                console.log(_this.ruleForm)
                _this.$bus.$emit('detailShow', _this.ruleForm)
                // _this.$router.back()
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
            if (type === 1 && _this.id === '') {
              _this.$message({
                message: `请先保存上方基础信息`,
                type: 'success',
              })
              return
            }
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(insterApi, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: `新增角色${msg}成功`,
                  type: 'success',
                })
                _this.id = res.data.body.id
                _this.$bus.$emit('detailShow', _this.ruleForm)
                // _this.$router.back()
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
  },
}
</script>
<style scoped>
  .halfWidth{
    width: 40%;
    display: inline-block;
  }
  >>>.el-tabs__header{
    width:158px;
  }
</style>
