<script>
import { getTreeMenuList, insertRole, updateRoleById } from '@/api/role'
export default {
  name: 'AddRole',
  data() {
    return {
      updateRoleLoading: false,
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

  methods: {
    goBack() {
      this.$router.go(-1)
      this.resetForm('ruleForm')
      this.$refs.tree.setCheckedKeys([])
    },
    // 获取菜单树
    getHomeMenuList() {
      const con = {
        roleId: '0',
        userId: '0', // 这个userId传死值“0”，为了兼容首页左侧菜单必须要有的
        isShowMenu: '0',
      }
      getTreeMenuList(con).then((res) => {
        if (res.head.status === 0) {
          this.menuList = res.body.resultList
          // 循环拿取菜单树第一层id
          const treeFirst = []
          for (let i = 0; i < this.menuList.length; i++) {
            treeFirst.push(this.menuList[i].menuId)
          }
          this.defaultExpandedKeys = treeFirst
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'warning',
        })
      })
    },
    // 获取此角色菜单列表
    power() {
      const con = {
        userId: '0', // 这个userId传死值“0”，为了兼容首页左侧菜单必须要有的
        roleId: this.$route.query.item.roleId,
        isShowMenu: '0',
      }
      getTreeMenuList(con).then((res) => {
        if (res.head.status === 0) {
          this.defaultCheckedKeys = res.body.menuIdList// 此角色的菜单menuIds
          // _this.defaultCheckedKeys = [39,51]

          this.getHomeMenuList()// 获取菜单树
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'warning',
        })
      })
    },

    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateRoleLoading = true
          const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys() // 半选中的节点所组成的数组
          const checkedKeys = this.$refs.tree.getCheckedKeys() // 选中的节点所组成的数组

          for (let j = 0; j < halfCheckedKeys.length; j++) {
            checkedKeys.push(halfCheckedKeys[j])
          }

          this.menuIds = checkedKeys
          if (this.ruleForm.roleId === 0 || this.ruleForm.roleId) {
            const con = {
              roleName: this.ruleForm.roleName,
              roleCode: this.ruleForm.roleCode,
              roleRemark: this.ruleForm.roleRemark,
              userId: sessionStorage.userId,
              roleId: this.ruleForm.roleId,
              // brandId:this.ruleForm.brandId?this.ruleForm.brandId:"0",
              menuIds: this.menuIds.toString(),
            }

            updateRoleById(con).then((res) => {
              if (res.head.status === 0) {
                this.$message({
                  message: '角色修改成功！',
                  type: 'success',
                })
                this.$router.go(-1)
              }
            }).catch((err) => {
              this.$message({
                message: err.message,
                type: 'warning',
              })
            }).finally(() => {
              this.updateRoleLoading = false
            })
          }
          else {
            const con = {
              roleName: this.ruleForm.roleName,
              roleCode: this.ruleForm.roleCode,
              roleRemark: this.ruleForm.roleRemark,
              userId: sessionStorage.userId,
              roleId: this.ruleForm.roleId,
              // brandId: sessionStorage.brandId,
              menuIds: this.menuIds.toString(),
            }
            insertRole(con).then((res) => {
              if (res.head.status === 0) {
                this.$message({
                  message: '角色新增成功！',
                  type: 'success',
                })
                this.$router.go(-1)
              }
            }).catch((err) => {
              this.$message({
                message: err.message,
                type: 'warning',
              })
            }).finally(() => {
              this.updateRoleLoading = false
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
    <ElPageHeader :content="editFlag ? '新增角色' : '编辑角色'" @back="goBack" />
    <ElDivider />
    <ElForm ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
      <ElFormItem label="角色名称" prop="roleName">
        <ElInput v-model="ruleForm.roleName" style="width:60%;" maxlength="10" placeholder="请选择角色名称" />
      </ElFormItem>
      <ElFormItem label="角色描述" prop="roleRemark">
        <ElInput v-model="ruleForm.roleRemark" style="width:60%;" maxlength="32" placeholder="请输入角色描述" />
      </ElFormItem>
      <ElFormItem label="菜单权限">
        <ElTree
          ref="tree"
          :data="menuList"
          node-key="menuId"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
          :show-checkbox="true"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton size="small" icon="el-icon-check" type="primary" :loading="updateRoleLoading" @click="submitForm('ruleForm')">
          保存
        </ElButton>
        <ElButton v-if="editFlag" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">
          重置
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped>
#addRole{
  min-height: 82vh;
}
</style>
