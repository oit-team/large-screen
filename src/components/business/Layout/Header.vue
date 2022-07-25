<template>
  <el-header>
    <div class="system">
      <div class="logoBox">
        <span>立得管理系统</span>
      </div>
    </div>
    <div class="navBox">
<!--      <i
        class="collapse-btn"
        :class="$store.state.aside.collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        @click="$store.commit('aside/switchCollapse')"
      ></i> -->
      <el-menu
        class="scrollbar"
        :default-active="activeIndex"
        mode="horizontal"
      >
        <el-menu-item
          v-for="(item, index) in menuList"
          :key="index"
          :index="''+item.menuId"
          @click="pageTo( item )">
          {{ item.menuName }}
        </el-menu-item>
      </el-menu>
      <div class="account">
        <el-dropdown>
          <span class="account-name">
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item class="dropdown-item--primary" @click.native="ChangePwd">修改密码</el-dropdown-item> -->
            <el-dropdown-item class="dropdown-item--primary" @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="ChangePwd">
      <el-drawer
        title="修改密码"
        :append-to-body="true"
        :modal-append-to-body="true"
        :visible.sync="drawer"
        :direction="direction">
        <el-form style="width:80%;margin: 0 auto" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="userName">
            <el-input
              v-model.trim="ruleForm.userName"
              clearable
              placeholder="请输入工号">
            </el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              type="password"
              v-model.trim="ruleForm.passWord"
              clearable
              placeholder="请输入密码"
              @keyup.enter.native="ChangePwd('ruleForm')">
            </el-input>
          </el-form-item>
        </el-form>
        <div style="width: 80%;margin:0 auto;">
          <el-button style="width:100%" type="primary" @click="ChangePwd('ruleForm')">修改密码</el-button>
        </div>
      </el-drawer>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'VcHeader',
  props: {
    menuList: Array,
  },
  data() {
    return {
      activeIndex: '',
      ruleForm: {
        userName: '',
        passWord: '',
      },
      userName: '',
      type: '',
      direction: 'rtl',
      drawer: false,
      rules: {
        userName: [
          {
            required: true,
            message: '请输入工号',
          },
        ],
        passWord: [
          {
            required: true,
            message: '请输入密码',
          },
        ],
      },
    }
  },
  created() {
    this.userName = sessionStorage.userName
    this.type = sessionStorage.accountType // 0是正式用户， 1是临时用户
  },
  watch:{
    menuList: function(newData) {
      const MenuStatus = {}
      newData.forEach((item, i) => {
        MenuStatus[item.menuCode] = ''
      })
      sessionStorage.MenuStatus = JSON.stringify(MenuStatus)
      this.pageTo(newData[0])
      this.activeIndex = ''+newData[0].menuId
    }
  },
  methods: {
    logout() {
      const _this = this
      setTimeout(function(){
        sessionStorage.clear()
        _this.$router.push({
          path: '/login',
        })
      }, 500)
    },
    ChangePwd() {
      this.drawer = true
    },
    pageTo(val) {
      if (this.activeIndex === val.menuId){
        return
      } else if (!val.menuType) {
        this.activeIndex = val.menuId
      }
      if (val.childrenMenu&&val.childrenMenu.length>0) {
        this.$bus.$emit('childrenMenu', {'childrenMenu':val.childrenMenu , 'parentCode': val.menuCode})
        if (val.fieldDes) {
          sessionStorage.headTitString = val.fieldDes
        }
      } else {
        this.$bus.$emit('childrenMenu', {'childrenMenu':[]})
        if (val.fieldDes) {
          sessionStorage.headTitString = val.fieldDes
        }
        this.$router.push({
          path: val.menuUrl,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/styles/element-variables";

.el-menu-item:not(.is-disabled):hover{
  border-bottom: 2px solid #8d1323!important;
  color:#8d1323!important;
  background:#fff!important;
}
.el-menu-item:not(.is-disabled):focus{
  border-bottom: 2px solid #8d1323!important;
  color:#8d1323!important;
  background:#fff!important;
}
.is-active{
  border-bottom:2px solid #8d1323!important;
}
.el-header {
  z-index: 1;
  display: flex;
  align-items: center;
  border-bottom: solid 1px #e6e6e6;
  // border-bottom: solid 1px #008acd;
  padding:0 0 0 20px;
  background:#fff;
}
.navBox{
  background: #fff;
  width: 100%;
  padding-right: 20px;
  >i{
    float: left;
  }
  >.scrollbar{
    float: left;
    border-bottom:1px solid #fff;
    background: #fff;
    width: calc(100% - 178px);
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    height:60px;
    .el-menu-item{
      color:#7F7F7F;
      height:53px;
    }
    .is-active{
      color:#8d1323;
    }
  }
  >.account{
    float: right;
    height: 60px;
    line-height: 60px;
  }
}
.system {
  display: flex;
  align-items: center;
  padding-right:0px;
  user-select: none;
  .system-name {
    font-weight: bold;
    line-height: 0;
    padding-left: 12px;
  }
}

.collapse-btn {
  font-size: 24px;
  padding:0 14px;
  cursor: pointer;
  line-height: 60px;
  color:#7F7F7F;
}

.account {
  margin-left: auto;

  .account-name {
    cursor: pointer;
    color:#7F7F7F;
  }
}

.dropdown-item--primary {
  color: #666;

  &:focus, &:not(.is-disabled):hover {
    color: #666;
    background-color: transparentize($--color-danger, 0.9);
  }
}
.logoBox{
  width: 220px;
  height:40px;
  background:url('~@/assets/logo.png') 0 center no-repeat ;
  background-size: 35px;

  >span{
    font-size:20px;
    font-weight: bolder;
    display: inline-block;
    line-height: 40px;
    margin-left:40px;


  }
}
</style>
