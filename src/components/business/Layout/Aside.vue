<template>
  <el-aside width="auto" v-if="menuList.length > 1">
    <el-menu
      v-if="pageName !== 'AuctionConfig'&&menuList.length>0"
      class="overflow-auto scrollbar"
      :collapse="$store.state.aside.collapse"
      :default-active="defalutActive"
      @select="selectMenu"
    >
      <template v-for="item in menuList">
        <el-submenu v-if="item.childrenMenu&&item.childrenMenu.length > 0" :key="item.menuId" :index="item.menuId">
          <template slot="title">
            <i :class="[item.menuImg]" />
            <span slot="title">{{ item.menuName }}</span>
          </template>
          <template v-for="(val, i) in item.childrenMenu">
           <el-submenu :key="i" :index="val.menuId" v-if="val.childrenMenu&&item.childrenMenu.length > 0">
              <template slot="title">
                <span slot="title">{{ val.menuName }}</span>
              </template>
              <el-menu-item
                class="menu-item"
                v-for="(value, index) in val.childrenMenu"
                :key="index"
                :index="value.menuId"
                @click="clickSubMenu(value)">
                <i :class="[value.menuImg]"></i>
                <span slot="title">{{ value.menuName }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              class="menu-item"
              v-else
              :key="i"
              :index="val.menuId"
              @click="clickSubMenu(val)">
              <i :class="[val.menuImg]"></i>
              <span slot="title">{{ val.menuName }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item
          v-else
          :key="item.menuId"
          :index="item.menuId"
          class="otherMenuItem"
          @click="clickSubMenu(item)">
          <i :class="[item.menuImg]" style="font-size:18px;"/>
          <span slot="title">{{ item.menuName }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'VcAside',
  data() {
    return {
      pageName: '',
      menuList: [],
      defalutActive: '',
      parentCode:'',
    }
  },
  watch:{
    '$route.name': function(newVal, oldVal) {
      this.pageName = newVal
    },
    menuList: function(newData){
      const _this = this
      const MenuStatus = JSON.parse(sessionStorage.MenuStatus)
      if(MenuStatus[this.parentCode]) {
        this.defalutActive = MenuStatus[this.parentCode]
        const data = this.setSeesionActive(this.menuList, MenuStatus[this.parentCode])
        _this.clickSubMenu(data)
      }else {
        for( let i in newData) {
          if(!newData[i].menuType){
            _this.setActivePage(newData[i],i)
            return
          }
        }
      }
    }
  },
  created() {
    this.pageName = this.$route.name
    const _this = this
    this.$bus.$off('childrenMenu')
    this.$bus.$on('childrenMenu', (data) => {
      _this.menuList = data.childrenMenu
      _this.parentCode = data.parentCode
    })
  },
  methods: {
    setSeesionActive(data,menuId){
      const _this = this
      for (let i in data) {
        if (data[i].menuId === menuId){
          return data[i]
        } else if(data[i].childrenMenu !== null && data[i].childrenMenu.length>0){
          _this.setSeesionActive(data[i].childrenMenu, menuId)
        }
      }
    },
    setActivePage(data,index) {
      const _this = this
      if (data.childrenMenu === null) {
        _this.defalutActive = data.menuId
        _this.clickSubMenu(data)
      } else {
        for (let i in data.childrenMenu) {
          if(data.childrenMenu[i].childrenMenu === null) {
            _this.defalutActive = data.childrenMenu[i].menuId
            _this.clickSubMenu(data.childrenMenu[i])
          } else if (data.childrenMenu[i].childrenMenu !== null) {
            _this.setActivePage(data.childrenMenu[i].childrenMenu)
          }
        }
      }
    },
    selectMenu(...index) {
      this.$store.commit('aside/selectMenu', index)
    },
    clickSubMenu(val) {
      if (val.menuType === 1) {
        window.open(val.menuUrl)
      } else {
        this.defalutActive = val.menuId;
        const MenuStatus = JSON.parse(sessionStorage.MenuStatus)
        MenuStatus[this.parentCode] = val.menuId;
        sessionStorage.MenuStatus = JSON.stringify(MenuStatus)
        this.$nextTick(function(){
          if (val.fieldDes) {
            sessionStorage.headTitString = val.fieldDes
          }
          let isRouterAliveItem = this.$parent.$children.find(item => item.isRouterAlive)
          // console.log(isRouterAliveItem)
          if (isRouterAliveItem) {
            isRouterAliveItem.isRouterAlive = false
            this.$nextTick(function(){
              isRouterAliveItem.isRouterAlive = true;
              this.$router.push({
                path: val.menuUrl,
              })
            })
          } else {
            this.$router.push({
              path: val.menuUrl,
            })
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-aside {
  position: relative;
}

.el-menu {
  height: 100%;

  &:not(.el-menu--collapse) {
    width: 240px;
  }
}
</style>
