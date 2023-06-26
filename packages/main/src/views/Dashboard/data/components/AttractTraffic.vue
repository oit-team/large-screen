<script>
export default {
  name: 'AttractTraffic',
  props: {
    info: Object,
  },
}
</script>

<template>
  <div class="mb-2">
    <div class="grid grid-cols-5 gap-4">
      <div class="item">
        <div>每日抽奖</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.dailyLottery }}</span>
        </div>
      </div>
      <div class="item">
        <div>活动抽奖</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.activityLottery }}</span>
        </div>
      </div>
      <div class="item">
        <div>每日抽奖核销</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.dailyLotteryVerification }}</span>
        </div>
      </div>
      <div class="item">
        <div>活动核销</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.activityLotteryVerification }}</span>
        </div>
      </div>
      <div class="item">
        <div>今日拓客</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ Number(info.activityLotteryVerification) + Number(info.dailyLotteryVerification) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  .item{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border: 1px solid #eee;
    background-color: rgb(240, 248, 251);
  }
</style>
