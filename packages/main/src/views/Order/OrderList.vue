<script>
import { getProcurementOrderList } from '@/api/order'

export default {
  name: 'OrderList',
  data: () => ({
    data: {},
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.resultList,
          actions: {
            width: 100,
            buttons: [
              {
                tip: '详情',
                type: 'success',
                icon: 'el-icon-view',
                click: ({ row }) => this.$router.push({
                  name: 'Detail',
                  query: { orderId: row.orderId },
                }),
              },
            ],
          },
        },
        pager: {
          total: this.data.count,
        },
      }
    },
  },
  mounted() {
  },

  methods: {
    async loadData(params) {
      const res = await getProcurementOrderList({
        ...params,
      })
      this.data = res.body
    },
  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1669687596574" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
