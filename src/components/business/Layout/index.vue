<template>
  <el-container class="page-container" direction="vertical">
    <VcHeader :menu-list="menuList" :active-index="activeIndex" />
    <el-container class="overflow-hidden">
      <VcAside />
      <VcMain id="main" class="scrollbar" />
    </el-container>
  </el-container>
</template>

<script>
import VcHeader from './Header'
import VcAside from './Aside'
import VcMain from './Main'

export default {
  name: 'VcLayout',
  components: {
    VcMain,
    VcAside,
    VcHeader,
  },
  data() {
    return {
      menuList: [],
      activeIndex: '',
      pathArr: ['order'],
      pageBtnRole: [],
    }
  },
  created() {
    this.getTreeMenuList()
  },
  mounted() {
  },
  methods: {
    getTreeMenuList() {
      const con = {
        userId: sessionStorage.userId,
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getTreeMenuList, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (res.data.body.resultList) {
            this.menuList = res.data.body.resultList
            this.addPathArr(this.menuList)
            sessionStorage.homeMenuPathArr = this.pathArr
          } else {
            _this.$message({
              message: '该用户暂未被授予角色权限',
              type: 'warning',
            })
          }
        }
      })
    },
    // 本地存储菜单路径，用户判断用户是否有权限进入
    // 存储各个页面按钮权限
    addPathArr(val) {
      const _this = this
      val.forEach((item, i) => {
        if (item.childrenMenu && item.childrenMenu.length > 0) {
          _this.addPathArr(item.childrenMenu)
        } else {
          _this.pathArr.push(item.menuUrl.split('/')[1])
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page-container {
  overflow: hidden;
  width: 100vw;
  height: 96vh;
}
</style>
