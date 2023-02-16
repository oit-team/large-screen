<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="75%"
      @click:outside="closedialog"
    >
      <div v-if="dialog" class="h-[75vh] bg-gray" @touchstart="onTouchstart">
        <Clothing ref="clothing" :product-id="productId" :is-dialog="isDialog"></Clothing>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import Clothing from './Detail.vue'

const AWAY_TIME = 30000 // 30s
let timer = null

export default {
  components: {
    Clothing,
  },
  props: {
  },
  data() {
    return {
      infoData: {},
      dialog: false,
      productId: '',
      isDialog: true,
    }
  },
  methods: {
    open(data) {
      this.dialog = true
      this.infoData = data
      this.productId = this.infoData.id
      this.onTouchstart()
    },
    // 点击dialog容器之外触发关闭
    closedialog() {
      this.dialog = false
      this.$emit('dialog-close')
    },
    onTouchstart() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.$emit('away')
      }, AWAY_TIME)
    },
  },
}
</script>

<style scoped>
.drawerW{
  width: 50vw;
}
</style>
