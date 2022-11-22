<script>
import { getJackpotStyleAll } from '@/api/jackpot'
export default {
  name: 'CommonJackpot',
  data: () => ({
    data: {},

  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: '批量下架',
            type: 'success',
          },
        ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'AddJackpot',
                  query: { jackpotId: row.jackpotId },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
              },
              {
                tip: '下架',
                type: 'success',
                icon: 'el-icon-bottom',
              },
              {
                tip: '审批记录',
                type: 'info',
                icon: 'el-icon-notebook-2',
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
    this.loadData()
  },

  activated() {
  },

  methods: {
    async loadData() {
      const res = await getJackpotStyleAll({
        pageNum: 1,
        pageSize: 10,
        jackpotType: 0,
      })
      this.data = res.body
    },
    addJackpot() {
      this.$router.push({
        name: 'AddJackpot',
      })
    },
  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto>
        <template #content:impUrl="{ row }">
          <ElImage v-if="row.impUrl" :src="row.impUrl" class="file-res" fit="cover" />
        </template>
      </TablePage>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.file-res {
  height: 60px;
  width: 60px;
}
</style>

