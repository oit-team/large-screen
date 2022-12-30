<script>
import dayjs from 'dayjs'
import CarouselListDrawer from '../Carousel/ListPublicDrawer'
import { addBookInfo, getContextDeviceList, getIntegralPay, getIntervalHourConfig, getIntervalMinuteConfig, getShopByIntegralNum, getdateToWeek } from '@/api/publicRelease'

const BOOKSTATE = {
  EMPTY: 0, // 待预定
  REVIEW: 1, // 待审核
  PASS: 2, // 待支付
  PLAY: 3, // 待播放
  PLAYED: 4, // 已播放
  FAIL: 5, // 发布失败
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
    nowHIndex: 0, // 当前选中的 小时
    alipayForm: '',
  }),
  computed: {
    searchList() {
      return [...this.deviceList].filter(item => item.brandName.includes(this.search))
    },
  },
  watch: {
    selectDate(newVal, oldVal) {
      this.selectWeekTime = newVal || dayjs().format('YYYY-MM-DD')
      this.onedayMinutesList = []
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
      this.onedayMinutesList = []
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

    // 点击左侧小时
    changeTime(item, index) {
      this.nowHIndex = index
      this.startTime = item.startTime
      this.endTime = item.endTime
      this.getIntervalMinuteConfig()
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

    // 支付宝支付
    async getUseAliPay() {
      const res = await getIntegralPay({
        userId: sessionStorage.getItem('userId'),
        bookId: this.bookId,
        payType: 1,
        payNum: 2,
        returnNum: 2,
        amount: this.bookPrice,
      })
      document.write(res.body.result)
    },

    // 提交支付
    async toPaySubmit() {
      if (this.paymentRadio === 2) {
        this.getIntegralPay()
      }
      else {
        this.getUseAliPay()
      }
      await this.getIntervalMinuteConfig()
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
        <el-tree :data="searchList" :props="defaultProps" highlight-current @node-click="handleNodeClick" />
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
        <div v-if="onedayHoursList.length > 0" v-loading="hourLoading" class="w-1/3 h-full px-4">
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
        <el-empty v-else class="w-full" :image-size="100" description="暂无数据" />
        <el-divider class="h-full" direction="vertical" />
        <div v-loading="minuteLoading" class="w-2/3">
          <div v-if="onedayMinutesList.length > 0" class="w-full h-full cursor-pointer flex flex-col justify-between pl-4 pt-8">
            <el-timeline>
              <el-timeline-item
                v-for="onedayMinute in onedayMinutesList"
                :key="onedayMinute.bookConnfigId"
                size="normal"
                hide-timestamp
              >
                <div class="flex items-center">
                  <div class="flex items-center">
                    <el-tag v-if="onedayMinute.bookState === BOOKSTATE.EMPTY" type="primary" class="mr-2">
                      待预约
                    </el-tag>
                    <el-tag v-else-if="onedayMinute.bookState === BOOKSTATE.REVIEW" type="info" class="mr-2">
                      待审核
                    </el-tag>
                    <el-tag v-else-if="onedayMinute.bookState === BOOKSTATE.PASS" type="warning" class="mr-2">
                      待支付
                    </el-tag>
                    <el-tag v-else-if="onedayMinute.bookState === BOOKSTATE.PLAY" type="primary" class="mr-2">
                      未播放
                    </el-tag>
                    <el-tag v-else-if="onedayMinute.bookState === BOOKSTATE.PLAYED" type="success" class="mr-2">
                      已播放
                    </el-tag>
                    <el-tag v-else-if="onedayMinute.bookState === BOOKSTATE.FAIL" type="danger" class="mr-2">
                      发布失败
                    </el-tag>
                    <div :class="onedayMinute.isAfter ? 'pastTime' : 'futureTime'">
                      {{ `${onedayMinute.configStartTime.slice(11, 16)}-${onedayMinute.configEndTime.slice(11, 16)}` }} <span v-if="onedayMinute.advertsName && onedayMinute.shopName ">{{ `${onedayMinute.advertsName}(${onedayMinute.shopName})` }}</span>
                    </div>
                    <span v-if="onedayMinute.bookState === BOOKSTATE.REVIEW" :class="onedayMinute.isAfter ? 'pastTime' : 'futureTime'" class="ml-6 text-xs">{{ onedayMinute.remarks }}</span>
                    <el-button v-if="onedayMinute.bookState === BOOKSTATE.EMPTY" :disabled="onedayMinute.isAfter" class="ml-4 appointmentTime" type="text" size="mini" @click="openListDrawer(onedayMinute.bookConnfigId)">
                      预约
                    </el-button>
                    <el-button v-if="onedayMinute.isPay === BOOKSTATE.REVIEW && onedayMinute.bookState === BOOKSTATE.PASS" :disabled="onedayMinute.isAfter" class="ml-4 payment" type="text" size="mini" @click="handleClickPay(onedayMinute)">
                      去支付
                    </el-button>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <el-empty v-else class="w-full h-full" :image-size="100" description="暂无数据" />
        </div>
      </div>
    </div>
    <carousel-list-drawer ref="carouselList" @submit="assignAds" />

    <el-drawer title="支付" :visible.sync="paymentDrawer" size="40%">
      <div class="p-4">
        <div class="flex items-center">
          <span>请选择支付方式：</span>
          <el-radio-group v-model="paymentRadio" class="flex radio items-center">
            <el-radio :label="1" border class="flex">
              <div class="imageAlipay">
                <el-image
                  width="50"
                  height="20"
                  fit="cover"
                  :src="require('../Carousel/alipay.png')"
                  mode="scaleToFill"
                />
              </div>
              <div class="imageRecommed">
                <el-image
                  width="50"
                  height="20"
                  fit="cover"
                  :src="require('../Carousel/recommend.png')"
                  mode="scaleToFill"
                />
              </div>
            </el-radio>
            <el-radio :label="2" border class="flex">
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
        <div v-if="payTotalIntegral > integralNumber" class="text-sm text-red-400">
          (*剩余积分不足以兑换)
        </div>
        <div class="my-4">
          支付金额：{{ bookPrice }}
        </div>
        <el-button
          :disabled="paymentRadio === 2 && payTotalIntegral > integralNumber"
          :loading="payLoading"
          type="primary"
          size="mini"
          @click="toPaySubmit('form')"
        >
          立即支付
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<style lang='scss' scoped>
::v-deep {
  .el-timeline-item__wrapper{
    top: -10px;
  }
  .el-button--text{
    text-decoration: underline;
  }
  .el-button--text.payment{
    color: #E6A23C;
  }
  .el-radio__label .recommend{
    font-size: 1px;
  }
  .el-radio__label .imageAlipay .el-image{
    position: relative;
    top: -8px;
  }
  .el-radio__label .imageAlipay .el-image img{
   width: 80px;
  }
  .el-radio .el-radio__label{
    display: flex;
  }
  .el-radio__label .imageRecommed .el-image{
    position: relative;
    top: -3px;
    margin-left: 10px;
  }
  .el-radio__label .imageRecommed .el-image img{
   width: 30px;
  }
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
