<script>
export default {
  name: 'AddRole',
  data() {
    return {
      menuIds: '',
      editFlag: true, // 判断是否出现重置
      menuList: [], // 树形菜单列表
      title: '',
      brandId: 0,
      ruleForm: {},
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个汉字', trigger: 'blur' },
        ],
        // roleCode:[
        //   { required: true, message: '请输入角色编码', trigger: 'blur' }
        // ],
        roleRemark: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个汉字', trigger: 'blur' },
        ],
      },
      // 菜单
      roleIds: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'childrenMenu',
        label: 'menuName',
      },
    }
  },
  created() {
    // console.log(this.$route.query)
    if (this.$route.query.item) {
      this.title = '编辑角色'
      this.editFlag = false
      this.power()// 获取此角色菜单列表
      this.ruleForm = this.$route.query.item
    }
    else {
      this.title = '新增角色'
      this.getHomeMenuList()// 获取菜单树
    }
  },
  activated() {
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      this.resetForm('ruleForm')
      this.$refs.tree.setCheckedKeys([])
    },
    // 获取菜单树
    getHomeMenuList() {
      const _this = this
      const con = {
        roleId: '0',
        userId: '0', // 这个userId传死值“0”，为了兼容首页左侧菜单必须要有的
        isShowMenu: '0',
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/getTreeMenuList`, jsonParam).then((res) => {
        // console.log("getHomeMenuList==========",res.data.body);
        if (res.data.head.status == 0) {
          _this.menuList = res.data.body.resultList
          // 循环拿取菜单树第一层id
          const treeFirst = []
          for (let i = 0; i < _this.menuList.length; i++) {
            treeFirst.push(_this.menuList[i].menuId)
          }
          this.defaultExpandedKeys = treeFirst
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取此角色菜单列表
    power() {
      const _this = this
      // console.log(this.$route.query.item)
      const con = {
        userId: '0', // 这个userId传死值“0”，为了兼容首页左侧菜单必须要有的
        roleId: this.$route.query.item.roleId,
        isShowMenu: '0',
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/getTreeMenuList`, jsonParam).then((res) => {
        // console.log("获取此角色所拥有的菜单id列表-----",res.data.body);
        if (res.data.head.status == 0) {
          _this.defaultCheckedKeys = res.data.body.menuIdList// 此角色的菜单menuIds
          // _this.defaultCheckedKeys = [39,51]

          // console.log(_this.defaultCheckedKeys)
          this.getHomeMenuList()// 获取菜单树
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    // 保存
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys() // 半选中的节点所组成的数组
          const checkedKeys = this.$refs.tree.getCheckedKeys() // 选中的节点所组成的数组
          // console.log(halfCheckedKeys,checkedKeys)
          for (let j = 0; j < halfCheckedKeys.length; j++) {
            checkedKeys.push(halfCheckedKeys[j])
          }
          // console.log(halfCheckedKeys,checkedKeys)
          // console.log(checkedKeys.toString())
          this.menuIds = checkedKeys
          // console.log('_this.ruleForm.roleId',_this.ruleForm.roleId)
          if (_this.ruleForm.roleId === 0 || _this.ruleForm.roleId) {
            // console.log("编辑用户",_this.ruleForm.roleId)
            const con = {
              roleName: this.ruleForm.roleName,
              roleCode: this.ruleForm.roleCode,
              roleRemark: this.ruleForm.roleRemark,
              userId: sessionStorage.userId,
              roleId: this.ruleForm.roleId,
              // brandId:this.ruleForm.brandId?this.ruleForm.brandId:"0",
              menuIds: this.menuIds.toString(),
            }
            const jsonParam = _this.GLOBAL.g_paramJson(con)
            _this.$axios.post(`${_this.GLOBAL.system_manager_server}/role/updateRoleById`, jsonParam).then((res) => {
              // console.log("addRole==========",res.data.body);
              if (res.data.head.status == 0) {
                // console.log("编辑角色成功===")
                _this.$message({
                  message: res.data.head.msg,
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
                _this.$router.back()
              }
              else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch((err) => {
              console.log(err)
            })
          }
          else {
            const con = {
              roleName: this.ruleForm.roleName,
              roleCode: this.ruleForm.roleCode,
              roleRemark: this.ruleForm.roleRemark,
              userId: sessionStorage.userId,
              roleId: this.ruleForm.roleId,
              brandId: sessionStorage.brandId,
              menuIds: this.menuIds.toString(),
            }
            const jsonParam = _this.GLOBAL.g_paramJson(con)
            _this.$axios.post(`${_this.GLOBAL.system_manager_server}/role/insertRole`, jsonParam).then((res) => {
              // console.log("addRole==========",res.data.body);
              if (res.data.head.status == 0) {
                // console.log("新增角色成功===")
                _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
                _this.$router.back()
              }
              else {
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
        else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<template>
  <div id="addRole" class="pageCommonStyle page-container text-sm">
    <el-page-header :content="editFlag ? '新增角色' : '编辑角色'" @back="goBack" />
    <el-divider />
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName" style="width:60%;" maxlength="10" placeholder="请选择角色名称" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleRemark">
        <el-input v-model="ruleForm.roleRemark" style="width:60%;" maxlength="32" placeholder="请输入角色描述" />
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-tree
          ref="tree"
          :data="menuList"
          node-key="menuId"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
          :show-checkbox="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">
          保存
        </el-button>
        <el-button v-if="editFlag" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
#addRole{
  min-height: 82vh;
}
</style>
