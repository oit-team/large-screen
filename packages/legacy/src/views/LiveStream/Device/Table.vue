<script>
import { mergeWith } from 'lodash-es'
import DEV_STATE from './DEV_STATE'
import * as api from '@/api/liveStream'
import TablePage from '@/components/classify/TablePage'
import { registerRefMethods } from '@/utils/helper'
import DATA_TYPES from '@/components/classify/Cascader/DATA_TYPES'

// 设备状态颜色
const DEV_STATE_CLASSES = {
  [DEV_STATE.NOT_ONLINE]: 'text-gray-500',
  [DEV_STATE.IN_SERVICE]: 'text-green-500',
  [DEV_STATE.OFFLINE]: 'text-red-500',
  [DEV_STATE.SCRAP]: 'text-gray-200',
}

export default {
  name: 'DeviceTableList',

  components: {
    TablePage,
  },

  props: {
    belonging: Object,
    option: Object,
    // 品牌
    brandId: [String, Number],
    // 用于标记是综合管理页面引用
    integrated: Boolean,
  },

  data() {
    return {
      data: {},
    }
  },

  computed: {
    tablePageOption() {
      // 合并配置
      return mergeWith({
        promise: this.getDeviceInfoList,
        actions: [],
        table: {
          data: this.data.resultList,
          actions: {
            width: 60,
            buttons: [],
          },
        },
        pager: {
          total: this.data.totalCount,
        },
        search: {
          expand: true,
          fieldProps: {
            belongingName: {
              data: DATA_TYPES.AREA_OR_SHOP,
            },
          },
        },
      }, this.option, (objValue, srcValue, key) => {
        if (Array.isArray(objValue) && srcValue) {
          // 提供自定义按钮位置的方式
          return typeof srcValue === 'function' ? srcValue(objValue) : objValue.concat(srcValue)
        }
        if (key === 'fields') {
          return srcValue
        }
      })
    },
  },

  watch: {
    brandId: 'loadData',
  },

  methods: {
    ...registerRefMethods('page', ['loadData', 'checkSelected', 'setFields']),
    async getDeviceInfoList(params) {
      const data = this.belonging || params.belongingName
      if (params.belongingName) delete params.belongingName

      if (data) {
        params.belongingId = data.id
        params.belongingType = data.isShop
      }

      const request = this.integrated ? api.getShopDevInfo : api.getDeviceInfoList

      const res = await request({
        ...params,
        brandId: this.brandId,
      })
      this.data = res.body
    },
    /**
     * 修改表格选中的设备信息
     * @public
     * @param {object} data 要修改的数据
     */
    updateSelectedDeviceInfo(data) {
      const selected = this.$refs.page.selected

      const requests = selected.map((item) => {
        return this.updateDeviceInfo(item.devId, data)
      })

      return Promise.all(requests).then(() => {
        this.loadData()
        this.$message.success('修改成功！')
      })
    },
    /**
     * 修改设备信息
     * @public
     * @param {number} devId 设备id
     * @param {object} data 设备信息
     */
    updateDeviceInfo(devId, data = {}) {
      return api.updateDeviceInfo({
        devId,
        ...data,
      })
    },
    _stateClass(state) {
      return DEV_STATE_CLASSES[state]
    },
  },
}
</script>

<template>
  <div class="flex-1 overflow-hidden">
    <table-page v-bind="tablePageOption" ref="page" @selection-change="$emit('selection-change', $event)">
      <template slot="actions:ads">
        <slot name="actions:ads" />
      </template>
      <template slot="content:devStateName" slot-scope="{ row }">
        <span :class="_stateClass(row.devState)">{{ row.devStateName }}</span>
      </template>
    </table-page>
  </div>
</template>

<style scoped>
</style>
