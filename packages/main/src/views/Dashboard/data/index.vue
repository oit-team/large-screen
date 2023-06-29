<script>
import ServiceReservation from './components/ServiceReservation'
import AttractTraffic from './components/AttractTraffic'
import InterestShopList from './components/InterestShopList'
import TrafficMonit from './components/TrafficMonitEchart'
import InterestTrend from './components/InterestTrendEchart'
import {
  getAppointmentReport,
  getInterested,
  getLotteryInteraction,
  getPeopleTraffic,
  getTopTenProducts,
} from '@/api/dashboard'
export default {
  name: 'Dashboard',
  components: {
    ServiceReservation,
    AttractTraffic,
    TrafficMonit,
    InterestTrend,
    InterestShopList,
  },
  data: () => ({
    isLoading: false,
    appointInfo: {}, // 服务预约
    lotteryInfo: {}, // 拓客引流
    attractTrafficInfo: {}, // 流量监测图表
    interestList: [], // 感兴趣趋势图表
    interestShopList: [],
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
      this.getTopTenProducts()
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

    async getTopTenProducts() {
      const res = await getTopTenProducts().finally(() => this.isLoading = false)
      this.interestShopList = res.body.result
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
          近七天用户感兴趣商品排名
        </div>
        <InterestShopList :info-list="interestShopList" />
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
