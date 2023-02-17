<template>
  <div>
    <Collocation ref="collocation" :right-list="rightList" @show-info="showInfo" @show-fitting="showFitting" @lock="lock" />
    <v-overlay
      ref="overlay"
      :opacity="opacity"
      z-index="60"
      :value="overlay"
      @click="closeOverlay"
    >
    </v-overlay>

    <SelectGoods ref="fitting" :goods-list="goodsList"></SelectGoods>

    <GoodsInfo
      ref="info"
      @dialog-close="dialogClose"
      @away="onAway"
    ></GoodsInfo>
  </div>
</template>

<script>
import Collocation from './Collocation.vue'
import GoodsInfo from '@/components/business/ProductPicker/GoodsInfo'
import SelectGoods from '@/components/business/ProductPicker/SelectGoods'
import Message from '@/components/commons/Message'

export default {
  components: {
    Collocation,
    SelectGoods,
    GoodsInfo,
  },
  props: {
    options: Array,
    advertsStyleMap: Object,
    resources: Object,
    optionsIndex: Number,
  },
  data() {
    return {
      infoData: {},
      rightList: [],
      opacity: 0,
      overlay: false,
      timer: null,
    }
  },
  computed: {
    goodsList() {
      return this.$store.state.shoppingCart.list
    },
  },
  watch: {
    rightList: {
      deep: true,
      handler() {
        if (this.rightList && this.rightList.length !== 0) {
          this.$refs.collocation.open()
        } else {
          this.$refs.collocation.close()
          this.$refs.fitting.close()
        }
      },
    },
    options: 'changeList',
    optionsIndex: 'changeList',
  },
  mounted() {
    this.$refs.fitting.close()
  },
  methods: {
    showInfo(item) {
      clearTimeout(this.timer)
      this.$refs.info.open(item)
      this.$emit('lock')
      this.$refs.fitting.close()
    },
    showFitting() {
      clearTimeout(this.timer)
      this.$refs.fitting.open()
      this.overlay = true
      this.$emit('lock')
      this.timer = setTimeout(() => {
        this.closeOverlay()
      }, 60000)
    },
    changeList() {
      const goods = this.options[this.optionsIndex].goods
      const optionsItem = goods?.reduce((def, next) => [...def, this.advertsStyleMap[next]], [])
      this.rightList = optionsItem
    },
    lock() {
      this.$emit('lock')
      this.timer = setTimeout(() => {
        this.$emit('unlock')
      }, 60000)
    },
    closeOverlay() {
      this.overlay = false
      this.$emit('unlock')
      this.$refs.fitting.close()
      this.$refs.collocation.reset()
    },
    dialogClose() {
      this.$emit('unlock')
      this.$refs.collocation.reset()
    },
    onAway() {
      this.$refs.info.closedialog()
    },
  },
}
</script>

<style>
</style>
