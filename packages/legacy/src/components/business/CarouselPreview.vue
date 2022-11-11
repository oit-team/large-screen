<script>
import CarouselItemContent from '@/components/business/CarouselItemContent'

export default {
  name: 'CarouselPreview',

  components: {
    CarouselItemContent,
  },

  props: {
    option: Array,
    fileMap: Object,
  },

  data: () => ({
    tabIndex: '',
  }),

  watch: {
    option: 'resetIndex',
  },

  created() {
    this.resetIndex()
  },

  methods: {
    resetIndex() {
      this.tabIndex = '0'
    },
  },
}
</script>

<template>
  <el-tabs v-model="tabIndex" class="carousel" type="border-card">
    <el-tab-pane
      v-for="(item, index) of option"
      :key="index"
      class="flex-1 overflow-hidden"
      :label="`第${index + 1}页`"
    >
      <div class="flex flex-col h-full carousel-view">
        <div v-if="item.items[0]" class="overflow-hidden" :style="`flex-basis: ${item.divider * 100}%`">
          <carousel-item-content :item="item.items[0]" :map="fileMap" />
        </div>
        <div v-if="item.items[1]" class="overflow-hidden flex-1">
          <carousel-item-content :item="item.items[1]" :map="fileMap" />
        </div>
      </div>
    </el-tab-pane>
    <slot />
  </el-tabs>
</template>

<style scoped lang="less">
.carousel {
  display: flex;
  flex-direction: column;
  aspect-ratio: 9/16;

  .carousel-view {
    height: 100%;
    margin: 0 auto;
    background-color: #f2f2f2;
    aspect-ratio: 9/16;
  }

  /deep/ .el-tabs__content {
    display: flex;
    overflow: hidden;
    flex: 1;
    flex-direction: column;
  }
}
</style>
