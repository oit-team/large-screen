<script>
import { defineComponent } from 'vue'
import { keyBy } from 'lodash-es'
import { collapse, toggleCollapse } from './control'
import { getTreeMenuList } from '@/api/common'

export default defineComponent({

  data: () => ({
    menuList: [],
    active: '',
  }),

  computed: {
    collapse: () => collapse.value,
    menuMap() {
      const map = {}
      const assign = arr => Object.assign(map, keyBy(arr, 'menuId'))
      assign(this.menuList)
      this.menuList.forEach(item => assign(item.childrenMenu, 'menuId'))
      return map
    },
  },

  mounted() {
    this.getTreeMenuList()

    // 对于切换品牌做出回应
    this.$root.$on('switchBrand', () => this.getTreeMenuList())
  },

  methods: {
    toggleCollapse,
    async getTreeMenuList() {
      const res = await getTreeMenuList({
        userId: sessionStorage.getItem('userId'),
      })
      this.menuList = res.body.resultList
    },
    async change(id) {
      const item = this.menuMap[id]
      await this.$router.push(/^\//.test(item.menuUrl) ? item.menuUrl : `/${item.menuUrl}`)
      sessionStorage.setItem('headTitString', item.fieldDes)
    },
  },
})
</script>

<template>
  <ElAside class="relative flex flex-col border-r" width="auto">
    <ElMenu class="flex-1 flex flex-col overflow-auto border-none" :collapse="collapse" unique-opened @select="change">
      <template v-for="item in menuList">
        <ElSubmenu v-if="item.childrenMenu" :key="item.menuId" :index="item.menuId">
          <template #title>
            <i :class="item.menuImg" />
            <span>{{ item.menuName }}</span>
          </template>
          <template v-if="item.childrenMenu">
            <ElMenuItem v-for="sub of item.childrenMenu" :key="sub.menuId" :index="sub.menuId">
              {{ sub.menuName }}
            </ElMenuItem>
          </template>
        </ElSubmenu>
        <ElMenuItem v-else :key="item.menuId" :index="item.menuId">
          <template #title>
            <i :class="item.menuImg" />
            <span>{{ item.menuName }}</span>
          </template>
        </ElMenuItem>
      </template>
    </ElMenu>

    <div class="w-full text-center py-2">
      <i
        class="text-2xl text-gray-500 cursor-pointer"
        :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        @click="toggleCollapse()"
      />
    </div>
  </ElAside>
</template>

<style lang="scss" scoped>
.el-menu {
  &:not(.el-menu--collapse) {
    width: 240px;
  }
}
</style>
