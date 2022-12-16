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
      })
      this.data = res.body
    },

  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1669687724140">
        <template #content:telephone="{ row }">
          <div v-if="row.telephone">
            {{ row.telephone }}
          </div>
          <div v-else class="text-gray-300">
            暂无
          </div>
        </template>
        <template #content:nickName="{ row }">
          <div v-if="row.nickName">
            {{ row.nickName }}
          </div>
          <div v-else class="text-gray-300">
            暂无
          </div>
        </template>
      </TablePage>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
