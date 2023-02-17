<template>
  <Drawer ref="drawer" position="right" offset="47%" class="rounded-l-3xl">
    <div class="w-full p-3 pb-0 box-border">
      <div v-for="(item, index) in rightList" :key="item.id" @click="onClick(item, index)">
        <OptionsItem :item-info="item" :size="100" :click-item="index === clickIndex" @lock="$emit('lock')" />
      </div>
    </div>
    <v-divider class="!border-current"></v-divider>

    <!--        点击试衣间 -->
    <div class="w-full h-7rem p-3 pt-4 box-border flex flex-col justify-center items-center text-sm" @click="isShow">
      <v-badge
        color="#f47b7b"
        :content="$store.state.shoppingCart.list.length"
        :value="!!$store.state.shoppingCart.list.length"
        :offset-x="10"
        :offset-y="10"
      >
        <v-img
          class="rounded-xl"
          :class="showBorder ? 'borders' : ''"
          src="@/asset/image/fitting.png"
        ></v-img>
      </v-badge>
      试衣间
    </div>

    <Permission ref="permission" @accept="sendCommandToDevice()" />
  </Drawer>
</template>

<script>
import Permission from '../Permission.vue'
import Drawer from '@/components/commons/Drawer'
import OptionsItem from '@/components/business/ProductPicker/OptionsItem'
import { sendCommandToDevice } from '@/api/common'

export default {
  components: {
    Drawer,
    OptionsItem,
    Permission,
  },
  props: {
    rightList: Array,
  },
  data() {
    return {
      clickIndex: null,
      showBorder: false,
    }
  },
  methods: {
    open() {
      this.$refs.drawer.open()
    },
    close() {
      this.$refs.drawer.close()
    },
    onClick(item, index) {
      this.$emit('show-info', item)
      this.clickIndex = index
      this.showBorder = false
    },
    isShow() {
      this.$emit('show-fitting')
      this.showBorder = true
      this.clickIndex = null
      // this.$router.push({
      //   name: 'LuckDraw',
      // })
    },
    reset() {
      this.clickIndex = null
      this.showBorder = false
    },
    async sendCommandToDevice() {
      await sendCommandToDevice({
        devId: localStorage.getItem('devId'),
        cmd: 8,
      })
    },
    showModule(value) {
      const moduleValue = this.$route.query.moduleValue
      return (value & moduleValue) > 0
    },
  },
}
</script>

<style scoped>
.borders{
  box-shadow: 0 2px 12px 0 #5e8cfd;
}
</style>
