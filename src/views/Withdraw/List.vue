<template>
  <div class="flex h-full">
    <aside class="w-1/5 min-w-200px max-w-300px pr-2 flex flex-col">
      <vc-item-group v-model="form.state" class="flex w-full">
        <vc-item v-slot="{active, toggle}" class="flex-1" :tag="false" :value="1">
          <el-button :type="active ? 'primary' : ''" @click="toggle">待审核</el-button>
        </vc-item>
        <vc-item v-slot="{active, toggle}" class="flex-1" :tag="false" :value="3">
          <el-button :type="active ? 'primary' : ''" @click="toggle">已完成</el-button>
        </vc-item>
      </vc-item-group>

      <div>
        <el-input v-model="lazyValue" class="mt-2" placeholder="关键字过滤" clearable>
          <el-button slot="append" icon="el-icon-search" circle @click="queryCustom()"></el-button>
        </el-input>
      </div>

      <div class="flex-1 overflow-auto p-2 my-2 border border-gray-200 rounded">
        <vc-item-group v-model="createId" class="mb-2" tag="ol" mandatory active-class="!bg-gray-200">
          <vc-item
            class="text-lg p-2 rounded cursor-pointer hover:bg-gray-100"
            tag="li"
            :value="0"
          >
            全部{{ allStateCount ? `（${allStateCount}）` : '' }}
          </vc-item>
          <vc-item
            v-for="item of customList"
            :key="item.id"
            class="text-lg p-2 rounded cursor-pointer hover:bg-gray-100"
            tag="li"
            :value="item.id"
          >
            {{ item.lastName }}
            <span v-if="item.stateCount">
              （<span class="text-red-500">{{ item.stateCount }}</span>）
            </span>
          </vc-item>
        </vc-item-group>

        <vc-load-more ref="loadMore" first-load @load="loadUserList"></vc-load-more>
      </div>
    </aside>

    <main class="flex-1 flex flex-col" style="overflow:hidden">
      <div class="border border-gray-200 rounded mb-2 p-3">
        <div class="text-lg pb-1" @click="loading = !loading">历史统计：</div>
        <div class="grid grid-cols-3 text-xl">
          <div v-for="(item, index) of countInfo" :key="index">{{ item }}</div>
        </div>
      </div>
      <TablePage v-bind="tablePageOption" ref="table"></TablePage>
    </main>

    <el-drawer
      title="拒绝原因"
      :visible.sync="drawer"
    >
      <div class="p-4">
        <el-input v-model.trim="rejectReason" placeholder="请填写拒绝原因"></el-input>
        <div class="text-right mt-2">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="reject()">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { downloadFile } from '@oit/utils'

export default {
  name: 'WithdrawList',

  data: () => ({
    customList: [],
    lazyValue: '',
    form: {
      lastName: '',
      state: '',
    },
    data: {},
    createId: null,
    checked: {},
    rejectReason: '',
    allStateCount: 0,
    countInfo: [],
    pageNum: 1,
    drawer: false,
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        // 新增导出按钮
        actions: [
          {
            name: '导出',
            type: 'primary',
            click: this.exportFile
            // to: '/role/addRole',
          },
        ],
        table: {
          data: this.data.allWithdrawList,
          actions: {
            buttons: [
              {
                tip: '拒绝',
                icon: 'el-icon-close',
                type: 'danger',
                disabled: ({ row }) => row.state === 2 || row.state === 3,
                click: ({ row }) => {
                  this.checked = row
                  this.drawer = true
                },
              },
              {
                tip: '通过',
                icon: 'el-icon-check',
                type: 'primary',
                disabled: ({ row }) => row.state === 2 || row.state === 3,
                click: async ({ row }) => {
                  await this.$confirm('通过后将立即发起转账，确定要通过吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                  })

                  this.updateWithdrawDeposit({
                    withdrawCode: row.withdrawCode,
                    state: 3,
                  })
                },
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
      this.getCountAndAllMoney()
    },
  },

  methods: {
    // 导出提现列表
    exportFile() {
      const params = this.$refs.table.getQueryParams()
      delete params.pageNum
      delete params.pageSize
      this.$axios
        .post(this.Api.getExportWithdrawRecord, this.GLOBAL.paramJson({
          createId:this.createId,
          ...params,
        }), {
          responseType: 'arraybuffer',
        })
        .then(res => {
          const date = new Date().toLocaleDateString().replace(/\//g, '-')
          downloadFile(res.data, `提现列表${date}.xls`)
        })
    },
    loadUserList($state) {
      this.$axios
        .post(this.Api.getWithdrawUserInfo, this.GLOBAL.paramJson({
          pageNum: this.pageNum,
          pageSize: 20,
          ...this.form,
        }))
        .then(res => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          const data = res.data.body
          this.allStateCount = data.allStateCount
          this.customList = this.pageNum === 1 ? data.resultList : [...this.customList, ...data.resultList]
          this.customList.length >= data.count ? $state.done() : $state.next()
          this.pageNum++
        })
        .catch($state.fail)
    },
    async loadData(params) {
      return this.$axios
        .post(this.Api.getWithdrawApplyList, this.GLOBAL.paramJson({
          createId: this.createId,
          ...params,
        }))
        .then(res => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          this.data = res.data.body
        })
    },
    queryCustom() {
      this.form.lastName = this.lazyValue
    },
    reject() {
      if (!this.rejectReason) return this.$message.warning('请填写拒绝原因')

      this.updateWithdrawDeposit({
        withdrawCode: this.checked.withdrawCode,
        state: 2,
        remark: this.rejectReason,
      }).then(() => {
        this.rejectReason = ''
        this.drawer = false
      })
    },
    updateWithdrawDeposit(params) {
      const loading = this.$loading({
        lock: true,
        text: '转账中...',
        spinner: 'el-icon-loading',
      })
      return this.$axios
        .post(this.Api.updateWithdrawDeposit, this.GLOBAL.paramJson(params))
        .then(async res => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          this.$refs.table.loadData()
          this.$message.success('修改成功')
          loading.close()
        })
        .catch(err => {
          this.$message.error(err.data.head.msg ?? '修改失败')
          loading.close()
        })
    },
    getCountAndAllMoney() {
      return this.$axios
        .post(this.Api.getCountAndAllMoney, this.GLOBAL.paramJson({
          createId: this.createId,
        }))
        .then(res => {
          this.countInfo = res.data.body.resultList
        })
    },
  },
}
</script>

<style scoped lang="scss">

</style>
