<script>
import TablePage from '@/components/classify/TablePage'
import { deleteAdverts, getAdvertsList, updateAdvertsState } from '@/api/liveStream'

// 发布状态
export const PUBLISHED_STATE = {
  // 未发布
  UNPUBLISHED: 0,
  // 已发布
  PUBLISHED: 1,
}

export const DEFAULT_STATE = {
  YES: '1',
  NO: '0',
}

export default {
  name: 'CarouselList',

  components: {
    TablePage,
  },

  data: () => ({
    PUBLISHED_STATE,
    DEFAULT_STATE,
    data: {},
    dialogVisible: false,
    selectedItem: {},
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: '新增',
            type: 'primary',
            icon: 'el-icon-plus',
            to: 'LiveStreamCarouselUpdate',
          },
        ],
        table: {
          data: this.data.advertsList,
          actions: {
            width: 140,
            buttons: [
              {
                tip: ({ row }) => ['发布', '撤销'][row.state],
                disabled: ({ row }) => row.defaults === DEFAULT_STATE.YES,
                type: 'warning',
                icon: ({ row }) => ['el-icon-top-right'][row.state] || 'el-icon-bottom-left',
                click: async ({ row }) => {
                  this.selectedItem = row
                  if (row.state === PUBLISHED_STATE.PUBLISHED) {
                    await this.$confirm('确定要撤销已发布的广告吗？', '提示', { type: 'warning' })
                    await this.updateAdvertsState(PUBLISHED_STATE.UNPUBLISHED)
                    this.$message.success('撤销成功！')
                    this.$refs.page.loadData()
                  }
                  else {
                    this.dialogVisible = true
                  }
                },
              },
              {
                tip: '编辑',
                type: 'primary',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'LiveStreamCarouselUpdate',
                  query: { id: row.advId },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteAdverts,
                option: {
                  type: 'delete',
                },
              },
            ],
          },
        },
        pager: {
          total: this.data.totalCount,
        },
      }
    },
  },

  methods: {
    loadData(params) {
      return getAdvertsList(params).then((res) => {
        this.data = res.body
      })
    },
    async handlePublish(defaults) {
      const state = {
        [PUBLISHED_STATE.UNPUBLISHED]: PUBLISHED_STATE.PUBLISHED,
        [PUBLISHED_STATE.PUBLISHED]: PUBLISHED_STATE.UNPUBLISHED,
      }[this.selectedItem.state]

      if (state === undefined) return

      await this.updateAdvertsState(state, defaults)

      this.$message.success('发布成功！')
      this.dialogVisible = false

      this.$refs.page.loadData()
    },
    async updateAdvertsState(state, defaults = DEFAULT_STATE.NO) {
      await updateAdvertsState({
        advId: this.selectedItem.advId,
        state,
        defaults,
      })
    },
    deleteAdverts({ row }) {
      deleteAdverts(row.advId).then((res) => {
        this.$refs.page.loadData()
      })
    },
  },
}
</script>

<template>
  <page-container>
    <table-page v-bind="tablePageOption" ref="page" auto>
      <template slot="content:describe" slot-scope="{ row }">
        <el-tag
          v-if="row.defaults === DEFAULT_STATE.YES"
          class="mr-1"
          size="small"
          type="primary"
        >
          默认
        </el-tag>
        <span>{{ row.describe }}</span>
      </template>
      <template slot="content:stateName" slot-scope="{ row }">
        <span
          :class="['text-red-400', 'text-green-400'][row.state]"
        >{{ row.stateName }}</span>
      </template>
    </table-page>

    <el-dialog
      title="操作"
      :visible.sync="dialogVisible"
      width="350px"
    >
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-tooltip content="发布为默认时，将在设备未设置广告时使用" placement="top">
          <el-button type="primary" plain @click="handlePublish(DEFAULT_STATE.YES)">发布且置为默认</el-button>
        </el-tooltip>
        <el-button type="primary" @click="handlePublish(DEFAULT_STATE.NO)">发布</el-button>
      </span>
    </el-dialog>
  </page-container>
</template>

<style scoped>

</style>
