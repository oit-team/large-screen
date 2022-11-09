<script>
import TablePage from '@/components/classify/TablePage'
import * as api from '@/api/liveStream'
import DATA_TYPES from '@/components/classify/Cascader/DATA_TYPES'

// 房间状态
const ROOM_STATE = {
  // 未发布
  UNPUBLISHED: 0,
  // 未开始
  NOT_STARTED: 1,
  // 进行中
  UNDERWAY: 2,
  // 已结束
  FINISHED: 3,
}

// 房间状态颜色
const ROOM_STATE_CLASSES = {
  [ROOM_STATE.UNPUBLISHED]: 'text-yellow-400',
  [ROOM_STATE.NOT_STARTED]: 'text-gray-500',
  [ROOM_STATE.UNDERWAY]: 'text-green-500',
  [ROOM_STATE.FINISHED]: 'text-gray-200',
}

export default {
  name: 'RoomList',

  components: {
    TablePage,
  },

  data() {
    return {
      data: {},
    }
  },

  computed: {
    tablePageOption() {
      return {
        promise: this.getLiveBroadcastRoom,
        search: {
          fieldProps: {
            speaker: {
              data: DATA_TYPES.AREA_OR_SHOP,
            },
          },
        },
        table: {
          data: this.data.resultList,
          actions: {
            width: 130,
            buttons: [
              {
                tip: ({ row }) => ['发布', '撤回'][row.state],
                type: 'warning',
                icon: ({ row }) => ['el-icon-top-right'][row.state] || 'el-icon-bottom-left',
                click: this.handlePublish,
              },
              {
                tip: '编辑',
                type: 'primary',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'LiveStreamRoomUpdate',
                  params: { item: row },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.delLiveBroadcastRoom,
                option: {
                  type: 'delete',
                  fieldTip: '房间',
                  field: 'roomName',
                },
              },
            ],
          },
        },
        actions: [
          {
            name: '创建房间',
            type: 'primary',
            to: 'LiveStreamRoomUpdate',
          },
        ],
        pager: {
          total: this.data.totalCount,
        },
      }
    },
  },

  activated() {
    this.$refs.page.loadData()
  },

  methods: {
    async getLiveBroadcastRoom(params) {
      // 取出主讲人数据
      const speaker = params.speaker

      if (speaker) {
        params.speaker = speaker.id
        params.speakerType = speaker.isShop
      }

      const res = await api.getLiveBroadcastRoom(params)
      this.data = res.body
    },
    async delLiveBroadcastRoom({ row: { roomId } }) {
      await api.delLiveBroadcastRoom(roomId)
      this.$refs.page.loadData()
    },
    async handlePublish({ row }) {
      const state = {
        [ROOM_STATE.UNPUBLISHED]: ROOM_STATE.NOT_STARTED,
        [ROOM_STATE.NOT_STARTED]: ROOM_STATE.UNPUBLISHED,
      }[row.state]

      if (state === undefined) return

      const unpublished = row.state === ROOM_STATE.UNPUBLISHED
      const notStarted = row.state === ROOM_STATE.NOT_STARTED

      unpublished && await this.$confirm('确定要发布直播吗？', '提示', { type: 'warning' })
      notStarted && await this.$confirm('确定要取消直播吗？', '提示', { type: 'warning' })

      await api.publishOrWithdrawRoom({
        roomId: row.roomId,
        roomName: row.roomName,
        speakerName: row.speakerName,
        startTime: row.startTime,
        endTime: row.endTime,
        roomCode: row.roomCode,
        state,
      })

      unpublished && this.$message.success('发布成功！')
      notStarted && this.$message.success('取消成功！')

      this.$refs.page.loadData()
    },
    _stateClass(state) {
      return ROOM_STATE_CLASSES[state]
    },
  },
}
</script>

<template>
  <PageContainer>
    <TablePage v-bind="tablePageOption" ref="page">
      <template slot="content:stateName" slot-scope="{ row }">
        <span :class="_stateClass(row.state)">{{ row.stateName }}</span>
      </template>
    </TablePage>
  </PageContainer>
</template>

<style scoped>
</style>
