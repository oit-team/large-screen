<script>
export default {
  name: 'ServiceReservation',
  props: {
    info: Object,
  },
}
</script>

<template>
  <div class="mb-2">
    <div class="grid grid-cols-5 gap-4">
      <div class="item">
        <div>待核销</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.incompleteCount }}</span>
        </div>
      </div>
      <div class="item">
        <div>今日预约人数</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.todayReservation }}</span>
        </div>
      </div>
      <div class="item">
        <div>昨日预约人数</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.yesterdayReservation }}</span>
        </div>
      </div>
      <div class="item">
        <div>当月预约人数</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.theMonth }}</span>
        </div>
      </div>
      <div class="item">
        <div>上月预约人数</div>
        <div class="mt-2">
          <span class="text-blue-500 px-2 font-bold">{{ info.lastMonth }}</span>
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
