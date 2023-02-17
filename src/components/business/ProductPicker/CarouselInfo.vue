<template>
  <Drawer ref="drawer" position="left" offset="47%" class="rounded-r-3xl drawerW2 z-61 p-6 pb-0 box-border w-[85vw] text-white overflow-hidden">
    <div class="w-full flex relative">
      <!--      左侧大图 -->
      <div class="rounded-xl bg-white h-full">
        <v-img
          width="400"
          height="500"
          class="rounded-lg bg-white"
          :src="getSmallImage(currentImg, 'x')"
        ></v-img>
      </div>
      <!--      右侧详情 -->
      <div class="ml-4 flex-1 min-h-inherit w-full overflow-hidden">
        <!--          顶部商品名称 -->
        <div class="relative flex justify-between items-center mb-2">
          <div class="w-3/5">
            <p class="text-2xl truncate">
              {{ infoData.styleName }}
            </p>
            <div class="text-sm">
              {{ infoData.styleNo }}
            </div>
          </div>
          <div class="text-3xl font-bold">
            ￥{{ infoData.stylePrice }}
          </div>
        </div>
        <!--       标签 -->
        <div v-if="infoData.styleLabel !== '暂无'" class="my-2">
          <v-chip
            v-for="(item, index) in labelList"
            :key="index"
            class="py-3 px-6 box-border text-xl mr-2 h-6 text-black"
            label
            color="#ffffff"
          >
            <span>{{ item }}</span>
          </v-chip>
        </div>

        <!--        颜色 型号等等 -->
        <div class="w-full overflow-hidden overflow-x-auto flex items-center text-lg">
          <div class="whitespace-nowrap">
            {{ infoData.styleColor }}
          </div>
          <!--          <v-divider vertical></v-divider> -->
          <div class="border-r-1 h-2 mx-5"></div>
          <div class="whitespace-nowrap">
            {{ infoData.styleFlowerPattern }}
          </div>
          <div class="border-r-1 h-2 mx-5"></div>
          <div class="whitespace-nowrap">
            {{ infoData.styleFabric }}
          </div>
          <div class="border-r-1 h-2 mx-5"></div>
          <div class="whitespace-nowrap">
            {{ infoData.styleFabric }}
          </div>
        </div>

        <div class="my-2 h-[8vh] overflow-hidden overflow-y-auto" v-html="infoData.designSellingPoint">
        </div>

        <div class="my-2 h-[8vh] overflow-hidden overflow-y-auto" v-html="infoData.sellingPointFabric">
        </div>
        <!--        尺码 -->
        <div class="flex w-full overflow-hidden overflow-x-auto items-center">
          <div
            v-for="(item, index) in infoData.stylePicture"
            :key="index"
            class="mr-2"
          >
            <v-btn variant="outlined" color="#fff">
              {{ index }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center h-[8vh] w-full overflow-hidden box-border">
      <div class="w-full flex items-center overflow-hidden overflow-x-auto">
        <div
          v-for="(item, index) in infoData.stylePicture"
          :key="index"
          class="rounded-lg mr-2 bg-black"
          @click="currentIndex = index"
        >
          <v-img
            width="80"
            height="100"
            class="rounded-xl bg-white box-border"
            :class="currentIndex === index ? 'boxShadow' : 'opacity-80'"
            :src="getSmallImage(item, 's')"
          ></v-img>
        </div>
      </div>
      <div
        class="h-full flex items-center whitespace-nowrap"
        @click="toHome"
      >
        更多搭配
        <vc-icon dark class="ml-2">
          fas fa-angle-double-right
        </vc-icon>
      </div>
    </div>
  </Drawer>
</template>

<script>
import Drawer from '@/components/commons/Drawer'
import { getSmallImage } from '@/utils/helper'
export default {
  components: {
    Drawer,
  },
  data() {
    return {
      infoData: {},
      currentImg: '',
      currentIndex: 0,
      labelList: [],
    }
  },
  computed: {
  },
  watch: {
    currentIndex() {
      this.currentImg = this.infoData.stylePicture[this.currentIndex]
    },
  },
  methods: {
    getSmallImage,
    open(item) {
      this.currentImg = item.stylePicture[0]
      this.labelList = item.styleLabel.replaceAll('，', ',').split(',')
      this.infoData = JSON.parse(JSON.stringify(item))
      // this.infoData.sellingPointFabric = this.infoData.sellingPointFabric.replaceAll('，', ',').split('；')
      this.$refs.drawer.open(item)
    },
    close() {
      this.$refs.drawer.close()
      this.currentIndex = 0
    },
    toHome() {
      this.$router.push({
        name: 'Home',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.min-h-inherit{
  min-height: inherit;
}
.boxShadow{
  box-shadow: 0 2px 12px 0 #5e8cfd;
}
//.ul_list{
//  :deep(ul){
//    list-style-type: square !important;
//  }
//}
:deep(ul){
  padding: 0;
}
</style>
