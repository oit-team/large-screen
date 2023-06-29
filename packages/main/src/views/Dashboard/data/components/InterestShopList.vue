<script>
export default {
  name: 'InterestShopList',
  props: {
    infoList: Array,
  },
}
</script>

<template>
  <div class="my-2 px-2 box-border">
    <div v-if="infoList.length > 0" class="grid grid-cols-6 gap-4 py-2">
      <!-- <ElCard v-for="(item, index) of 6" :key="index" class="relative" :body-style="{ padding: 0 }">
        <ElImage src="http://res.gaodanyi.com:8102/upload/394/2022/11/bd66b1fc4a334881b1016d498061fb2c_s.jpg" fit="contain" class="w-full aspect-square" />
        <div class="p-2">
          <div class="text-sm w-full line-clamp-2">
            秋冬女装显示那附近多喝点水hi东方红睿范冰冰
          </div>
        </div>
        <div>
          <img v-show="index === 0" class="img-badge" src="/images/top1.png" alt="">
          <img v-show="index === 1" class="img-badge" src="/images/top2.png" alt="">
          <img v-show="index === 2" class="img-badge" src="/images/top3.png" alt="">
        </div>
      </ElCard> -->
      <ElCard v-for="(item, index) of infoList.slice(0, 5)" :key="index" class="relative" :body-style="{ padding: 0 }">
        <ElImage :src="item.resUrl" fit="contain" class="w-full aspect-square" />
        <div class="p-2">
          <div class="text-xs w-full line-clamp-2">
            {{ item.productName }}
          </div>
        </div>
        <div>
          <img v-show="index === 0" class="img-badge" src="/images/top1.png" alt="">
          <img v-show="index === 1" class="img-badge" src="/images/top2.png" alt="">
          <img v-show="index === 2" class="img-badge" src="/images/top3.png" alt="">
        </div>
      </ElCard>
    </div>
    <ElEmpty v-else description="暂无数据" />
  </div>
</template>

<style lang='scss' scoped>
.img-badge{
  position: absolute;
  top: -23px;
  right: -17px;
  width: 80px;
  height: 80px;
  z-index: 10;
}
</style>
