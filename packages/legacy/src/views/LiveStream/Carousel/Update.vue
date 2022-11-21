<script lang="jsx">
import Vue from 'vue'
import { pick, uniqueId } from 'lodash-es'
import { DEFAULT_STATE, PUBLISHED_STATE } from './List'
import Split from '@/components/classify/Split'
import TablePage from '@/components/classify/TablePage'
import { addAdverts, getAdvertsById, getAdvertsRes, getCollocationList, getStyleList, updateAdverts } from '@/api/liveStream'
import CarouselItemContent from '@/components/business/CarouselItemContent'
import FILE_TYPE from '@/enums/FILE_TYPE'

// 轮播类型
const ADVERTS_TYPE = {
  // 大屏
  LARGE_SCREEN: 0,
  // 电视
  TELEVISION: 1,
}

export default {
  name: 'CarouselUpdate',

  components: {
    [Split.name]: Split,
    TablePage,
    CarouselItemContent,
  },

  data: () => ({
    FILE_TYPE,
    DEFAULT_STATE,
    tab: '',
    drawerVisible: false,
    drawerCollocationVisible: false,
    drawerMatchGoodsVisible: false,
    isEdit: false,

    fileGoods: {}, // 所有的选中的商品对象
    // 填充位置
    target: 0,
    carouselList: [],
    data: {},
    formData: {
      describe: '',
      advertsType: ADVERTS_TYPE.LARGE_SCREEN,
      defaults: DEFAULT_STATE.NO,
    },
    formRules: {
      describe: [
        {
          required: true,
          message: '请输入标题',
        },
        {
          max: 50,
          message: '最多 50 个字符',
        },
      ],
      advertsType: [
        {
          required: true,
          message: '请选择广告类型',
        },
      ],
    },
    fileMap: {},
    disabledDefault: false,
    collocationData: {},
    matchGoodsData: {},
    goodsDetailData: [],
    collocationFields: [{
      fieldName: '搭配名',
      fieldType: '文本',
      fieldKey: 'collName',
      noSearchShow: true,
    }, {
      fieldName: '商品款号',
      fieldType: '文本',
      fieldKey: 'styleNo',
      noTableShow: true,
    }, {
      fieldName: '商品名称',
      fieldType: '文本',
      fieldKey: 'styleName',
      noTableShow: true,
    }, {
      fieldName: '标签',
      fieldType: '文本',
      fieldKey: 'collLabel',
    }, {
      fieldName: '图片',
      fieldType: '文本',
      fieldKey: 'collImgUrl',
      noSearchShow: true,
    }, {
      fieldName: '创建时间',
      fieldType: '日期',
      fieldKey: 'startcreateTime',
      noTableShow: true,
    }],
    // 相关联搭配文本域
    matchGoodsFields: [{
      fieldName: '商品款号',
      fieldType: '文本',
      fieldKey: 'productNo',
      noTableShow: true,
    }, {
      fieldName: '商品名称',
      fieldType: '文本',
      fieldKey: 'productName',
      noTableShow: true,
    }, {
      fieldName: '商品款号',
      fieldType: '文本',
      fieldKey: 'styleNo',
      noSearchShow: true,
    }, {
      fieldName: '商品名称',
      fieldType: '文本',
      fieldKey: 'styleName',
      noSearchShow: true,
    }, {
      fieldName: '商品图片',
      fieldType: '文本',
      fieldKey: 'resUrl',
      noSearchShow: true,
    }],

  }),

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        table: {
          data: this.data.result,
          actions: {
            buttons: [
              {
                tip: '选择',
                icon: 'el-icon-check',
                type: 'primary',
                click: ({ row }) => this.setContent(this.target, { res: row }),
              },
            ],
          },
        },
        search: {
          responsive: 'grid-cols-2',
        },
        pager: {
          total: this.data.totalCount,
        },
      }
    },
    tablePageCollocationOption() {
      return {
        promise: this.getCollocationList,
        table: {
          data: this.collocationData.collocationList,
          actions: {
            buttons: [
              {
                tip: '选择',
                icon: 'el-icon-check',
                type: 'primary',
                click: this.selectCollocation,
              },
            ],
          },
        },
        search: {
          responsive: 'grid-cols-2',
        },
        pager: {
          total: this.collocationData.totalCount,
        },
      }
    },
    // 选择相关联搭配商品
    tablePageMatchGoodsOption() {
      return {
        promise: this.getStyleList,
        table: {
          data: this.matchGoodsData.resultList,
          actions: {
            buttons: [
              {
                tip: '选择',
                icon: 'el-icon-check',
                type: 'primary',
                click: this.selectMatchGoods,
              },
            ],
          },
        },
        search: {
          responsive: 'grid-cols-2',
        },
        pager: {
          total: this.matchGoodsData.count,
        },
      }
    },

    // 当前选择的轮播页
    carouselItem() {
      return this.carouselList.find(item => item._tempId === this.tab)
    },
    divider: {
      get() {
        const divider = parseFloat((this.carouselItem.divider * 100).toFixed(2))
        return isNaN(divider) ? 100 : divider
      },
      set(value) {
        this.$set(this.carouselItem, 'divider', value / 100)
      },
    },
    duration: {
      get() {
        return parseFloat((this.carouselItem.duration / 1000).toFixed(2))
      },
      set(value) {
        this.carouselItem.duration = value * 1000
      },
    },
    allFilled() {
      return this.carouselItem.items.length === 2
    },
    hasVideo() {
      return this.carouselItem.items.some(item => item.type === 'video')
    },
    disabledEdit() {
      return this.isEdit ? this.goodsDetailData.state === PUBLISHED_STATE.PUBLISHED : false
    },
  },

  created() {
    const advId = this.$route.query.id
    this.isEdit = !!advId

    !this.isEdit && this.addItem()

    if (advId) {
      this.isEdit = true
      this.getAdvertsById(advId)
    }
  },

  mounted() {
    !this.disabledEdit && this.genAddButton()
  },

  methods: {
    loadData(params) {
      return getAdvertsRes(params).then((res) => {
        this.data = res.body
      })
    },
    // 查询商品列表详情
    async getAdvertsById(advId) {
      const res = await getAdvertsById({
        advId,
      })
      this.goodsDetailData = res.body
      this.getInitData(advId)
    },

    getInitData(advId) {
      this.formData = {
        advId: this.goodsDetailData.advId,
        ...pick(this.goodsDetailData, Object.keys(this.formData)),
      }
      const config = JSON.parse(this.goodsDetailData.rotationRules)

      this.carouselList = config.map((item) => {
        item._tempId = uniqueId()
        // if (!this.goodsDetailData.advertsStyles.length) {
        //   item.goods = []
        // }
        item.goods = item.goods || []

        return item
      })
      this.tab = this.carouselList[0]._tempId

      this.goodsDetailData.resEntityList.forEach((item) => {
        this.$set(this.fileMap, item.id, item)
      })
      this.goodsDetailData.advertsStyles.forEach((item) => {
        this.$set(this.fileGoods, item.styleId, item)
      })
      this.disabledDefault = this.goodsDetailData.defaults === DEFAULT_STATE.YES && this.goodsDetailData.state === PUBLISHED_STATE.PUBLISHED
    },

    addItem(option = {}) {
      const {
        items = [],
        goods = [],
      } = option

      if (this.carouselList.length >= 12) {
        this.$message.warning('最多添加12页')
        return false
      }

      const tempId = uniqueId()
      this.carouselList.push({
        _tempId: tempId,
        items,
        goods,
        divider: 1,
        duration: 5000,
      })
      this.tab = tempId

      return true
    },
    removeItem(index) {
      const currentTempId = this.carouselList[index]._tempId
      this.carouselList.splice(index, 1)
      if (this.carouselList.length > 0) {
        if (currentTempId !== this.tab) return
        this.tab = this.carouselList[index]
          ? this.carouselList[index]._tempId
          : this.carouselList.at(-1)._tempId
      }
      else {
        this.addItem()
      }
    },
    // 点击保存
    saveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        // 移除临时ID
        const carouselList = this.carouselList.map((item) => {
          // 浅拷贝
          item = Object.assign({}, item)
          delete item._tempId
          return item
        })
        // 必填项验证
        const verify = carouselList.every((item, index) => {
          const has = item.items.length > 0
          if (!has) this.$message.warning(`第${index + 1}页轮播未配置`)
          return has
        })
        const resId = [
          ...carouselList.reduce((prev, { items }) => {
            items.forEach(({ srcId }) => prev.add(srcId))
            return prev
          }, new Set()),
        ]

        const advertsStyle = [
          ...carouselList.reduce((prev, { goods }) => {
            goods.forEach(item => prev.add(item))
            return prev
          }, new Set()),
        ]

        if (verify) {
          (this.isEdit ? updateAdverts : addAdverts)({
            ...this.formData,
            state: PUBLISHED_STATE.UNPUBLISHED,
            rotationRules: JSON.stringify(carouselList),
            resId,
            advertsStyle,
          }).then((res) => {
            this.$message.success('保存成功！')
            this.$router.back()
          })
        }
      })
    },
    addContent(index) {
      this.target = index
      this.drawerVisible = true
      this.$nextTick(() => {
        this.$refs.fileTable.setFields([{
          fieldName: '资源',
          fieldType: '文本',
          fieldKey: 'resUrl',
          dbField: 'RES_URL',
          noSearchShow: true,
        }, {
          fieldName: '资源名称',
          fieldType: '文本',
          fieldKey: 'resName',
          dbField: 'RES_NAME',
        }, {
          dbField: 'RES_TYPE_NAME',
          fieldKey: 'resTypeName',
          fieldName: '类型',
          fieldType: '文本',
          noSearchShow: true,
        }])
      })
    },
    removeContent(item, index) {
      item.items.splice(index, 1)
      item.divider = 1
    },
    exchangeContent(item) {
      item.items = [item.items[1], item.items[0]]
    },
    setContent(index, option) {
      const {
        res = {},
        goods = [],
      } = option

      // 缓存
      this.$set(this.fileMap, res.id, {
        resUrl: res.resUrl,
      })
      const target = index
      const item = this.carouselItem
      if (goods.length != 0) item.goods = goods

      const type = ['image', 'video'][res.resType]

      // 首次设置底部内容时，调整分割线
      if (!!target && !item.items[1]) {
        item.divider = 0.75
      }
      this.$set(item.items, target, {
        srcId: res.id,
        type,
        fit: 'cover',
      })
    },
    genAddButton() {
      const AddButton = Vue.extend({
        render: () => {
          return (
            <el-button-group class="float-right">
              <el-button
                class="rounded-none action-button"
                type="primary"
                icon="el-icon-plus"
                onClick={() => this.addItem()}
              >
                新增轮播页
              </el-button>
            </el-button-group>
          )
        },
      })

      const tabHeader = document.querySelector('.el-tabs__header')
      tabHeader.insertAdjacentElement('afterbegin', new AddButton().$mount().$el)
    },
    changeIndex(toIndex, index) {
      const target = this.carouselList[toIndex]
      this.$set(this.carouselList, toIndex, this.carouselList[index])
      this.$set(this.carouselList, index, target)
    },
    async changeDefaultSwitch(e) {
      this.formData.defaults = e ? DEFAULT_STATE.YES : DEFAULT_STATE.NO
    },
    async getCollocationList(params) {
      const res = await getCollocationList({
        brandId: sessionStorage.brandId,
        ...params,
      })
      this.collocationData = res.body
    },
    selectCollocation({ row }) {
      const goods = row.commoditys.map((item) => {
        this.$set(this.fileGoods, item.id, item)
        return item.id
      })

      row.imgResInfo.forEach((item, index) => {
        // 当前页已有填充时新增一页
        if (this.carouselItem.items[0]) this.addItem({
          goods,
        })
        this.setContent(0, {
          goods,
          res: {
            id: item.resId,
            resType: 0,
            resUrl: item.resUrl,
          },
        })
      })
    },

    // 选择商品搭配
    async getStyleList(params) {
      const res = await getStyleList({
        ...params,
      })
      this.matchGoodsData = res.body
    },

    clickToSelectMatchGoods() {
      this.drawerMatchGoodsVisible = true
    },

    selectMatchGoods({ row }) {
      // 查找当前tab的下标
      const tabIndex = this.carouselList.findIndex(item => item._tempId === this.tab)
      // 当前页的goods
      const goods = this.carouselList[tabIndex].goods

      if (goods.length === 5) {
        return this.$message({ message: '最多添加5个商品！', type: 'warning' })
      }
      // 重复添加
      if (goods.includes(row.styleId)) {
        return this.$message({ message: '不能重复添加！', type: 'warning' })
      }
      goods.push(row.styleId)
      this.$set(this.fileGoods, row.styleId, row)
    },

    deleteSelectedGoodsItem(arr, id) {
      arr.splice(arr.indexOf(id), 1)
      delete this.fileGoods[id]
    },
  },
}
</script>

<template>
  <page-container class="h-full flex overflow-hidden flex-col" back-top>
    <page-header :content="`${isEdit ? '编辑' : '新增'}广告`" />
    <div class="flex flex-1">
      <el-tabs v-model="tab" class="flex overflow-hidden flex-col flex-1 mb-2" type="border-card">
        <el-tab-pane
          v-for="(item, index) of carouselList"
          :key="item._tempId"
          class="flex overflow-hidden h-full"
          :name="item._tempId"
        >
          <span slot="label">
            <span>{{ `第${index + 1}页` }}</span>
            <i v-if="!disabledEdit" class="el-icon-close" @click.stop="removeItem(index)" />
          </span>
          <div class="flex flex-1 justify-center">
            <div class="flex flex-1 justify-end">
              <div class="flex flex-col justify-around mr-4">
                <el-button-group>
                  <el-button type="primary" plain :disabled="disabledEdit" @click="addContent(0)">
                    {{ item.items[0] ? '替换' : '填充' }}上方
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    plain
                    :disabled="!item.items[0] || disabledEdit"
                    @click="removeContent(item, 0)"
                  />
                </el-button-group>
                <el-button type="info" :disabled="!allFilled || disabledEdit" @click="exchangeContent(item)">
                  交换位置
                </el-button>
                <el-button-group>
                  <el-button type="primary" plain :disabled="!item.items[0] || disabledEdit" @click="addContent(1)">
                    {{ item.items[1] ? '替换' : '填充' }}下方
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    plain
                    :disabled="!item.items[1] || disabledEdit"
                    @click="removeContent(item, 1)"
                  />
                </el-button-group>
              </div>
            </div>
            <div class="carousel-preview border">
              <vc-split v-model="item.divider" :decimal="4" :disabled="disabledEdit">
                <template v-if="item.items[0]" slot="before">
                  <carousel-item-content :item="item.items[0]" :map="fileMap" />
                </template>
                <template v-if="item.items[1]" slot="after">
                  <carousel-item-content :item="item.items[1]" :map="fileMap" />
                </template>
              </vc-split>
            </div>
            <div class="flex-1 flex flex-col pl-2 justify-between">
              <el-form ref="elForm" label-width="80px" :disabled="disabledEdit">
                <div class="mb-2 text-sm text-center">
                  轮播页配置
                </div>
                <el-form-item label="位置">
                  <el-input-number
                    :value="index + 1"
                    :min="1"
                    :max="carouselList.length"
                    @input="changeIndex($event - 1, index)"
                  />
                </el-form-item>
                <el-form-item label="分隔线">
                  <el-input-number
                    v-model="divider"
                    controls-position="right"
                    clearable
                    :min="1"
                    :max="100"
                    :disabled="!allFilled"
                  />
                  <span class="ml-1">%</span>
                </el-form-item>
                <el-form-item label="停留时长">
                  <template v-if="!hasVideo">
                    <el-input-number
                      v-model="duration"
                      controls-position="right"
                      clearable
                      :min="1"
                    />
                    <span class="ml-1">秒</span>
                  </template>
                  <div v-else class="align-middle text-sm inline-block">
                    广告中存在视频，将以视频播放时长做为广告停留时长。
                  </div>
                </el-form-item>
              </el-form>
              <el-divider />

              <!-- 商品关联搭配 -->
              <div class="reletiveMatch flex flex-col p-1">
                <div>
                  <el-button type="primary" icon="el-icon-plus" size="small" plain :disabled="item.goods.length === 5" @click="clickToSelectMatchGoods">
                    选择商品
                  </el-button>
                </div>

                <div v-if="!item.goods.length" class="flex justify-center items-center">
                  <el-empty description="暂无关联搭配，点击选择商品添加吧" :image-size="60" class="flex-1" />
                </div>
                <div v-else class="matchGoodsList flex-1 grid grid-cols-5 py-2 mt-2 text-xs">
                  <div v-for="(goodsId, index) in item.goods" :key="index" class="matchGoodsItem box-border flex flex-col justify-center items-center">
                    <div class="itemImage">
                      <el-image
                        style="width:100%;height:100%"
                        :src="fileGoods[goodsId].resUrl"
                        fit="contain"
                      />
                    </div>
                    <el-tooltip class="w-full text-center text-xs overflow-hidden" style="width:80%" effect="light" placement="bottom">
                      <div slot="content">
                        {{ fileGoods[goodsId].styleNo }}
                      </div>
                      <el-button class="textToolTipBtn text-black truncate" type="text">
                        {{ fileGoods[goodsId].styleNo }}
                      </el-button>
                    </el-tooltip>
                    <div class="deleteSelectedGoodsItem" @click="deleteSelectedGoodsItem(item.goods, goodsId)">
                      <i class="el-icon-close" />
                    </div>
                  </div>
                </div>
                <span class="self-end text-xs text-gray-400">{{ item.goods.length }}/5</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-form
        ref="form"
        class="p-2 mb-2 ml-2 rounded border"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        :disabled="disabledEdit"
      >
        <div class="mb-2 text-sm text-center">
          广告配置
        </div>
        <el-form-item label="标题" prop="describe">
          <el-input v-model="formData.describe" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="广告类型" prop="advertsType">
          <el-select v-model="formData.advertsType">
            <el-option :value="0" label="大屏广告机" />
          </el-select>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" icon="el-icon-check" @click="saveItem">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-drawer :visible.sync="drawerVisible" size="40%">
      <table-page v-bind="tablePageOption" ref="fileTable" class="mx-3 mb-5" auto auto-layout>
        <template slot="content:resUrl" slot-scope="{ row }">
          <template v-if="row.resType === FILE_TYPE.IMAGE">
            <el-image class="file-res" :src="row.resUrl" fit="cover" />
          </template>
          <template v-if="row.resType === FILE_TYPE.VIDEO">
            <el-image class="file-res" :src="row.videoImg" fit="cover" />
          </template>
        </template>
      </table-page>
    </el-drawer>

    <!-- 点击选择商品相关联搭配 -->
    <el-drawer :visible.sync="drawerMatchGoodsVisible" size="40%">
      <table-page v-bind="tablePageMatchGoodsOption" ref="matchGoodsTable" auto auto-layout :fields="matchGoodsFields">
        <template #content:resUrl="{ row }">
          <el-image v-if="row.resUrl" class="file-res" :src="row.resUrl" fit="cover" />
          <div v-else class="file-res flex justify-center items-center">
            暂无图片
          </div>
        </template>
      </table-page>
    </el-drawer>
  </page-container>
</template>

<style lang="less" scoped>
::v-deep{
  .el-drawer__body{
    padding: 0 10px;
  }
  .el-page-header__content{
    font-size: 16px;
  }
  .el-divider--horizontal{
    margin: 10px 0;
  }

  .el-tabs--border-card > .el-tabs__content{
    height: 100%;
    padding: 0px;
  }
}
.carousel-box {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #f2f2f2;
}

.carousel-item {
  background: #000;
}

.carousel-preview {
  aspect-ratio: 9/16;
  position: relative;

  .vc-split {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

.el-button + .el-button {
  margin-left: 0;
}

.new-item {
  position: absolute;
  top: 0;
  right: 0;
}

.file-res {
  height: 60px;
  width: 60px;
}
.matchGoodsList{
  border: 1px solid #ccc;
  border-radius: 5px;
  .matchGoodsItem{
    margin: 0 4px;
    padding:5px;
    border-radius: 4px;
    border: .5px solid #efefef;
    position: relative;
    .itemImage{
      width: 80%;
      height: 80%;
      margin-bottom: 4px;
    }
    .textToolTipBtn{
      padding: 0;
    }
    .deleteSelectedGoodsItem{
      position: absolute;
      top: -6px;
      right: -6px;
      width: 15px;
      height: 15px;
      text-align: center;
      line-height: 15px;
      border-radius: 50%;
      color: #fff;
      background-color: red;
      cursor: pointer;
    }
  }
}
</style>

<style lang="less">
.action-button {
  height: 39px;
  padding: 0 20px;
}

.carousel-video {
  height: 100%;
  object-fit: cover;
}

.play-button {
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 4px !important;
  transform: translate(-50%, -50%);
}

.vc-split__after, .vc-split__before {
  overflow: hidden;
}
</style>
