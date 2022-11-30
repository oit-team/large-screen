<script lang="jsx">
import { defineComponent } from 'vue'
import { addUserAndRole, getRoleUserList } from '@/api/role'

export default defineComponent({
  name: 'AuthUsersByRoleId',
  components: {},
  data() {
    return {
      roleId: null,
      roleName: '',
      roleRemark: '',
      allUserList: [],
      associatedUser: [], // 右侧数据，只用写key就好
      leftDefaultChecked: [],
      rightDefaultChecked: [],
      pageTitle: '用户角色授权',
    }
  },
  created() {
    if (this.$route.query.item) {
      this.roleId = this.$route.query.item.roleId
      this.roleName = this.$route.query.item.roleName
      this.roleRemark = this.$route.query.item.roleRemark
    }
    else {
      this.roleId = null
    }
    this.pageTitle = `${this.pageTitle}--${this.roleName}`
  },
  mounted() {
    this.getAllUsers()
  },
  activated() {

  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 获取用户列表
    getAllUsers() {
      const con = {
        roleId: this.roleId, // 角色ID/query/string
        // brandId: sessionStorage.brandId, // 品牌ID/query/string
      }
      getRoleUserList(con).then((res) => {
        if (res.head.status === 0) {
          this.allUserList = res.body.allUser
          this.associatedUser = res.body.isAssociatedUser
        }
        else {
          this.$message({
            message: res.head.msg,
            type: 'warning',
          })
        }
      })
    },

    handleChange(value, direction, movedKeys) {
      // value 右侧数组集合
      // direction 有right和left两个值 代表向左右两边传值
      // movedKeys 移动元素id组成的数组集合
      if (direction === 'right') {
        this.empowerUsersByRoleId(movedKeys, 0)
      }
      if (direction === 'left') {
        this.empowerUsersByRoleId(movedKeys, 1)
      }
    },
    // 授权
    empowerUsersByRoleId(userArr, operateId) {
      // this.checkedRoleArr = this.$refs.roleTree.getCheckedKeys();     // 选中的节点所组成的数组
      const con = {
        userIds: userArr.join(','), // 用户ID字符串
        roleIds: this.roleId, // 角色ID字符串
        operateId, // 0 新增  1 删除
      }
      addUserAndRole(con).then((res) => {
        if (res.head.status === 0) {
          this.$message({
            message: '用户角色授权成功',
            type: 'success',
          })
        }
        else {
          this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    renderFunc(h, option) {
      if (option.nickName) {
        return <span>{ option.userName } - { option.nickName }</span>
      }
      else {
        return <span>{ option.userName }</span>
      }
    },

  },
})
</script>

<template>
  <!-- 把角色赋予用户 -->
  <div id="authUsersByRoleId" class="pageCommonStyle page-container justify-center items-center">
    <ElPageHeader :content="pageTitle" @back="goBack" />
    <ElDivider />
    <!-- <div class="roleDesc">{{roleName}}--{{roleRemark}}</div> -->
    <ElTransfer
      v-model="associatedUser"
      filterable
      :data="allUserList"
      :props="{ key: 'id', label: 'userName' }"
      :render-content="renderFunc"
      style="height: 85%"
      class="flex justify-center items-center"
      :titles="['未授权用户', '已授权用户']"
      :button-texts="['取消', '授权']"
      :left-default-checked="leftDefaultChecked"
      :right-default-checked="rightDefaultChecked"
      @left-check-change="leftChecked"
      @right-check-change="rightChecked"
      @change="handleChange"
    />
  </div>
</template>

<style lang="less" scoped>
#authUsersByRoleId{
  height: 78vh;
  .roleDesc{
    line-height: 32px;
    text-align: left;
  }
}
::v-deep{
  .el-transfer-panel{
    display: flex;
    flex-direction: column;
    width: 30%;
    height: 100%;
  }
  .el-transfer-panel__body{
    height: 100%;
  }
  .el-transfer-panel__list.is-filterable{
    height: 85%;
  }
}
</style>
