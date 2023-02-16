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

    <v-overlay :value="guideDialog" z-index="100" @click="guideDialog = false">
      <div class="grid grid-cols-[repeat(2,200px)] grid-rows-[250px] gap-6 -mt-[15vh] text-center">
        <!-- <div
          class="bg-black bg-opacity-50 rounded-xl grid place-content-center gap-5"
          @click="$router.push('/lucky')"
        >
          <vc-img src="/assets/img/guide/0.png" size="100px"></vc-img>
          <div>趣味抽奖</div>
        </div> -->
        <div
          class="bg-black bg-opacity-50 rounded-xl grid place-content-center gap-5"
          @click="() => $refs.permission.open()"
        >
          <vc-img src="/assets/img/guide/1.png" size="100px"></vc-img>
          <div>趣味搭配</div>
        </div>
        <div
          class="bg-black bg-opacity-50 rounded-xl grid place-content-center gap-5"
          @click="$router.push(`/`)"
        >
          <vc-img src="/assets/img/guide/2.png" size="100px"></vc-img>
          <div>了解更多</div>
        </div>
      </div>
    </v-overlay>

    <Permission ref="permission" @accept="sendCommandToDevice()" />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { enterCarouselPage } from '../api/frame'
import { getAdvertsInfo } from '@/api/product'
import { sendCommandToDevice } from '@/api/common'
import PageCarousel from '@/components/business/Carousel'
import ProductPicker from '@/components/business/ProductPicker'
import Permission from '@/components/business/Permission.vue'

const DETECT_STATUS = {
  // 没有人
  NOBODY: 0,
  // 有人但比较远
  DISTANCE: 1,
  // 检查到人(在屏幕前)
  PROXIMITY: 2,
  // 检查到人持续在屏幕前8s时长
  WATCHING: 3,
}

export default {
  name: 'PageCarouselWarp',

  components: {
    PageCarousel,
    ProductPicker,
    Permission,
  },
  data: () => ({
    guideDialog: false,
    options: [],
    resources: {},
    advertsStyleMap: {},
    optionsIndex: 0,
    showOverlay: true,
    opacity: 0.6,
  }),
  created() {
    window.OnHumanDetectResult = (status) => {
      if (this.$refs.carousel.lockSwiper) return

      this.status = status
      switch (+status) {
        case DETECT_STATUS.NOBODY:
        case DETECT_STATUS.DISTANCE:
          this.guideDialog = false
          break
        case DETECT_STATUS.PROXIMITY:
        case DETECT_STATUS.WATCHING:
          this.guideDialog = true
          break
      }
    }
  },
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
    async sendCommandToDevice() {
      await sendCommandToDevice({
        devId: localStorage.getItem('devId'),
        cmd: 8,
      })
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
