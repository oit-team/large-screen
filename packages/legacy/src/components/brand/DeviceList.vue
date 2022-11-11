<script>
import * as api from '@/api/liveStream'
import DeviceTable from '@/views/LiveStream/Device/Table'
import DEV_STATE from '@/views/LiveStream/Device/DEV_STATE'
import { getShopDevInfo } from '@/api/liveStream'

export default {
  name: 'DeviceList',

  components: {
    DeviceTable,
  },

  props: {
    administrations: {
      type: Object,
    },
  },

  data: () => ({
    drawer: false,
    boolen: false,
    brandId: '',
    selected: '',
    newParams: {
      decId: '',
      brandId: '',
    },
    Unassigned: [],
    device: {
      devId: '',
      brandId: '',
    },
    brandList: [],
    brandIdNav: '',
  }),

  computed: {
    brandListNew() {
      return this.brandList.filter(item => !item.noTableShow)
    },
    tablePageOption() {
      return {
        actions: [
          {
            name: '分配设备',
            type: 'primary',
            click: () => {
              if (this.administrations.isShop === '2') return this.$message.warning('请选择店铺区域')
              this.noDeviceInfo()
              this.drawer = true
            },
          },
        ],
        fields: this.brandList,
      }
    },
  },

  created() {
    this.brandId = sessionStorage.brandId
    this.brandList = JSON.parse(sessionStorage.headTitString)
  },

  mounted() {
    this.$refs.page.loadData()
  },

  methods: {
    handleSelectionChange(val) {
      this.selected = val
    },
    loadData() {
      this.$refs.page.loadData()
    },
    async unbindDevice({ row: { devId } }) {
      this.$confirm('此操作将解绑, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.$refs.page.updateDeviceInfo(devId, {
          brandId: sessionStorage.brandId,
        })
      })
    },
    noDeviceInfo() {
      api
        .getShopDevInfo({
          brandId: 0,
          pageNum: 1,
          pageSize: 999,
        })
        .then((res) => {
          this.Unassigned = res.body.resultList
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },
    AddDevice() {
      if (this.selected.length === 0) {
        this.$message.warning('请至少选中一项数据！')
        return
      }

      this.selected.forEach((item, indx) => {
        return api.updateDeviceInfo({
          devId: item.devId,
          belongingId: this.administrations.id,
          belongingType: this.administrations.isShop,
        })
      })
      this.drawer = false
    },
  },
}
</script>

<template>
  <div class="flex-1 flex overflow-hidden">
    <DeviceTable
      ref="page"
      :belonging="administrations"
      :option="tablePageOption"
      :brand-id="brandId"
      integrated
    />

    <ElDrawer title="分配设备" :visible.sync="drawer" size="50%">
      <div class="yes">
        <ElButton class="add" type="primary" @click="AddDevice">
          确 定
        </ElButton>
      </div>

      <div>
        <ElTable style="width: 100%" :data="Unassigned" @selection-change="handleSelectionChange">
          <ElTableColumn v-model="boolen" type="selection" width="55" />
          <ElTableColumn
            v-for="(item, i) in brandListNew"
            :key="i"
            :prop="item.fieldKey"
            show-overflow-tooltip
            :label="item.fieldName"
          />
        </ElTable>
      </div>
    </ElDrawer>
  </div>
</template>

<style scoped>
.yes {
  display: flex;
}
</style>
