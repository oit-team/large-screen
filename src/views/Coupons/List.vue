<template>
  <div class="flex h-full">
    <aside class="w-1/5 min-w-200px max-w-300px pr-2 flex flex-col">
      <vc-item-group v-model="form.status" class="flex w-full">
        <vc-item v-slot="{ active, toggle }" class="flex-1" :tag="false" :value="0">
          <el-button :type="active ? 'primary' : ''" @click="toggle">
            未使用
          </el-button>
        </vc-item>
        <vc-item v-slot="{ active, toggle }" class="flex-1" :tag="false" :value="1">
          <el-button :type="active ? 'primary' : ''" @click="toggle">
            已使用
          </el-button>
        </vc-item>
      </vc-item-group>

      <div>
        <el-input v-model="lazyValue" class="mt-2" placeholder="关键字过滤" clearable>
          <el-button slot="append" icon="el-icon-search" circle @click="queryCustom()"></el-button>
        </el-input>
      </div>

      <div class="flex-1 overflow-auto p-2 my-2 border border-gray-200 rounded">
        <vc-item-group v-model="userId" class="mb-2" tag="ol" mandatory active-class="!bg-gray-200">
          <vc-item
            class="text-lg p-2 rounded cursor-pointer hover:bg-gray-100"
            tag="li"
            :value="0"
          >
            全部{{ allStateCount ? `（${allStateCount}）` : '' }}
          </vc-item>
          <vc-item
            v-for="item of customList"
            :key="item.userId"
            class="text-lg p-2 rounded cursor-pointer hover:bg-gray-100"
            tag="li"
            :value="item.userId"
          >
            {{ item.userName }}
            <span v-if="item.count">
              （<span class="text-red-500">{{ item.count }}</span>）
            </span>
          </vc-item>
        </vc-item-group>

        <vc-load-more ref="loadMore" first-load @load="loadUserList"></vc-load-more>
      </div>
    </aside>

    <main class="flex-1 flex flex-col">
      <div class="border border-gray-200 rounded mb-2 p-3">
        <div class="text-lg pb-1">
          历史统计：
        </div>
        <div class="grid grid-cols-3 text-xl">
          <div v-for="(item, index) of countInfo" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
      <TablePage v-bind="tablePageOption" ref="table"></TablePage>
    </main>
  </div>
</template>

<script>
export default {
  name: 'WithdrawList',

  data: () => ({
    customList: [],
    lazyValue: '',
    form: {
      userName: '',
      status: '',
    },
    data: {},
    userId: null,
    allStateCount: 0,
    countInfo: [],
    pageNum: 1,
    drawer: false,
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.resultList,
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
        this.userId = 0
        this.$refs.loadMore.reset().load()
      },
    },
    userId() {
      this.$refs.table.loadData()
    },
  },

  methods: {
    loadUserList($state) {
      this.$axios
        .post(this.Api.getTicketUser, this.GLOBAL.paramJson({
          pageNum: this.pageNum,
          pageSize: 20,
          ...this.form,
        }))
        .then((res) => {
          const data = res.data.body
          this.allStateCount = data.totalNum
          this.customList = this.pageNum === 1 ? data.resultList : [...this.customList, ...data.resultList]
          this.customList.length >= data.count ? $state.done() : $state.next()
          this.pageNum++
        })
        .catch($state.fail)
    },
    async loadData(params) {
      this.$axios
        .post(this.Api.getTicketUsedRecord, this.GLOBAL.paramJson({
          userId: this.userId,
          ...params,
        }))
        .then((res) => {
          this.data = res.data.body
          this.countInfo = this.data.stateNumList
        })
    },
    queryCustom() {
      this.form.userName = this.lazyValue
    },
  },
}
</script>

<style scoped lang="scss">

</style>
