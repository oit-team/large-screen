<script>
import { getLotteryRecordList } from '@/api/lottery'

export default {
  name: 'LotteryList',
  data: () => ({
    data: {},
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.result,
          actions: {
            width: 180,
            buttons: [
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
      const res = await getLotteryRecordList({
        ...params,
        brandId: sessionStorage.brandId,
        userId: sessionStorage.userId,
      })
      this.data = res.body
    },

  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1669687724140" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
