<script>
import dayjs from 'dayjs'
import CarouselListDrawer from '../Carousel/ListDrawer'
import { addBookInfo, getContextDeviceList, getIntegralPay, getIntervalHourConfig, getIntervalMinuteConfig, getShopByIntegralNum, getdateToWeek } from '@/api/publicRelease'

const BOOKSTATE = {
  EMPTY: 0, // 待预定
  REVIEW: 1, // 待审核
  PASS: 2, // 待支付
  PLAY: 3, // 待播放
  PLAYED: 4, // 已播放
}

export default {
  name: 'PublicRelease',
  components: {
    CarouselListDrawer,
  },

  data: () => ({
    BOOKSTATE,
    paymentDrawer: false,
    navLoading: false,
    minuteLoading: false,
    payLoading: false,
    hourLoading: false,

    deviceList: [],
    weekTimeList: [],
    onedayHoursList: [],
    onedayMinutesList: [],
    newOnedayMinutesList: [],
    selectWeekTime: dayjs().format('YYYY-MM-DD'),
    search: '',
    selectDate: '',
    paymentRadio: 1,
    brandId: null,
    brandIdNav: null, // 设备id
    bookConnfigId: null,
    bookId: null,
    bookPrice: null,
    integralNumber: null,
    payTotalIntegral: null,
    defaultProps: {
      children: 'devList',
      label: 'brandName',
    },
    nowHIndex: 0, // 当前选中的  小时
  }),
  computed: {
    searchList() {
      return [...this.deviceList]
        .filter(item => item.brandName.includes(this.search))
    },
  },
  watch: {
    selectDate(newVal, oldVal) {
      this.selectWeekTime = newVal || dayjs().format('YYYY-MM-DD')
      this.getdateToWeek()
      this.getIntervalHourConfig()
    },
  },
  mounted() {
    this.getdateToWeek()
    this.getContextDeviceList()
  },
  methods: {
    // 获取一周日期
    async getdateToWeek() {
      const res = await getdateToWeek({
        time: this.selectWeekTime,
        brandId: this.brandId,
      })
      this.weekTimeList = res.body.resultList
    },

    // 获取设备列表
    async getContextDeviceList() {
      this.navLoading = true
      const res = await getContextDeviceList().finally(() => {
        this.navLoading = false
      })
      this.deviceList = res.body.resultList
    },

    // 点击左侧菜单树
    handleNodeClick(data = {}) {
      console.log(data)
      // 商场
      this.brandId = data?.brandId
      // 店铺
      if (data?.devId) {
        this.brandIdNav = data.devId
        this.getIntervalHourConfig()
      }
    },

    // 获取小时
    async getIntervalHourConfig() {
      this.hourLoading = true
      const res = await getIntervalHourConfig({
        time: `${this.selectWeekTime} 08:00:00`,
        devId: this.brandIdNav,
      }).finally(() => { this.hourLoading = false })

      this.onedayHoursList = res.body.resultList.map((item) => {
        item.isAfter = dayjs().isAfter(dayjs(item.endTime))
        return item
      })
    },

    // 获取分钟
    async getIntervalMinuteConfig() {
      this.minuteLoading = true
      const res = await getIntervalMinuteConfig({
        startTime: this.startTime,
        endTime: this.endTime,
        devId: this.brandIdNav,
        brandId: this.brandId,
      }).finally(() => this.minuteLoading = false)

      this.onedayMinutesList = res.body.resultList.map((item) => {
        item.isAfter = dayjs().isAfter(dayjs(item.configStartTime))
        return item
      })
    },

    // 手风琴点击改变
    // changeCollapse(data) {
    //   if (data) {
    //     const [start, end] = data?.split(',')
    //     this.startTime = start
    //     this.endTime = end
    //     this.getIntervalMinuteConfig()
    //   }
    // },

    // 点击 左侧 小时
    changeTime(item, index) {
      console.log(item)
      this.nowHIndex = index
      this.startTime = item.startTime
      this.endTime = item.endTime
      this.getIntervalMinuteConfig()
    },

    // 点击预定按钮 打开广告抽屉
    openListDrawer(bookConnfigId) {
      this.$refs.carouselList.open()
      this.bookConnfigId = bookConnfigId
    },

    // 设置广告确认
    async assignAds({ advId }) {
      this.minuteLoading = true
      addBookInfo({
        bookIds: [{
          bookConnfigId: this.bookConnfigId,
          advertsId: advId,
        }],
        devId: this.brandIdNav,
        brandId: this.brandId,
      }).then(() => {
        this.$message.success('设置成功')
        this.$refs.carouselList.close()
        this.getIntervalMinuteConfig()
      }).finally(() => { this.minuteLoading = false })
    },

    // 点击去支付按钮
    async handleClickPay(onedayMinute) {
      this.paymentDrawer = true
      this.bookId = onedayMinute.bookId
      this.bookPrice = onedayMinute.bookPrice
      await this.getShopByIntegralNum()
    },

    // 获取积分数
    async getShopByIntegralNum() {
      const res = await getShopByIntegralNum({
        payIntegral: this.bookPrice,
      })
      this.integralNumber = res.body.integralNumber
      this.payTotalIntegral = res.body.payTotalIntegral
    },

    // 积分支付
    async getIntegralPay() {
      this.payLoading = true
      await getIntegralPay({
        bookId: this.bookId,
        payType: 2,
      }).finally (() => { this.payLoading = false })
      this.paymentDrawer = false
      this.$message({ message: '支付成功！', type: 'success' })
    },

    // 提交支付
    toPaySubmit() {
      if (this.paymentRadio === 2) {
        this.getIntegralPay()
      }
      this.getIntervalMinuteConfig()
    },
  },

}
</script>

<template>
  <div class="flex page-container text-sm">
    <div class="flex flex-col mr-2 mb-2 rounded-lg border brand-nav">
      <div class="flex p-1">
        <el-input v-model="search" clearable placeholder="关键字搜索" />
        <el-tooltip content="刷新" placement="top">
          <el-button class="px-3 ml-1" icon="el-icon-refresh" @click="getContextDeviceList" />
        </el-tooltip>
      </div>
      <div v-loading="navLoading" class="overflow-y-auto flex-1">
        <el-tree ref="brandTree" :data="searchList" :props="defaultProps" highlight-current @node-click="handleNodeClick" />
      </div>
    </div>
    <div class="w-full flex flex-col">
      <div class="flex">
        <div class="w-5/6">
          <el-radio-group v-model="selectWeekTime" @change="getIntervalHourConfig">
            <el-radio-button v-for="(item, index) in weekTimeList" :key="index" :label="item" />
          </el-radio-group>
        </div>
        <div class="w-1/6">
          <el-date-picker
            v-model="selectDate"
            value-format="yyyy-MM-dd"
            type="date"
            class="w-full"
            placeholder="请选择日期"
          />
        </div>
      </div>
      <div class="flex-1 p-2 py-8 flex">
        <div v-loading="hourLoading" class="w-1/3 px-4">
          <div
            v-for="(item, index) in onedayHoursList"
            :key="index"
            class="cursor-pointer py-2 w-full rounded-md text-center bindHover"
            :class="nowHIndex === index ? 'bg-[#5c96fd] text-white rounded-md' : ''"
            @click="changeTime(item, index)"
          >
            {{ item.startTime.slice(11) }}-{{ item.endTime.slice(11) }}
          </div>
        </div>
        <el-divider class="h-full" direction="vertical" />
        <div v-loading="minuteLoading" class="w-2/3 pt-8">
          <div class="w-full h-full cursor-pointer flex flex-col justify-between pl-4 pt-4">
            <el-timeline>
              <el-timeline-item
                v-for="onedayMinute in onedayMinutesList"
                :key="onedayMinute.bookConnfigId"
                size="large"
                hide-timestamp
              >
                <div class="flex items-center">
                  <div class="flex items-center">
                    <el-tag v-if="onedayMinute.bookState === 1" type="primary" plain class="mr-2">
                      {{ onedayMinute.remarks }}
                    </el-tag>
                    <el-tag v-if="onedayMinute.bookState !== 1" type="primary" plain class="mr-2">
                      {{ onedayMinute.bookstateName }}
                    </el-tag>
                    <div :class="onedayMinute.bookState !== 0 ? 'text-[#c0c4cc]' : ''">
                      {{ `${onedayMinute.configStartTime.slice(11, 16)}-${onedayMinute.configEndTime.slice(11, 16)}` }} <span v-if="onedayMinute.advertsName && onedayMinute.shopName ">{{ `${onedayMinute.advertsName}(${onedayMinute.shopName})` }}</span>
                    </div>
                    <el-button v-if="onedayMinute.bookState === 0" :disabled="onedayMinute.isAfter" class="ml-4" type="primary" plain size="mini" @click="openListDrawer(onedayMinute.bookConnfigId)">
                      预约
                    </el-button>
                    <el-button v-if="onedayMinute.isPay === 1 && onedayMinute.bookState === 2" class="ml-4" type="primary" plain size="mini" @click="handleClickPay(onedayMinute)">
                      去支付
                    </el-button>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
    <carousel-list-drawer ref="carouselList" @submit="assignAds" />

    <el-drawer title="支付" :visible.sync="paymentDrawer" size="30%">
      <div class="p-4">
        <div>
          <span>请选择支付方式：</span>
          <el-radio-group v-model="paymentRadio">
            <el-radio :label="1">
              支付宝
            </el-radio>
            <el-radio :label="2">
              积分兑换
            </el-radio>
          </el-radio-group>
        </div>
        <div v-if="paymentRadio === 2" class="mt-4 flex">
          <div>店铺总积分：{{ integralNumber }}</div>
          <div class="ml-4">
            支付积分：{{ payTotalIntegral }}
          </div>
        </div>
        <div class="my-4">
          支付金额：{{ bookPrice }}
        </div>
        <el-button :loading="payLoading" type="primary" size="mini" @click="toPaySubmit('form')">
          {{ paymentRadio === 2 ? '提交' : '下一步' }}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<style lang='scss' scoped>
::v-deep .el-timeline-item__wrapper{
    top: -10px;
}
.bindHover:hover{
    background-color: #9cc1fc;
    color: #FFFFFF;
}
.pastTime{
  color: #ccc;
}
.futureTime{
  color: #303133;
}
</style>
