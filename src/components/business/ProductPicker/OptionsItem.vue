<template>
  <div class="goodsItem flex flex-col items-center leading-relaxed relative">
    <v-img
      v-if="itemInfo.resUrl"
      :src="itemInfo.resUrl"
      class="rounded-xl bg-white"
      :class="clickItem ? 'boxShadow' : ''"
      :light="true"
      :width="size"
      :height="size"
    ></v-img>
    <v-img
      v-if="checkType()"
      width="25"
      height="25"
      class="btn absolute -top-2 -right-2"
      src="@/asset/image/plus.png"
      @click.stop="addList()"
    ></v-img>
    <v-img
      v-else
      class="btn absolute -top-2 -right-2"
      width="25"
      height="25"
      src="@/asset/image/minus.png"
      @click.stop="delList()"
    ></v-img>
    <div class="text-sm text-center">
      <div class="my-1">
        {{ itemInfo.styleNo }}
      </div>
      <div class="mb-1">
        ￥{{ itemInfo.stylePrice }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemInfo: Object,
    size: Number,
    clickItem: Boolean,
  },
  methods: {
    addList() {
      if (this.$store.state.shoppingCart.list.length === 15) return false
      this.$store.commit('shoppingCart/add', this.itemInfo)
      this.$emit('lock')
    },
    delList() {
      this.$store.commit('shoppingCart/remove', this.itemInfo)
      this.$emit('lock')
    },
    checkType() {
      return !this.$store.state.shoppingCart.list.some(e => e.id === this.itemInfo.id)
    },
  },
}
</script>

<style scoped>
.boxShadow{
  box-shadow: 0 2px 12px 0 #5e8cfd;
}

.btn {
  border-radius: 50%;
}
</style>
