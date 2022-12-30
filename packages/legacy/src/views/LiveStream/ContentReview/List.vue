<script>
import { keyBy } from 'lodash-es'
import * as api from '@/api/liveStream'
import CarouselPreview from '@/components/business/CarouselPreview'

const BOOKSTATE = {
  EMPTY: 0,
  REVIEW: 1,
  PASS: 2,
  PLAY: 3,
  PLAYED: 4,
  ERROR: 5,
}

export default {
  components: {
    CarouselPreview,
  },
  data() {
    return {
      search: '',
      navLoading: false,
      brandList: [],
      devId: '', // 设备id
      selectContent: '轮播记录', // 内容展示
      nowTime: new Date(), // 当前时间
      weekList: [],
      bookList: [],
      moreTime: [],
      selectTime: '', // 选中的日期 2022-08-08  年月日
      defaultProps: {
        children: 'devList',
        label: 'brandName',
      },
      carouselMapCache: {},
      BOOKSTATE,
      selectTimeList: [], // 最终提交时的数组
      previewDrawerVisible: false,
      // .....................
      nowHIndex: 0, // 当前选中的  小时
      carouselPreviewId: '',
      showCalen: false,
      hourLoading: false,
      minuteLoading: false,
      brandId: null,
    }
  },
  computed: {
    bookMapList() {
      return this.bookList.map((item) => {
        return {
          startTime: item.startTime.substring(item.startTime.indexOf(' ') + 1, item.startTime.length),
          endTime: item.endTime.substring(item.endTime.indexOf(' ') + 1, item.endTime.length),
        }
      })
    },
    searchList() {
      // const allBrand = {
      //   brandId: '',
      //   brandName: '全部',
      //   countNum: this.brandList
      //     .reduce((accumulator, { countNum }) => accumulator + countNum, 0),
      // }
      //
      // return [allBrand, ...this.brandList]
      //   .filter(item => item.brandName.includes(this.search))
      return this.brandList.filter(item => item.brandName.includes(this.search))
    },
    // moreTimeMap() {
    //   const obj = {}
    //   this.moreTime.forEach((item) => {
    //     obj[item._label] = item
    //   })
    //   return obj
    // },
  },
  watch: {
    selectTime() {
      this.moreTime = []
      this.nowHIndex = 0
      this.getIntervalHourConfig()
    },
    devId() {
      this.getDateToWeek()
    },
    // 获取的分钟  时间段
    moreTime() {
      this.moreTime.forEach((item) => {
        item._configStartTime = item.configStartTime.substring(item.configStartTime.indexOf(' ') + 1, item.configStartTime.length)
        item._configEndTime = item.configEndTime.substring(item.configEndTime.indexOf(' ') + 1, item.configEndTime.length)
        this.$set(item, '_check', false)
        // item._check = false
      })
    },
  },
  created() {
  },
  async activated() {
    await this.getBrandList()
  },
  methods: {
    async getBrandList() {
      this.navLoading = true
      const res = await api.getContextDeviceList()
      this.brandList = res.body.resultList
      this.navLoading = false
    },
    async getDateToWeek() {
      const res = await api.getDateToWeek({
        time: this.nowTime,
        brandId: this.brandId,
      })
      this.weekList = res.body.resultList
      this.selectTime = `${this.nowTime.getFullYear()}-${this.nowTime.getMonth() + 1}-${this.nowTime.getDate()}`
      this.getIntervalHourConfig()
    },
    async getIntervalHourConfig() {
      this.hourLoading = true
      const res = await api.getIntervalHourConfig({
        time: `${this.selectTime} 08:00:00`,
        devId: this.devId,
        brandId: this.brandId,
      }).finally(() => {
        this.hourLoading = false
      })
      this.bookList = res.body.resultList
      this.getAuditBook(this.bookList[0])
    },
    async getAuditBook(data) {
      this.minuteLoading = true
      const res = await api.getAuditBook({
        startTime: data.startTime,
        endTime: data.endTime,
        devId: this.devId,
        brandId: this.brandId,
      }).finally(() => {
        this.minuteLoading = false
      })
      this.moreTime = res.body.resultList
    },
    // 切换设备  左侧设备菜单
    handleNodeClick(data) {
      this.brandId = data?.brandId
      if (data.devId) {
        this.devId = data.devId
      }
    },
    // 点击 左侧 小时
    changeTime(e) {
      this.nowHIndex = e
      this.getAuditBook(this.bookList[e])
    },
    // 提交审核  通过/拒绝
    async updateBookInfo(state, id) {
      if (this.selectTimeList?.length === 0 && !id) return
      if (state === 0) {
        this.$prompt('请限制在30字以内', '拒绝原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(async ({ value }) => {
            if (value.length > 30) return this.$message.error('请输入30字以内的内容')
            if (value && value.length <= 30) {
              await api.updateBookInfo({
                bookIds: id ? [id] : this.selectTimeList,
                bookState: state,
                devId: this.devId,
                remarks: value,
              })
              this.$message.success('提交成功')
              this.selectTimeList = []
              await this.getAuditBook(this.bookList[this.nowHIndex])
            }
          }).catch(async () => {
            this.$message({
              type: 'info',
              message: '取消输入',
            })
            // await this.getAuditBook(this.bookList[this.nowHIndex])
          })
      }
      else {
        await api.updateBookInfo({
          bookIds: id ? [id] : this.selectTimeList,
          bookState: state,
          devId: this.devId,
        })
        this.$message.success('提交成功')
        this.selectTimeList = []
        await this.getAuditBook(this.bookList[this.nowHIndex])
      }
    },
    changeCheck(e, id) {
      if (e) this.selectTimeList.push(id)
      else this.selectTimeList.splice(this.selectTimeList.indexOf(id), 1)
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
    chickCalen() {
      this.showCalen = true
    },
    changePickerTime(e) {
      this.selectTime = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`
      this.getDateToWeek()
    },
  },
}
</script>

<template>
  <div class="flex page-container text-sm">
    <!--    左侧菜单 -->
    <div class="flex flex-col mr-2 mb-2 rounded-lg border brand-nav">
      <div class="flex p-1">
        <el-input v-model="search" clearable placeholder="关键字搜索" />
        <el-tooltip content="刷新" placement="top">
          <el-button class="px-3 ml-1" icon="el-icon-refresh" @click="getBrandList" />
        </el-tooltip>
      </div>
      <div v-loading="navLoading" class="overflow-y-auto flex-1">
        <el-tree
          :data="searchList"
          :props="defaultProps"
          highlight-current
          accordion
          @node-click="handleNodeClick"
        />
      </div>
    </div>

    <!--    右侧内容区 -->
    <div class="flex-1 px-2">
      <div v-if="!devId" class="w-full h-full flex items-center justify-center">
        <el-empty description="暂无数据" />
      </div>
      <div v-else class="w-full h-full flex flex-col">
        <el-radio-group v-model="selectContent">
          <el-radio-button label="轮播记录" />
          <el-radio-button label="内容审核" />
        </el-radio-group>

        <el-divider />

        <div class="w-full flex justify-between mb-5 items-center">
          <el-radio-group v-model="selectTime">
            <el-radio-button
              v-for="(item, index) in weekList"
              :key="index"
              :label="item"
            />
          </el-radio-group>
          <div class="flex items-center px-2" @click="chickCalen">
            <el-date-picker
              v-model="nowTime"
              type="date"
              placeholder="选择日期"
              @change="changePickerTime"
            />
          </div>
        </div>

        <div v-if="bookMapList.length === 0" class="w-full flex-1">
          <el-empty description="暂无数据" />
        </div>
        <div v-else class="w-full flex-1 flex">
          <div v-loading="hourLoading" class="flex flex-col w-1/3 gap-2">
            <div
              v-for="(item, index) in bookMapList"
              :key="index"
              class="cursor-pointer py-2 w-full rounded-md text-center bindHover"
              :class="nowHIndex === index ? 'bg-[#5c96fd] text-white rounded-md' : ''"
              @click="changeTime(index)"
            >
              {{ item.startTime }}-{{ item.endTime }}
            </div>
          </div>

          <el-divider direction="vertical" class="h-full" />

          <div class="w-full">
            <div v-if="moreTime.length === 0" class="w-full text-center">
              <el-empty description="暂无数据" />
            </div>
            <div v-else v-loading="minuteLoading" class="w-full h-full cursor-pointer flex flex-col justify-between pl-4 pt-4">
              <el-timeline>
                <el-timeline-item
                  v-for="(time, id) in moreTime"
                  :key="id"
                  size="large"
                  hide-timestamp
                >
                  <div class="flex items-center">
                    <div class="flex w-1/2 items-center">
                      <el-tag v-if="time.bookState === BOOKSTATE.EMPTY" class="mr-2">
                        待预约
                      </el-tag>
                      <el-tag v-else-if="time.bookState === BOOKSTATE.REVIEW" type="info" class="mr-2">
                        待审核
                      </el-tag>
                      <el-tag v-else-if="time.bookState === BOOKSTATE.PASS" type="success" class="mr-2">
                        已通过
                      </el-tag>
                      <el-tag v-else-if="time.bookState === BOOKSTATE.PLAY" class="mr-2" effect="dark">
                        待播放
                      </el-tag>
                      <el-tag v-else-if="time.bookState === BOOKSTATE.PLAYED" class="mr-2">
                        已播放
                      </el-tag>
                      <el-tag v-else-if="time.bookState === BOOKSTATE.ERROR" type="danger" class="mr-2">
                        发布失败
                      </el-tag>
                      <div :class="time.bookState !== BOOKSTATE.REVIEW ? 'text-[#c0c4cc]' : ''">
                        {{ `${time._configStartTime}-${time._configEndTime}` }} <span>{{ `${time.advertsName || '暂无'}(${time.shopName || '暂无'})` }}</span>
                      </div>
                      <el-checkbox
                        v-if="selectContent === '内容审核'"
                        v-model="time._check"
                        :disabled="time.bookState !== 1"
                        class="mx-2"
                        @change="changeCheck($event, time.bookId)"
                      />
                    </div>

                    <!--  操作部分 -->
                    <div class="flex items-center">
                      <el-button v-if="time.bookState !== BOOKSTATE.EMPTY" type="primary" size="mini" plain @click="previewAds(time)">
                        预览
                      </el-button>

                      <div v-if="time.bookState === BOOKSTATE.REVIEW && selectContent === '内容审核'" class="flex gap-2 ml-4">
                        <el-button type="success" icon="el-icon-check" size="mini" circle @click="updateBookInfo(2, time.bookId)" />
                        <el-button type="danger" icon="el-icon-close" size="mini" circle @click="updateBookInfo(0, time.bookId)" />
                      </div>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>

              <div v-if="selectContent === '内容审核'" class="w-full p-2 box-border">
                <div class="flex justify-around w-full items-center py-4">
                  <el-button type="primary" @click="updateBookInfo(2)">
                    通过
                  </el-button>
                  <el-button type="info" @click="updateBookInfo(0)">
                    拒绝
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  审核预览 -->
    <el-drawer :visible.sync="previewDrawerVisible" title="预览广告" size="500px">
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

<style scoped>
::v-deep .el-timeline-item__wrapper{
    top: -10px;
}
.bindHover:hover{
    background-color: #9cc1fc;
    color: #FFFFFF;
}
</style>
