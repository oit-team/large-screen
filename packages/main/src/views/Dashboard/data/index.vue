<script>
import ServiceReservation from './components/ServiceReservation'
import AttractTraffic from './components/AttractTraffic'
import TrafficMonit from './components/TrafficMonitEchart'
import InterestTrend from './components/InterestTrendEchart'
import { getAppointmentReport, getInterested, getLotteryInteraction, getPeopleTraffic } from '@/api/dashboard'
export default {
  name: 'Dashboard',
  components: {
    ServiceReservation,
    AttractTraffic,
    TrafficMonit,
    InterestTrend,
  },
  data: () => ({
    isLoading: false,
    isAppointLoading: false,
    isPeopleTrafficLoading: false,
    isInterestedLoading: false,
    isLotteryLoading: false,
    appointInfo: {}, // 服务预约
    lotteryInfo: {}, // 拓客引流
    attractTrafficInfo: {}, // 流量监测图表
    interestList: [], // 感兴趣趋势图表
    dateTime: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
  }),
  watch: {
    dateTime(val) {
      if (!val) {
        return this.dateTime = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
      }
      this.getData()
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.isLoading = true
      this.getPeopleTraffic()
      this.getInterested()
      this.getLotteryInteraction()
      this.getAppointmentReport()
    },

    async getPeopleTraffic() {
      const res = await getPeopleTraffic({
        dateTime: this.dateTime,
      }).finally(() => this.isLoading = false)
      this.attractTrafficInfo = res.body
    },

    async getInterested() {
      const res = await getInterested({
        dateTime: this.dateTime,
      }).finally(() => this.isLoading = false)
      this.interestList = res.body.resultList
    },

    async getLotteryInteraction() {
      const res = await getLotteryInteraction({
        dateTime: this.dateTime,
      }).finally(() => this.isLoading = false)
      this.lotteryInfo = res.body
    },

    async getAppointmentReport() {
      const res = await getAppointmentReport({
        dateTime: this.dateTime,
      }).finally(() => this.isLoading = false)
      this.appointInfo = res.body.result
    },
  },
}
</script>

<template>
  <div class="p-2 flex flex-col overflow-hidden">
    <div class="w-full flex justify-center pb-2 items-center shadow rounded">
      <span class="text-gray-500">日期：</span>
      <ElDatePicker
        v-model="dateTime"
        size="small"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      />
    </div>
    <div v-loading="isLoading" class="flex-1 mt-2 flex flex-col overflow-y-auto">
      <div>
        <div class="font-bold">
          服务预约
        </div>
        <ServiceReservation :info="appointInfo" />
      </div>
      <div>
        <div class="font-bold">
          拓客引流
        </div>
        <AttractTraffic :info="lotteryInfo" />
      </div>
      <div>
        <div class="font-bold">
          近七天流量监测
        </div>
        <TrafficMonit :info="attractTrafficInfo" />
      </div>
      <div>
        <div class="font-bold">
          近七天用户感兴趣趋势
        </div>
        <InterestTrend :info-list="interestList" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
