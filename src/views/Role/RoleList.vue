<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col">
      <div id="customerList" class="pageCommonStyle" style="height:100%;display: flex;flex-direction: column;">
        <TablePage v-bind="tablePageOption" ref="table" auto-layout></TablePage>
      </div>
    </main>
  </div>
</template>

<script>

export default {
  name: 'WithdrawList',

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
        // 新增角色按钮
        actions: [
          {
            name: '新增角色',
            type: 'primary',
            to: '/role/addRole',
          },
        ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 150,
            buttons: [
              {
                tip: '编辑',
                icon: 'el-icon-edit',
                type: 'edit',
                click: ({row}) => this.$router.push({
                  path: '/role/addRole',
                  query: { item: row },
                }),
              },
              {
                tip: '删除',
                icon: 'el-icon-delete',
                type: 'danger',
                click: this.deleteCharacters,
                option: {
                  type: 'delete',
                  field: 'roleName',
                  fieldTip: '名称为',
                },
              },
              {
                tip: '角色授权',
                icon: 'el-icon-thumb',
                type: 'primary',
                // row :roleName updateId upDateTime roleCode roReMark
                click: ({row}) => this.$router.push({
                  path: '/role/roleUsersByRoleId',
                  query: { item: row },
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

  activated() {
    this.$refs.table.loadData()
  },

  methods: {
    loadUserList($state) {
      // 获取角色列表信息
      this.$axios
        .post(this.Api.getRoleList, this.GLOBAL.paramJson({
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
    // 获取角色列表
    async loadData(params) {
      return this.$axios
        .post(this.Api.getRoleList, this.GLOBAL.paramJson({
          createId: this.createId,
          ...params,
        }))
        .then(res => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          this.data = res.data.body
          this.$refs.table.doLayout()
        })
    },
    // 删除当前角色
    deleteCharacters({ row }) {
      const con = {
        roleId: row.roleId
      }
      return this.$axios
        .post(this.Api.deleteCharacters, this.GLOBAL.paramJson(con))
        .then(res => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          this.$refs.table.loadData()
        }).catch(res=>{
          this.$message({
            message: res.data.head.msg,
            type: 'warning'
          });
          return Promise.reject(res)
        });
    }
  },
}
</script>

<style scoped lang="scss">

</style>
