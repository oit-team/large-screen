<template>
  <!--  aspect-9/16 -->
  <div class="grid bg-gray grid-rows-[620px,min-content,1fr] relative overflow-hidden overflow-y-auto h-full">
    <header class="relative bg-white rounded-lg box-border flex justify-center overflow-hidden mx-4 my-2">
      <div class="overflow-hidden aspect-3/4">
        <v-swiper
          ref="swiper"
          class="bg-white h-full product-preview"
          :options="options"
          @touchmove.native.prevent
        >
          <v-swiper-slide
            v-for="(src, index) in infoData.styleList"
            :key="index"
          >
            <!--            :src="src.imgUrl" -->
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
      <div>
        <v-chip
          v-for="(txt, index) in situationsList"
          :key="index"
          color="#fc6d41"
          outlined
          label
          small
          class="mr-2 my-1"
        >
          {{ txt }}
        </v-chip>
      </div>
    </div>

    <div v-if="infoData.styleList?.length" class="bg-white mx-4 grid grid-cols-4 gap-2 my-2 p-2 box-border rounded-lg overflow-x-hidden">
      <div
        v-for="del in infoData.styleList"
        :key="del.id"
        class="mb-2"
        @click="showInfo(del)"
      >
        <v-img
          class="img"
          :src="getSmallImage(del.imgUrl, 'x')"
          contain
        />
        <div class="text-center">
          <div class="text-[#333]">
            {{ del.styleNo }}
          </div>
          <div class="text-[#AF0005]">
            ￥{{ del.stylePrice }}
          </div>
        </div>
      </div>
    </div>

    <Drawer ref="drawer" position="right" offset="55%" class="text-white flex flex-col items-center box-border rounded-l-md">
      <div class="py-1 px-4 text-center">
        <v-btn
          icon
          dark
          fab
          small
          @click="$router.back()"
        >
          <vc-icon>
            fas fa-angle-double-left
          </vc-icon>
        </v-btn>
        <div>返回</div>
      </div>
      <div class="border w-full"></div>
      <div class="py-1 px-4 text-center">
        <v-btn
          icon
          dark
          fab
          small
          @click="toTop"
        >
          <vc-icon>
            fas fa-angle-double-up
          </vc-icon>
        </v-btn>
        <div>TOP</div>
      </div>
    </Drawer>

    <ProductPreview v-model="showPreview" :index="swiperIndex" :list="imgList" />

    <GoodsInfo
      ref="info"
      @away="onAway"
    ></GoodsInfo>
  </div>
</template>

<script>
import { collocationInfo } from '@/api/product'
import ProductPreview from '@/components/business/ProductPreview/ProductPreview.vue'
import Drawer from '@/components/commons/Drawer'
import GoodsInfo from '@/components/business/ProductPicker/GoodsInfo'
import { getSmallImage } from '@/utils/helper'
export default {
  components: {
    ProductPreview,
    Drawer,
    GoodsInfo,
  },
  data() {
    this.options = {}
    this.$headerSwiper = null
    return {
      id: '',
      brandId: '',
      infoData: {},
      showPreview: false,
      swiperIndex: 0,
      situationsList: [],
    }
  },
  computed: {
    imgList() {
      return this.infoData.styleList && this.infoData.styleList.map(e => e.imgUrl)
    },
  },
  watch: {
  },
  mounted() {
    this.$nextTick(() => {
      this.$headerSwiper = this.$refs.swiper?.$swiper
    })
  },
  activated() {
    this.id = this.$route.params?.id
    this.brandId = this.$route.params?.brandId
    this.setSwiperOptions()
    this.getData()
  },
  methods: {
    getSmallImage,
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
    async getData() {
      const res = await collocationInfo({
        id: this.id.toString(),
        userId: '0',
        collId: this.id.toString(),
        brandId: this.brandId.toString(),
        pageNum: 1,
        pageSize: 10,
      })
      this.infoData = res.body.resultMap
      this.situationsList = this.infoData.situations?.split(',')
    },
    toTop() {
      window.scrollTo(0, 0)
    },
    showInfo(item) {
      // clearTimeout(this.timer)
      this.$refs.info.open(item)
      // this.$emit('lock')
    },
    onAway() {
      this.$refs.info.closedialog()
    },
  },
}
</script>

<style scoped>

</style>
