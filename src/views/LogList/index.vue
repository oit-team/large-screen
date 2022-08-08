<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col">
      <div id="customerList" class="pageCommonStyle" style="height:100%;display: flex;flex-direction: column;">
        <TablePage v-bind="tablePageOption" ref="table"></TablePage>
      </div>
    </main>
  </div>
</template>

<script>

export default {
  name: 'LogInfo',

  data: () => ({
    lazyValue: '',
    form: {
      lastName: '',
      state: '',
    },
    data: {},
    createId: null,
    checked: {},
    characterList: [],
    countInfo: [],
    pageNum: 1,
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.updateInfoList,
        },
        pager: {
          total: this.data.count,
        },
      }
    },
  },

  watch: {
    form: {
      deep: true,
      handler() {
        this.pageNum = 1
        this.createId = 0
        this.$refs.loadMore.reset().load()
      },
    },
    createId() {
      this.$refs.table.loadData()
    },
  },
  mounted() {
    this.$refs.table.loadData()
  },
  activated() {
    this.$refs.table.loadData()
  },

  methods: {
    loadUserList($state) {
      // 获取日志列表信息
      this.$axios
        .post(this.Api.getUpdateInfoList, this.GLOBAL.paramJson({
          pageNum: this.pageNum,
          pageSize: 20,
          ...this.form,
        }))
        .then(res => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          const data = res.data.body
          this.pageNum++
        })
        .catch($state.fail)
    },
    // 获取日志查询列表
    async loadData(params) {
      return this.$axios
        .post(this.Api.getUpdateInfoList, this.GLOBAL.paramJson({
          createId: this.createId,
          ...params,
        }))
        .then(res => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          this.data = res.data.body
          this.$refs.table.doLayout()
        })
    },
  },
}
</script>

<style scoped lang="scss">

</style>