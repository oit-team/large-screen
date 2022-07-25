<template>
  <div id="addRole" class="pageCommonStyle" >
    <el-page-header :content="title" @back="goBack"></el-page-header>
    <el-divider></el-divider>
    <el-transfer
      filterable
      filter-placeholder="请输入用户名称"
      v-model="associatedUser"
      :data="allUserList"
      :props="{key:'id',label:'name'}"
      :titles="['未授权用户', '已授权用户']"
      :button-texts="['取消', '授权']"
      @change="handleChange">
    </el-transfer>
  </div>
</template>

<script>
export default {
  name: 'authUsersByRoleId',
  props: {},
  data() {
    return {
      title: '用户角色授权',
      roleId: '',
      roleName: '',
      type:'',
      roleRemark: '',
      allUserList: [],
      associatedUser: [],
      leftDefaultChecked: [],
      rightDefaultChecked: [],
    }
  },
  created() {
    if (this.$route.query.item) {
      this.roleId = this.$route.query.item.roleId
      this.roleName = this.$route.query.item.roleName
      this.roleRemark = this.$route.query.item.roleRemark
      this.type = this.$route.query.item.type
    } else {
      this.roleId = null
    }
    this.title = `${this.title}--${this.roleName}`
  },
  mounted() {
    this.getRoleUserList()
  },
  activated() {},
  watch: {},
  methods: {
    handleChange(value, direction, movedKeys) {
      if (direction === 'right') {
        console.log('授权')
        this.addUserAndRole(0, movedKeys)
      } else if (direction === 'left') {
        console.log('取消')
        this.addUserAndRole(1, movedKeys)
      }
    },
    addUserAndRole(type, value) {
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
          _this.allUserList = res.data.body.allUser
          _this.associatedUser = res.data.body.isAssociatedUser
          console.log(_this.allUserList)
          console.log(_this.associatedUser)
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

<style scoped>
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
