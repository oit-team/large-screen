<script>
import { getIntegralBilling } from '@/api/integral'

export default {
  name: 'IntegralList',
  data: () => ({
    data: {},
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.resultMap,
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
      const res = await getIntegralBilling({
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
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1670836581895" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
