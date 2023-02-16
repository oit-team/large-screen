<template>
  <!--  aspect-9/16 -->
  <div class="grid bg-gray grid-rows-[620px,min-content,min-content,1fr] relative overflow-hidden font-sans min-h-full overflow-y-auto">
    <header class="relative bg-white rounded-lg box-border flex justify-center overflow-hidden mx-4 my-2">
      <div class="overflow-hidden aspect-3/4">
        <v-swiper
          ref="swiper"
          class="bg-white h-full product-preview"
          :options="options"
          @touchmove.native.prevent
        >
          <!--          <v-swiper-slide -->
          <!--            v-for="src in infoData.videoList" -->
          <!--            :key="src" -->
          <!--          > -->
          <!--            <VcPlyr -->
          <!--              class="img" -->
          <!--              :src="src" -->
          <!--              :options="optionsPlyr" -->
          <!--            /> -->
          <!--          </v-swiper-slide> -->
          <v-swiper-slide
            v-for="(src, index) in infoData.styleList"
            :key="index"
          >
            <v-img
              class="img"
              height="100%"
              :src="getSmallImage(src.imgUrl, 'x')"
              contain
              @click="showPreview = true"
            />
          </v-swiper-slide>
        </v-swiper>
      </div>
      <div
        v-if="infoData.styleList && infoData.styleList?.length"
        class="flex absolute bottom-0 right-2 z-10 justify-end p-2"
      >
        <div class="overflow-hidden bg-black bg-opacity-40 rounded">
          <vc-btn class="px-1 min-w-0 bg-transparent" tile dark @click="$headerSwiper.slidePrev()">
            <vc-icon>fas fa-chevron-left</vc-icon>
          </vc-btn>
          <span class="mx-1 text-white">{{ swiperIndex + 1 }}/{{ infoData.styleList?.length }}</span>
          <!--          <span class="mx-1 text-white">{{ swiperIndex + 1 }}/{{ infoData.videoList ? infoData.styleList?.length + 1 : infoData.styleList?.length }}</span> -->
          <vc-btn class="px-1 min-w-0 bg-transparent" tile dark @click="$headerSwiper.slideNext()">
            <vc-icon>fas fa-chevron-right</vc-icon>
          </vc-btn>
        </div>
      </div>
    </header>

    <!--    详情内容展示 -->
    <div class="bg-white h-min rounded-lg mx-4 my-2 py-3 px-6 box-border">
      <div class="text-2xl my-2">
        {{ infoData.styleName }}
      </div>
      <div class="w-full flex justify-between items-center ">
        <div class="text-[#999]">
          {{ infoData.styleNo }}
        </div>
        <div class="text-red-500">
          ￥{{ infoData.stylePrice }}
        </div>
      </div>
    </div>

    <div class="rounded-lg text-lg mx-4 my-2 box-border bg-white">
      <div class="px-8 py-4 flex items-center">
        <div class="text-[#888888] pr-3 w-3em">
          面料
        </div>
        <div class="flex-1">
          {{ infoData.styleFabric }}
        </div>
      </div>
      <v-divider></v-divider>
      <div class="px-8 py-4 flex items-center">
        <div class="text-[#888888] pr-3 w-3em">
          廓形
        </div>
        <div class="flex-1">
          {{ infoData.styleFlowerPattern }}
        </div>
      </div>
      <v-divider></v-divider>
      <div class="px-8 py-4 flex items-center">
        <div class="text-[#888888] pr-3 w-3em">
          面料卖点
        </div>
        <div class="flex-1">
          {{ infoData.sellingPointFabric }}
        </div>
      </div>
      <v-divider></v-divider>
      <div class="px-8 py-4 flex items-center">
        <div class="text-[#888888] pr-3 w-3em">
          设计卖点
        </div>
        <div class="flex-1">
          {{ infoData.designSellingPoint }}
        </div>
      </div>
      <v-divider></v-divider>
      <div class="px-8 py-4 flex items-center">
        <div class="text-[#888888] pr-3 w-3em">
          穿着卖点
        </div>
        <div class="flex-1">
          {{ infoData.wearSellingPoint }}
        </div>
      </div>
      <v-divider></v-divider>
    </div>

    <div></div>
    <!--    <div v-if="infoData.detailsImgList?.length" class="flex flex-col bg-white mx-4 my-2 p-2 box-border rounded-lg overflow-x-hidden"> -->
    <!--      <div -->
    <!--        v-for="del in infoData.detailsImgList" -->
    <!--        :key="del" -->
    <!--        class="mb-2" -->
    <!--      > -->
    <!--        <v-img -->
    <!--          class="img" -->
    <!--          :src="getSmallImage(del, 'x')" -->
    <!--          height="100%" -->
    <!--          contain -->
    <!--        /> -->
    <!--      </div> -->
    <!--    </div> -->
    <ProductPreview v-model="showPreview" :index="swiperIndex" :list="imgList" class="h-[75vh] w-[75vw]" />
  </div>
</template>

<script>
import ProductPreview from '@/components/business/ProductPreview/ProductPreview.vue'
// import VcPlyr from '@/components/commons/Plyr/Plyr.vue'
import { goodsInfo } from '@/api/product'
import { getSmallImage } from '@/utils/helper'
// import Drawer from '@/components/commons/Drawer'

export default {
  components: {
    ProductPreview,
    // Drawer,
  },
  props: {
    productId: Number,
    isDialog: Boolean,
  },
  data() {
    this.options = {}
    this.$headerSwiper = null
    return {
      infoData: {},
      showPreview: false,
      swiperIndex: 0,
      optionsPlyr: {
        autoplay: true,
        fullscreen: {
          enabled: true,
        },
        keyboard: {
          focused: false,
        },
        controls: ['play', 'progress', 'play-large', 'fullscreen'],
        hideControls: false,
        clickToPlay: true,
      },
    }
  },
  computed: {
    imgList() {
      return this.infoData.styleList && this.infoData.styleList.map(e => e.imgUrl)
    },
  },
  created() {
    this.currentProductId = this.productId || this.$route.params.productId
    this.setSwiperOptions()
    // this.getProductById()
    this.getInfo()
  },
  mounted() {
    this.$nextTick(() => {
      this.$headerSwiper = this.$refs.swiper?.$swiper
    })
  },
  methods: {
    getSmallImage,
    async getInfo() {
      const res = await goodsInfo({
        id: this.productId,
        styleId: this.productId,
        userId: 0,
      })

      this.infoData = res.body.resultMap
    },
    setSwiperOptions() {
      // 轮播图片集合
      this.options = {
        on: {
          slideChange: () => {
            this.swiperIndex = this.$headerSwiper.realIndex
          },
        },
      }
    },
    toTop() {
      window.scrollTo(0, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
$screen-width: 1080px;
$screen-height: 1920px;

$header-height: 620px;
$category-height: 200px;
$footer: 250px;

$chip-white-space: unset;
//$chip-content-display: inherit;

$product-preview-width: $header-height / 4 * 3;

.home {
  width: $screen-width;
  height: $screen-height;
  aspect-ratio: 9/16;
  display: grid;
  grid-template-rows: $header-height $category-height 1fr $footer;

  .header {
    height: $header-height;

    .product-preview {
      flex-shrink: 0;
      width: $product-preview-width;
      height: $header-height;
    }

    .v-chip {
      white-space: $chip-white-space;
    }

    .v-tab {
      border: 1px solid #d9d9d9;
    }

    .v-tab--active {
      background-color: #e1e1e1;
    }

    :deep(.v-tabs-slider-wrapper) {
      display: none;
    }
  }
}
</style>
