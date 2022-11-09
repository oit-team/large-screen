<script>
import { keyBy } from 'lodash-es'
import CarouselListDrawer from '../Carousel/ListDrawer'
import DeviceTable from './Table'
import DEV_STATE from './DEV_STATE'
import * as api from '@/api/liveStream'
import { registerRefMethods } from '@/utils/helper'
import { getAdvertsList, upDevAdverts } from '@/api/liveStream'
import CarouselPreview from '@/components/business/CarouselPreview'

export default {
  name: 'DeviceList',

  components: {
    DeviceTable,
    CarouselListDrawer,
    CarouselPreview,
  },

  data: () => ({
    form: {
      brandIdAllot: '',
      devTypeId: '',
    },
    devConfig: {},
    brandList: [],
    selected: [],
    search: '',
    brandIdNav: '',
    navLoading: false,
    brandDrawerVisible: false,
    areaDrawerVisible: false,
    devInfoDrawerVisible: false,
    previewDrawerVisible: false,
    devInfoOptions: [],
    assignFormRules: {
      brandIdAllot: [{
        required: true,
        message: '请至少选择一个品牌',
        trigger: 'change',
      }],
      devTypeId: [{
        required: true,
        message: '请至少选择一个设备类型',
        trigger: 'change',
      }],
    },
    carouselMapCache: {},
    carouselPreviewId: '',
  }),

  computed: {
    searchList() {
      const allBrand = {
        brandId: '',
        brandName: '全部',
        countNum: this.brandList
          .reduce((accumulator, { countNum }) => accumulator + countNum, 0),
      }

      return [allBrand, ...this.brandList]
        .filter(item => item.brandName.includes(this.search))
    },
    tablePageOption() {
      return {
        actions: arr => this.btnActions.concat(arr),
        table: {
          selection: true,
          selectable: row => row.devState !== DEV_STATE.SCRAP,
          actions: {
            buttons: [{
              tip: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              click: this.delDeviceInfo,
              disabled: ({ row }) => row.devState !== DEV_STATE.SCRAP,
              option: {
                type: 'delete',
                field: 'devCode',
              },
            }],
          },
        },
      }
    },
    btnActions() {
      return [
        {
          auth: true,
          name: '分配品牌',
          type: 'primary',
          click: () => {
            if (this.$refs.page.checkSelected())
              this.brandDrawerVisible = true
          },
        },
        {
          name: '分配店铺/区域',
          type: 'primary',
          click: () => {
            if (this.$refs.page.checkSelected())
              this.areaDrawerVisible = true
          },
        },
        {
          slot: 'ads',
        },
        {
          name: '设备报废',
          type: 'danger',
          click: () => {
            this.$refs.page.checkSelected()
            && this.$confirm('确定要将所选设备报废吗？', '警告', { type: 'error' })
              .then(() => this.updateSelectedDeviceInfo({ devState: DEV_STATE.SCRAP }))
          },
        },
      ].filter(item => !item.auth || sessionStorage.brandList !== undefined) // 权限验证，brandList不存在则视为无权限
    },
  },

  activated() {
    this.getBrandList()
    this.getDevTypeInfo()
    this.$refs.page.loadData()
  },

  methods: {
    ...registerRefMethods('page', ['updateSelectedDeviceInfo']),
    // 获取品牌导航数据
    async getBrandList() {
      this.navLoading = true
      const res = await api.getBrandIdDevCount()
      this.brandList = res.body.resultList
      this.navLoading = false
    },
    async delDeviceInfo({ row: { devId } }) {
      await api.delDeviceInfo(devId)
      this.getBrandList()
      this.$refs.page.loadData()
    },
    async assignBrand() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        await this.updateSelectedDeviceInfo({
          brandId: this.form.brandIdAllot,
          devType: this.form.devTypeId,
        })
        this.getBrandList()
        this.brandDrawerVisible = false
      })
    },
    async assignAreaOrShop() {
      if (!this.$refs.areaOrShop.checkSelected()) return

      const { data: selected } = this.$refs.areaOrShop.getCheckedNodes()[0]
      await this.updateSelectedDeviceInfo({
        belongingId: selected.id,
        belongingType: selected.isShop,
      })
      this.areaDrawerVisible = false
    },
    async getDevTypeInfo() {
      const res = await api.getDevTypeInfo()

      const formatData = (data) => {
        if (!data) return
        return data.map((item) => {
          const children = formatData(item.modelList)
          const result = {
            label: item.manufacturerName || item.devName,
            value: (children ? `manufacturerId-${item.manufacturerId}` : '') || item.Id,
          }
          if (children) result.children = children
          return result
        })
      }

      this.devInfoOptions = formatData(res.body.resultList)
    },
    selectionChange(e) {
      this.selected = e || []
      if (!e.length) return
      this.devConfig = e[0].devConfig
    },
    openAssignAds() {
      if (this.$refs.page.checkSelected())
        this.$refs.carouselList.open()
    },
    async assignAds({ advId }) {
      if (!this.$refs.page.checkSelected()) return

      if (advId === 0) {
        await this.$confirm('确定要将所选设备恢复成默认广告吗？', '提示', {
          type: 'warning',
        })
      }

      upDevAdverts({
        advertsId: advId,
        devIds: this.selected.map(item => item.devId),
      }).then((res) => {
        this.$message.success('广告设置成功')
        this.selected[0].advertsId = advId
        this.$refs.carouselList.close()
      })
    },
    previewAds() {
      if (!this.$refs.page.checkSelected()) return
      const [{ advertsId }] = this.selected
      this.carouselPreviewId = advertsId
      this.previewDrawerVisible = true
      !this.carouselMapCache[advertsId] && getAdvertsList({
        advertsId,
        pageSize: 1,
        pageNum: 1,
      }).then((res) => {
        const item = res.body.advertsList[0]
        item.rotationRules = JSON.parse(item.rotationRules)
        item.resEntityMap = keyBy(item.resEntityList, 'id')
        this.$set(this.carouselMapCache, advertsId, item)
      })
    },
  },
}
</script>

<template>
  <div class="flex page-container">
    <div class="flex flex-col mr-2 mb-2 rounded-lg border brand-nav">
      <div class="flex p-1">
        <ElInput v-model="search" clearable placeholder="关键字搜索" />
        <ElTooltip content="刷新" placement="top">
          <ElButton class="px-3 ml-1" icon="el-icon-refresh" @click="getBrandList" />
        </ElTooltip>
      </div>
      <div v-loading="navLoading" class="overflow-y-auto flex-1">
        <div
          v-for="item of searchList"
          :key="item.brandId"
          :class="{ 'bg-gray-50 text-blue-400': brandIdNav === item.brandId }"
          class="p-2 truncate cursor-pointer text-md hover:bg-gray-100"
          :title="item.brandName"
          @click="brandIdNav = item.brandId"
        >
          {{ item.brandName }}（{{ item.countNum }}）
        </div>
      </div>
    </div>

    <DeviceTable
      ref="page"
      :brand-id="brandIdNav"
      :option="tablePageOption"
      @selection-change="selectionChange"
    >
      <template slot="actions:ads">
        <ElDropdown class="mx-2" split-button type="primary" size="small" @click="openAssignAds()">
          广告设置
          <ElDropdownMenu slot="dropdown">
            <ElDropdownItem
              :disabled="selected.length > 1"
              @click.native="previewAds"
            >
              预览
            </ElDropdownItem>
            <ElDropdownItem @click.native="assignAds({ advId: 0 })">
              恢复默认
            </ElDropdownItem>
          </ElDropdownMenu>
        </ElDropdown>
      </template>
    </DeviceTable>

    <ElDrawer
      :visible.sync="brandDrawerVisible"
      title="分配品牌"
    >
      <ElForm ref="form" :model="form" :rules="assignFormRules">
        <ElFormItem label="分配品牌" prop="brandIdAllot">
          <ElSelect v-model="form.brandIdAllot" class="w-full">
            <ElOption
              v-for="item of brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="更改设备类型" prop="devTypeId">
          <VcCascader
            ref="devInfo"
            v-model="form.devTypeId"
            class="w-full"
            :options="devInfoOptions"
            :props="{ emitPath: false }"
          />
        </ElFormItem>
        <ElFormItem label="轮播地址">
          <ElInput v-model="devConfig.rotationUrl" disabled />
        </ElFormItem>
        <ElFormItem label="商品地址">
          <ElInput v-model="devConfig.commodityModeUrl" disabled />
        </ElFormItem>
        <ElFormItem label="消息服务器地址">
          <ElInput v-model="devConfig.lvsUrl" disabled />
        </ElFormItem>
        <ElFormItem label="页面最大停留时间">
          <ElInput v-model="devConfig.maxIdleTime" disabled />
        </ElFormItem>
      </ElForm>
      <div class="mt-2">
        <ElButton @click="brandDrawerVisible = false">
          取 消
        </ElButton>
        <ElButton type="primary" @click="assignBrand()">
          确 定
        </ElButton>
      </div>
    </ElDrawer>

    <ElDrawer
      :visible.sync="areaDrawerVisible"
      title="分配店铺/区域"
    >
      <div>
        <VcCascader ref="areaOrShop" class="w-full" data="area_or_shop" />
      </div>
      <div class="mt-2">
        <ElButton @click="areaDrawerVisible = false">
          取 消
        </ElButton>
        <ElButton type="primary" @click="assignAreaOrShop">
          确 定
        </ElButton>
      </div>
    </ElDrawer>

    <ElDrawer :visible.sync="previewDrawerVisible" title="预览广告" size="500px">
      <div v-loading="!carouselMapCache[carouselPreviewId]" class="h-full">
        <CarouselPreview
          v-if="previewDrawerVisible && carouselMapCache[carouselPreviewId]"
          :option="carouselMapCache[carouselPreviewId].rotationRules"
          :file-map="carouselMapCache[carouselPreviewId].resEntityMap"
        />
      </div>
    </ElDrawer>

    <CarouselListDrawer ref="carouselList" @submit="assignAds" />
  </div>
</template>

<style scoped>
.brand-nav {
  width: 220px;
}
</style>
