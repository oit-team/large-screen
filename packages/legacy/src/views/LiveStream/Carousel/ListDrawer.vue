<script>
import { keyBy } from 'lodash-es'
import TablePage from '@/components/classify/TablePage'
import { getAdvertsList } from '@/api/liveStream'
import CarouselPreview from '@/components/business/CarouselPreview'
import { DEFAULT_STATE, PUBLISHED_STATE } from '@/views/LiveStream/Carousel/List'

export default {
  name: 'CarouselListDrawer',

  components: {
    TablePage,
    CarouselPreview,
  },

  data: () => ({
    visible: false,
    data: {},
    selected: null,
  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        search: {
          responsive: 'grid-cols-1 2xl:grid-cols-2',
        },
        table: {
          data: this.data.advertsList,
          selectionItem: true,
        },
        pager: {
          total: this.data.totalCount,
        },
      }
    },
    carouselItemOption() {
      return this.selected ? JSON.parse(this.selected.rotationRules) : []
    },
    fileMap() {
      return this.selected ? keyBy(this.selected.resEntityList, 'id') : {}
    },
  },

  methods: {
    async open() {
      this.selected = null
      this.data.advertsList = []
      this.visible = true
      !this.$refs.page && await this.$nextTick()
      this.$refs.page.setFields([
        {
          fieldName: '标题',
          fieldType: '文本',
          fieldKey: 'describe',
          dbField: 'DESCRIBE',
          noSearchShow: true,
        },
        {
          fieldName: '创建人',
          fieldType: '文本',
          fieldKey: 'createUserName',
          dbField: 'CREATE_USER_NAME',
          noSearchShow: true,
        },
        {
          fieldName: '创建时间',
          fieldType: '日期时间',
          fieldKey: 'createTime',
          dbField: 'CREATE_TIME',
        },
        {
          fieldName: '修改时间',
          fieldType: '日期',
          fieldKey: 'updateTime',
          dbField: 'UPDATE_TIME',
          noSearchShow: true,
        },
      ])
      this.$refs.page.loadData()
    },
    close() {
      this.visible = false
    },
    loadData(params) {
      return getAdvertsList({
        ...params,
        state: PUBLISHED_STATE.PUBLISHED,
        defaults: DEFAULT_STATE.NO,
      }).then((res) => {
        this.data = res.body
      })
    },
    submit() {
      this.$emit('submit', this.selected)
    },
  },
}
</script>

<template>
  <el-drawer :visible.sync="visible" size="70%" title="选择广告">
    <div v-if="visible" class="flex overflow-hidden h-full p-4">
      <table-page v-bind="tablePageOption" ref="page" @current-change="selected = $event" />

      <carousel-preview class="ml-2" :option="carouselItemOption" :file-map="fileMap">
        <el-empty v-if="!selected" description="未选择广告" />
        <el-button v-else class="mt-2" type="primary" @click="submit()">
          确定
        </el-button>
      </carousel-preview>
    </div>
  </el-drawer>
</template>

<style scoped lang="less">
</style>
