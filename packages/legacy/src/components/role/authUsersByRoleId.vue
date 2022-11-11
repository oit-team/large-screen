<script lang="jsx">
import { defineComponent } from 'vue'

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
    // // console.log(this.$route.params.item)
    if (this.$route.params.item) {
      this.roleId = this.$route.params.item.roleId
      this.roleName = this.$route.params.item.roleName
      this.roleRemark = this.$route.params.item.roleRemark
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
      const _this = this
      const con = {
        roleId: _this.roleId, // 角色ID	query	string
        brandId: sessionStorage.brandId, // 品牌ID	query	string
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      // console.log(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/role/getRoleUserList`, jsonParam).then((res) => {
        // console.log("获取用户列表==========",res.data.body);
        if (res.data.head.status == 0) {
          // console.log("获取用户列表成功===");
          _this.allUserList = res.data.body.allUser
          _this.associatedUser = res.data.body.isAssociatedUser
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    // 左侧点击事件
    leftChecked() {
      // console.log('左侧点击事件===')
    },
    // 右侧点击事件
    rightChecked() {
      // console.log('右侧点击事件===')
    },
    handleChange(value, direction, movedKeys) {
      // console.log("----------------",value, direction, movedKeys);
      // value 右侧数组集合
      // direction 有right和left两个值 代表向左右两边传值
      // movedKeys 移动元素id组成的数组集合
      if (direction == 'right') {
        // console.log("点击'授权'按钮");
        this.empowerUsersByRoleId(movedKeys, 0)
      }
      if (direction == 'left') {
        // console.log("点击'取消'按钮");
        this.empowerUsersByRoleId(movedKeys, 1)
      }
    },
    // 授权
    empowerUsersByRoleId(userArr, operateId) {
      // this.checkedRoleArr = this.$refs.roleTree.getCheckedKeys();     // 选中的节点所组成的数组
      // console.log("选中的角色数组==",this.checkedRoleArr)
      const _this = this
      const con = {
        userIds: userArr.join(','), // 	用户ID字符串
        roleIds: this.roleId, // 	角色ID字符串
        operateId, // 0 新增  1 删除
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/addUserAndRole`, jsonParam).then((res) => {
        // console.log("批量给用户进行角色授权===",res.data.body);
        if (res.data.head.status == 0) {
          _this.$message({
            message: '用户角色授权成功',
            type: 'success',
          })
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    renderFunc(h, option) {
      // // console.log(h,option)
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
  <div id="authUsersByRoleId" class="pageCommonStyle">
    <ElPageHeader :content="pageTitle" @back="goBack" />
    <ElDivider />
    <!-- <div class="roleDesc">{{roleName}}--{{roleRemark}}</div> -->
    <ElTransfer
      v-model="associatedUser"
      filterable
      :data="allUserList"
      :props="{ key: 'id', label: 'userName' }"
      :render-content="renderFunc"
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
</style>
