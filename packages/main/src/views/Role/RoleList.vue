<script>
import { delRoleById, getRoleList } from '@/api/role'
export default {
  name: 'RoleList',

  data: () => ({
    data: {},
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
            click: () => this.$router.push({
              path: '/role/addRole',
            }),
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
                type: 'success',
                click: ({ row }) => this.$router.push({
                  path: '/role/addRole',
                  query: { item: row },
                }),
              },
              {
                tip: '删除',
                icon: 'el-icon-delete',
                type: 'danger',
                click: this.delRoleById,
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
                click: ({ row }) => this.$router.push({
                  path: '/role/authUsersByRoleId',
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

  activated() {
    this.$refs.table.loadData()
  },

  methods: {
    // 获取角色列表
    async loadData(params) {
      const res = await getRoleList({
        ...params,
      })
      this.data = res.body
    },

    // 删除当前角色
    async delRoleById({ row }) {
      await this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
      await delRoleById({
        roleId: row.roleId,
      })
      this.$message.success('删除成功！')
      this.$refs.table.loadData()
    },
  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 h-full">
      <TablePage v-bind="tablePageOption" ref="table" auto field-key="1669689666782" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
