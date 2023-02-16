<template>
  <div class="carousel-wrap">
    <PageCarousel
      ref="carousel"
      :options="options"
      :resources="resources"
      @change="changeIndex"
      @close="close"
      @click.stop
    />
    <ProductPicker
      ref="picker"
      :options="options"
      :resources="resources"
      :adverts-style-map="advertsStyleMap"
      :options-index="optionsIndex"
      @lock="lock"
      @unlock="unlock"
    />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { enterCarouselPage } from '../api/frame'
import PageCarousel from '@/components/business/Carousel'
import { getAdvertsInfo } from '@/api/product'
import ProductPicker from '@/components/business/ProductPicker'

export default {
  name: 'PageCarouselWarp',

  components: {
    PageCarousel,
    ProductPicker,
  },
  data: () => ({
    options: [],
    resources: {},
    advertsStyleMap: {},
    optionsIndex: 0,
    showOverlay: true,
    opacity: 0.6,
  }),
  activated() {
    if (this.$route.params.preview) {
      const { imgResources } = this.$store.state.selectedProduct
      this.resources = {}
      this.options = imgResources.map(src => ({
        divide: '100%',
        disabledNext: true,
        items: [{
          src,
          type: 'image',
          fit: 'cover',
        }],
      }))
    } else {
      this.getAdvertsInfo()

      const { query } = this.$route
      enterCarouselPage({
        devId: query.devId,
        brandId: query.brandId,
      })
    }
  },
  methods: {
    async getAdvertsInfo() {
      const res = await getAdvertsInfo(localStorage.getItem('devId'))
      const {
        rotationRules,
        resEntityMap,
        advertsStyleMap,
      } = res.body.advertsRes
      this.options = JSON.parse(rotationRules)
      this.resources = resEntityMap
      this.advertsStyleMap = advertsStyleMap
    },
    close: debounce(function () {
      const disabledBack = Number(this.$route.query.disabledBack)
      !disabledBack && this.$router.back()
    }, 500, {
      leading: true,
      trailing: false,
    }),
    // 轮播图改变 - index
    changeIndex(index) {
      this.optionsIndex = index
      this.$refs.picker.changeList()
    },
    lock() {
      this.$refs.carousel.lock()
    },
    unlock() {
      this.$refs.carousel.unlock()
    },
  },
}
</script>

<style>
.carousel-wrap {
  position: fixed;
  z-index: 60;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
