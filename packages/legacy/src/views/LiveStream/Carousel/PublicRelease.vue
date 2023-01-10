<script>
import dayjs from 'dayjs'
import { keyBy } from 'lodash-es'
import CarouselListDrawer from '../Carousel/ListPublicDrawer'
import * as api from '@/api/liveStream'
import CarouselPreview from '@/components/business/CarouselPreview'
import toPay from '@/assets/icons/toPay.svg'
import toApprove from '@/assets/icons/toApprove.svg'
import { addBookInfo, getContextDeviceList, getIntegralPay, getIntervalHourConfig, getIntervalMinuteConfig, getShopByIntegralNum, getdateToWeek } from '@/api/publicRelease'

const BOOKSTATE = {
  EMPTY: 0, // 待预定
  REVIEW: 1, // 待审核
  PASS: 2, // 待支付
  PLAY: 3, // 待播放
  PLAYED: 4, // 已播放
  FAIL: 5, // 发布失败
}

export const TIME_LINE_STYLE = {
  [BOOKSTATE.EMPTY]: {
    icon: 'el-icon-time',
    color: '#409EFF',
    type: 'el',
  },
  [BOOKSTATE.REVIEW]: {
    icon: toApprove,
    color: '#909399',
    type: 'svg',
  },
  [BOOKSTATE.PASS]: {
    icon: toPay,
    color: '#E6A23C',
    type: 'svg',
  },
  [BOOKSTATE.PLAY]: {
    icon: 'el-icon-video-play',
    color: '#409EFF',
    type: 'el',
  },
  [BOOKSTATE.PLAYED]: {
    icon: 'el-icon-circle-check',
    color: '#67C23A',
    type: 'el',
  },
  [BOOKSTATE.FAIL]: {
    icon: 'el-icon-warning-outline',
    color: '#F56C6C',
    type: 'el',
  },
}

export default {
  name: 'PublicRelease',
  components: {
    CarouselListDrawer,
    CarouselPreview,
  },

  data: () => ({
    BOOKSTATE,
    TIME_LINE_STYLE,
    paymentDrawer: false,
    navLoading: false,
    minuteLoading: false,
    payLoading: false,
    hourLoading: false,
    previewDrawerVisible: false,

    carouselMapCache: {},
    carouselPreviewId: '',
    checkList: [],
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
      this.nowHIndex = 0
      this.getdateToWeek()
      this.getIntervalHourConfig()
    },
  },
  mounted() {
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
        this.getdateToWeek()
      }
    },

    // 获取小时
    async getIntervalHourConfig() {
      this.onedayMinutesList = []
      this.nowHIndex = 0
      this.hourLoading = true
      const res = await getIntervalHourConfig({
        time: `${this.selectWeekTime} 08:00:00`,
        devId: this.brandIdNav,
        brandId: this.brandId,
      }).finally(() => { this.hourLoading = false })

      this.onedayHoursList = res.body.resultList.map((item) => {
        item.isAfter = dayjs().isAfter(dayjs(item.endTime))
        return item
      })
      const initOneDayHour = this.onedayHoursList
      if (this.nowHIndex === 0) {
        this.getIntervalMinuteConfig(initOneDayHour[0])
      }
    },

    // 点击左侧小时
    changeTime(item, index) {
      this.nowHIndex = index
      this.startTime = item.startTime
      this.endTime = item.endTime
      this.getIntervalMinuteConfig(item)
    },

    // 获取分钟
    async getIntervalMinuteConfig(item) {
      this.minuteLoading = true
      const res = await getIntervalMinuteConfig({
        startTime: item.startTime,
        endTime: item.endTime,
        devId: this.brandIdNav,
        brandId: this.brandId,
      }).finally(() => this.minuteLoading = false)

      this.onedayMinutesList = res.body.resultList.map((item) => {
        item.isAfter = dayjs().isAfter(dayjs(item.configStartTime))
        this.$set(item, '_check', false)
        this.$set(item, '_open', false)
        if (item?.bookList) item.bookList.shift()
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
        bookIds: this.checkList.length ? this.checkList : [this.bookConnfigId],
        advertsId: advId,
        devId: this.brandIdNav,
        brandId: this.brandId,
      }).then(() => {
        this.$message.success('预约成功！')
        this.$refs.carouselList.close()
        this.getIntervalMinuteConfig(this.onedayHoursList[this.nowHIndex])
        this.checkList = []
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'warning',
        })
      }).finally(() => {
        this.minuteLoading = false
      })
    },

    // 点击去支付按钮
    async handleClickPay(onedayMinute) {
      this.paymentDrawer = true
      this.bookId = onedayMinute.bookId
      this.bookPrice = onedayMinute.bookPrice
      await this.getShopByIntegralNum()
    },

    previewAds(item) {
      this.previewDrawerVisible = true
      const { advertsId } = item
      this.carouselPreviewId = advertsId
      !this.carouselMapCache[advertsId] && api.getAdvertsById({
        advId: advertsId,
      }).then((res) => {
        const item = res.body
        item.rotationRules = JSON.parse(item.rotationRules)
        item.resEntityMap = keyBy(item.resEntityList, 'id')
        this.$set(this.carouselMapCache, advertsId, item)
      })
    },

    changeCheck(e, id) {
      if (e) this.checkList.push(id)
      else this.checkList.splice(this.checkList.indexOf(id), 1)
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
      await this.getIntervalMinuteConfig(this.onedayHoursList[this.nowHIndex])
    },

    async batchAppoint() {
      if (this.checkList?.length === 0) {
        this.$message.warning('请至少勾选一项！')
        return
      }

      await this.openListDrawer()
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
    <div v-if="weekTimeList.length > 0" class="w-full flex flex-col">
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
        <div v-if="onedayHoursList.length > 0" v-loading="hourLoading" class="w-1/4 h-full px-2">
          <div
            v-for="(item, index) in onedayHoursList"
            :key="index"
            class="cursor-pointer p-2 box-border w-full rounded-md text-center bindHover"
            :class="nowHIndex === index ? 'bg-[#5c96fd] text-white rounded-md' : ''"
            @click="changeTime(item, index)"
          >
            {{ `${item.startTime.slice(11)}` }}
            <span class="text-xs">（待预定：<span :class="nowHIndex === index ? 'text-white' : 'text-[#409EFF]'">{{ `${item.bookStateNum}` }}）</span></span>
          </div>
        </div>
        <el-empty v-else class="w-full" :image-size="100" description="暂无数据" />
        <el-divider class="h-full" direction="vertical" />
        <div v-loading="minuteLoading" class="w-full">
          <div v-if="onedayMinutesList.length > 0" class="w-full h-full cursor-pointer flex flex-col pl-4 pt-8">
            <el-timeline>
              <el-timeline-item
                v-for="onedayMinute in onedayMinutesList"
                :key="onedayMinute.bookConnfigId"
                size="large"
                hide-timestamp
              >
                <template #dot>
                  <i v-if="TIME_LINE_STYLE[onedayMinute.bookState].type === 'el'" :class="TIME_LINE_STYLE[onedayMinute.bookState].icon" :style="{ backgroundColor: TIME_LINE_STYLE[onedayMinute.bookState].color, color: '#fff', borderRadius: '50%' }" />
                  <img v-if="TIME_LINE_STYLE[onedayMinute.bookState].type === 'svg'" :src="TIME_LINE_STYLE[onedayMinute.bookState].icon" :style="{ backgroundColor: TIME_LINE_STYLE[onedayMinute.bookState].color }" class="w-[24px] h-[24px]">
                </template>
                <div class="w-full">
                  <div class="flex justify-between items-center w-4/5">
                    <div class="flex items-center">
                      <div class="flex items-center">
                        <el-checkbox
                          v-model="onedayMinute._check"
                          :disabled="onedayMinute.bookState !== 0 || onedayMinute.isAfter"
                          class="mx-2"
                          @change="changeCheck($event, onedayMinute.bookConnfigId)"
                        />
                        <el-tag v-if="onedayMinute.bookState === BOOKSTATE.EMPTY" type="primary" class="mr-2">
                          待预定
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
                          {{ `${onedayMinute.configStartTime.slice(11, 16)}-${onedayMinute.configEndTime.slice(11, 16)}` }}
                          (<span :class="onedayMinute.isAfter ? 'pastTime text-xs' : 'futureMoney  text-xs'">￥{{ `${onedayMinute.bookPrice}` }}</span>)
                          <span v-if="onedayMinute.advertsName && onedayMinute.shopName " class="ml-4">{{ `${onedayMinute.advertsName}(${onedayMinute.shopName})` }}</span>
                        </div>
                        <span v-if="onedayMinute.bookState === BOOKSTATE.REVIEW" :class="onedayMinute.isAfter ? 'pastTime' : 'futureTime'" class="ml-6 text-xs">{{ onedayMinute.remarks }}</span>
                        <el-button v-if="onedayMinute.bookState === BOOKSTATE.EMPTY" :disabled="onedayMinute.isAfter" class="ml-4" type="text" size="mini" @click="openListDrawer(onedayMinute.bookConnfigId)">
                          预约
                        </el-button>
                        <el-button v-if="onedayMinute.isPay === BOOKSTATE.REVIEW && onedayMinute.bookState === BOOKSTATE.PASS" :disabled="onedayMinute.isAfter" class="ml-4 payment" type="text" size="mini" @click="handleClickPay(onedayMinute)">
                          去支付
                        </el-button>
                        <el-button v-if="onedayMinute.bookState > BOOKSTATE.EMPTY" class="ml-4" type="text" size="mini" @click="previewAds(onedayMinute)">
                          预览
                        </el-button>
                      </div>
                    </div>

                    <div class="px-8 py-2" @click="onedayMinute._open = !onedayMinute._open">
                      <i v-if="onedayMinute._open" class="el-icon-arrow-down" />
                      <i v-else class="el-icon-arrow-right" />
                    </div>
                  </div>

                  <div v-if="onedayMinute.bookList?.length > 0 && onedayMinute._open" class="w-full">
                    <div
                      v-for="(book, index) in onedayMinute.bookList"
                      :key="index"
                      class="pl-16 gap-x-2 flex items-center py-2"
                    >
                      <div class="w-full flex items-center">
                        <div class="flex items-center gap-4">
                          <div :style="{ color: TIME_LINE_STYLE[book.bookState].color }">
                            {{ book.bookstateName }}
                          </div>
                          <div>
                            {{ book.advertsName }}({{ book.shopName }})
                          </div>
                          <div>{{ book.createTime }}</div>
                        </div>
                        <el-button class="ml-4" type="text" size="mini" @click="previewAds(book)">
                          预览
                        </el-button>
                      </div>
                      <el-divider v-if="index !== onedayMinute.bookList.length - 1" />
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>

            <div class="w-full p-2 box-border">
              <div class="w-full items-center py-4">
                <el-button type="primary" size="medium" @click="batchAppoint()">
                  批量预约
                </el-button>
                <!-- <el-button type="info" size="medium" @click="cancelAppoint()">
                  取消
                </el-button> -->
              </div>
            </div>
          </div>
          <el-empty v-else class="w-full h-full flex justify-center items-center" :image-size="100" description="暂无数据" />
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无数据" class="w-full h-full flex justify-center items-center" />
    <carousel-list-drawer ref="carouselList" @submit="assignAds" />

    <el-drawer title="支付" :visible.sync="paymentDrawer" size="40%">
      <div class="px-4">
        <div>
          支付金额：￥{{ bookPrice }}
        </div>
        <div class="my-4">
          <div class="my-2">
            支付方式：
          </div>
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
              <div class="imageIntegral">
                <el-image
                  width="50"
                  height="20"
                  fit="cover"
                  :src="require('../Carousel/integral.jpg')"
                  mode="scaleToFill"
                />
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        <div v-if="paymentRadio === 2" class="my-4 flex">
          <div>店铺总积分：{{ integralNumber }}</div>
          <div class="ml-4">
            支付积分：{{ payTotalIntegral }}
          </div>
        </div>
        <div v-if="payTotalIntegral > integralNumber && paymentRadio === 2" class="text-sm text-red-400 mb-2">
          (*剩余积分不足以兑换)
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
    <!--  审核预览 -->
    <el-drawer :visible.sync="previewDrawerVisible" title="预览广告" size="600px">
      <div v-loading="!carouselMapCache[carouselPreviewId]" class="h-full">
        <carousel-preview
          v-if="previewDrawerVisible && carouselMapCache[carouselPreviewId]"
          :option="carouselMapCache[carouselPreviewId].rotationRules"
          :file-map="carouselMapCache[carouselPreviewId].resEntityMap"
        />
      </div>
    </el-drawer>
  </div>
</template>

<style lang='scss' scoped>
::v-deep {
  .el-timeline-item__wrapper{
    top: -10px;
  }
  .el-timeline-item__dot{
    position: absolute;
    top: -6px;
    left: -6px;
  }
  .el-timeline-item__dot img{
    border-radius: 50%;
  }
  .el-timeline-item__dot i{
    font-size: 24px;
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
  .el-radio__label .imageIntegral .el-image{
    position: relative;
    top: -12px;
  }
  .el-radio__label .imageIntegral .el-image img{
   width: 120px;
  }

  .el-radio .el-radio__label{
    display: flex;
  }
  .el-radio__label .imageRecommed .el-image{
    position: relative;
    top: -3px;
    margin-left: 20px;
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
.futureMoney{
  color: red;
}
</style>
