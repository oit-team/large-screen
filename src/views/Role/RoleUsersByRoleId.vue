<template>
  <div id="addRole" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack"></el-page-header>
    <el-divider></el-divider>
    <el-transfer
      v-model="associatedUser"
      filterable
      filter-placeholder="请输入用户名称"
      :data="allUserList"
      :props="{ key: 'id', label: 'userName' }"
      :titles="['未授权用户', '已授权用户']"
      :button-texts="['取消', '授权']"
      @change="handleChange"
    >
    </el-transfer>
  </div>
</template>

<script>
export default {
  name: 'RoleUsersByRoleId',
  props: {},
  data() {
    return {
      title: '',
      roleId: '',
      roleName: '',
      type: '',
      roleRemark: '',
      allUserList: [],
      associatedUser: [],
      leftDefaultChecked: [],
      rightDefaultChecked: [],
    }
  },
  watch: {},
  created() {

  },
  mounted() {

  },
  activated() {
    this.title = '用户角色授权'
    if (this.$route.query.item) {
      this.roleId = this.$route.query.item.roleId
      this.roleName = this.$route.query.item.roleName
      this.roleRemark = this.$route.query.item.roleRemark
      this.type = this.$route.query.item.type
      this.title = `${this.title}--${this.roleName}`
    } else {
      this.roleId = null
    }
    this.getRoleUserList()
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      if (direction === 'right') {
        this.addUserAndRole(0, movedKeys) // 授权
      } else if (direction === 'left') {
        this.addUserAndRole(1, movedKeys) // 取消
      }
    },
    addUserAndRole(type, value) {
      // console.log(type) //0--授权
      // console.log(value); // 角色id
      const con = {
        roleIds: this.roleId,
        userIds: value.toString(),
        operateId: type,
        type: this.type,
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.addUserAndRole, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.$message({
            message: '用户角色授权成功',
            type: 'success',
          })
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    getRoleUserList() {
      const con = {
        roleId: this.roleId,
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getRoleUserList, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.allUserList = res.data.body.allUser // 未授权的角色列表id
          _this.associatedUser = res.data.body.isAssociatedUser // 已授权的列表
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
  >>>.el-transfer-panel{
    width: 300px;
  }
  >>>.el-button{
    padding:10px 16px;
  }
  >>>.el-checkbox__label{
    font-size:12px;
  }
</style>
