<template>
  <div class="home">
    <header class="flex overflow-hidden bg-gray header">
      <div class="relative">
        <div @click="zoomPreview()">
          <v-swiper
            ref="swiper"
            class="bg-white product-preview"
            :options="options"
            @touchmove.native.prevent
          >
            <v-swiper-slide
              v-for="src of selectedProduct.imgResources"
              :key="src"
            >
              <v-img
                class="img"
                :src="getSmallImage(src, 'x')"
                height="100%"
                contain
              />
            </v-swiper-slide>
          </v-swiper>
        </div>
        <div
          v-if="selectedProduct.imgResources && selectedProduct.imgResources.length"
          class="absolute bottom-0 z-10 flex items-center justify-between p-2 w-full bg-black bg-opacity-40"
        >
          <div class="overflow-hidden rounded">
            <vc-btn class="px-1 min-w-0 bg-transparent" tile dark @click="() => $headerSwiper.slidePrev()">
              <vc-icon>fas fa-chevron-left</vc-icon>
            </vc-btn>
            <span class="mx-1 text-white">{{ swiperIndex + 1 }}/{{ selectedProduct.imgResources.length }}</span>
            <vc-btn class="px-1 min-w-0 bg-transparent" tile dark @click="() => $headerSwiper.slideNext()">
              <vc-icon>fas fa-chevron-right</vc-icon>
            </vc-btn>
          </div>
          <div class="flex text-white" @click="toDetails(selectedProduct.id, selectedProduct.brandId)">
            查看更多
            <vc-icon dark>
              fas fa-angle-double-right
            </vc-icon>
          </div>
        </div>
      </div>

      <div class="flex overflow-hidden flex-col mt-12 mb-6">
        <div v-if="selectedProduct.collLabel" class="mx-8 space-x-8">
          <v-chip
            v-for="(item, index) of collLabels"
            :key="index"
            class="px-6 h-10 text-2xl text-white"
            label
            dark
          >
            <vc-icon class="mr-2">
              #
            </vc-icon>
            <span>{{ item }}</span>
          </v-chip>
        </div>

        <div class="flex-1">
          <!-- eslint-disable vue/no-v-html -->
          <p
            class="description mx-8 mt-12 text-xl overflow-hidden"
            v-html="selectedProduct.collInterpretation"
          />
        </div>

        <div class="flex overflow-x-auto px-8 space-x-4">
          <ClothingPriceCard
            v-for="item of selectedProduct.commoditys"
            :key="item.id"
            :item="item"
            card-height="235"
            width="150"
          >
            <template v-if="hasCart(item)">
              <vc-btn class="mt-2" block color="success" @click="removeFormCart(item)">
                已添加
              </vc-btn>
            </template>
            <template v-else>
              <vc-btn class="mt-2" block @click="addToCart(item)">
                试试看
              </vc-btn>
            </template>
          </ClothingPriceCard>
        </div>
      </div>
    </header>

    <section class="flex category overflow-hidden">
      <v-item-group v-model="withSelectedCategory" class="flex items-center overflow-x-auto flex-1 p-4 mr-4">
        <v-item
          v-for="item of obsCategoryList"
          v-slot="{ active, toggle }"
          :key="item.styleName"
          :value="item.styleName"
        >
          <ClothingCategory
            :active="active"
            :item="item"
            @click="toggle"
          />
        </v-item>
      </v-item-group>
      <div class="flex items-stretch p-4 pb-8 space-x-2">
        <vc-btn class="h-full text-left vertical-btn" dark @click="tab = TABS.COLLOCATION">
          <vc-icon class="mb-2">
            fas fa-user
          </vc-icon>
          <span class="flex-1 vertical-text">自助挑选</span>
        </vc-btn>
        <div class="relative">
          <v-badge
            class="z-10 h-full"
            :content="shoppingCartList.length || '0'"
            color="#c00000"
            offset-x="12"
            offset-y="12"
          >
            <vc-btn class="relative h-full text-left vertical-btn" @click="tab = TABS.SHOPPING_CART">
              <vc-icon class="mb-2">
                fas fa-shopping-cart
              </vc-icon>
              <span class="flex-1 vertical-text">我的试穿</span>
            </vc-btn>
          </v-badge>
          <div
            v-click-outside="() => changeBtn(false)"
            class="absolute left-0 -bottom-7 px-0"
          >
            <vc-btn
              v-if="!deleteConfirm"
              text
              @click="changeBtn(true)"
            >
              <vc-icon size="16" color="#d9d9d9">
                fas fa-trash-alt
              </vc-icon>
            </vc-btn>
            <vc-btn
              v-else
              class="px-0 w-full"
              text
              color="error"
              @click="removeFormCart()"
            >
              确定
            </vc-btn>
          </div>
        </div>
      </div>
    </section>

    <keep-alive>
      <section class="bg-gray overflow-hidden">
        <template v-if="tab === TABS.COLLOCATION">
          <div
            ref="collocationList"
            class="h-full max-w-full inline-grid grid-rows-2 grid-flow-col gap-x-4 py-2 px-8 items-center overflow-x-auto"
            @scroll.passive="scroll"
          >
            <Collocation
              v-for="item of collocationList"
              :key="item.id"
              class="transition"
              :class="`elevation-${selectedProduct === item ? 5 : 0}`"
              :item="item"
              width="225"
            />
          </div>
          <div v-if="!collocationList.length" class="flex-1 flex-center">
            <p class="text-xl">
              暂无相关搭配
            </p>
          </div>
        </template>

        <template v-if="tab === TABS.SHOPPING_CART">
          <div
            ref="shoppingCartList"
            class="h-full max-w-full inline-grid grid-rows-2 grid-flow-col gap-x-4 py-2 px-8 items-center overflow-x-auto"
          >
            <ClothingPriceCard
              v-for="item of shoppingCartListFiltered"
              :key="item.id"
              :item="item"
              width="210"
              height="400"
            >
              <vc-btn
                class="mt-2 bg-white"
                fab
                small
                color="error"
                text
                @click="removeFormCart(item)"
              >
                <vc-icon class="text-red-300" size="18">
                  fas fa-trash-alt
                </vc-icon>
              </vc-btn>
            </ClothingPriceCard>
          </div>
          <div v-if="!shoppingCartListFiltered.length" class="flex-col flex-1 flex-center">
            <p class="text-xl">
              未选择任何商品
            </p>
            <div>
              <vc-btn dark large @click="tab = TABS.COLLOCATION">
                去挑选
              </vc-btn>
            </div>
          </div>
        </template>
      </section>
    </keep-alive>

    <footer class="bg-black">
      <v-img
        src="assets/img/e374b653ed48e289db3236b04499a2c.png"
        position="bottom -110px left 50%"
        width="100%"
        height="100%"
      />
    </footer>

    <ProductPreview v-model="showPreview" :index="swiperIndex" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { isEmpty, keyBy } from 'lodash'
import { enterShopPage } from '../api/frame'
import ClothingPriceCard from '@/components/business/Clothing/PriceCard.vue'
import Collocation from '@/components/business/Clothing/Collocation.vue'
import ClothingCategory from '@/components/business/Clothing/Category.vue'
import ProductPreview from '@/components/business/ProductPreview/ProductPreview.vue'
import { getCategory, getProductList } from '@/api/product'
import { getSmallImage } from '@/utils/helper'

const TABS = {
  COLLOCATION: 0,
  SHOPPING_CART: 1,
}

const scrollRecord = {
  collocationList: 0,
  shoppingCartList: 0,
}

let promise = null
let timer = null

export default {
  name: 'Home',

  components: {
    ClothingPriceCard,
    ClothingCategory,
    Collocation,
    ProductPreview,
  },

  data() {
    this.TABS = TABS
    this.options = {}
    this.$headerSwiper = null
    return {
      tab: TABS.COLLOCATION,
      swiperIndex: 0,
      collocationListCache: {},
      loading: false,
      page: 1,
      deleteConfirm: false,
      categoryList: [],
      selectedCategory: undefined,
      selectedCartCategory: undefined,
      showPreview: false,
    }
  },

  computed: {
    ...mapState(['selectedProduct']),
    ...mapState('shoppingCart', {
      shoppingCartList: 'list',
    }),
    shoppingCartListFiltered() {
      const data = this.shoppingCartList.filter(item => item.styleCategory === this.selectedCartCategory)
      if (data.length)
        return data

      return this.shoppingCartList
    },
    withSelectedCategory: {
      set(value) {
        if (this.tab === TABS.COLLOCATION)
          this.selectedCategory = value

        if (this.tab === TABS.SHOPPING_CART)
          this.selectedCartCategory = value
      },
      get() {
        if (this.tab === TABS.COLLOCATION)
          return this.selectedCategory

        if (this.tab === TABS.SHOPPING_CART)
          return this.selectedCartCategory

        return ''
      },
    },
    collocationList: {
      set(value) {
        this.$set(this.collocationListCache, this.selectedCategory, value)
      },
      get() {
        return this.collocationListCache[this.selectedCategory] || []
      },
    },
    obsCategoryList() {
      switch (this.tab) {
        case TABS.COLLOCATION:
          return this.categoryList
        case TABS.SHOPPING_CART:
          return this.shoppingCartCategory
        default:
          return []
      }
    },
    categoryMap() {
      return keyBy(this.categoryList, 'styleName')
    },
    shoppingCartCategory() {
      return this.shoppingCartList.reduce((prev, item) => {
        if (prev[item.styleCategory]) {
          prev[item.styleCategory].totalNum++
        } else {
          prev[item.styleCategory] = {
            styleName: item.styleCategory,
            ...this.categoryMap[item.styleCategory],
            totalNum: 1,
          }
        }
        return prev
      }, {})
    },
    collLabels() {
      return this.selectedProduct.collLabel?.replaceAll('，', ',').split(',')
    },
  },

  watch: {
    selectedCategory() {
      this.page = 1
      this.loading = false
      clearTimeout(timer)
      this.loadData()
      this.saveScrollRecord(0)
      this.setScrollRecord()
    },
    tab() {
      this.saveScrollRecord()
      this.setScrollRecord()
      // if (this.tab === TABS.COLLOCATION) {
      //   this.loading = true
      //   scrollRecord.shoppingCartList = this.$refs.shoppingCartList.scrollLeft
      //   this.$nextTick(() => {
      //     this.$refs.collocationList.scrollLeft = scrollRecord.collocationList
      //     setTimeout(() => {
      //       this.loading = false
      //     })
      //   })
      // }
      // if (this.tab === TABS.SHOPPING_CART) {
      //   scrollRecord.collocationList = this.$refs.collocationList.scrollLeft
      //   this.$nextTick(() => {
      //     this.$refs.shoppingCartList.scrollLeft = scrollRecord.shoppingCartList
      //   })
      // }
    },
  },

  created() {
    this.setSwiperOptions()
  },

  mounted() {
    this.$headerSwiper = this.$refs.swiper.$swiper
    this.getCategory()
    this.loadData()
  },

  activated() {
    this.setScrollRecord()

    const { query } = this.$route
    enterShopPage({
      devId: query.devId,
      brandId: query.brandId,
    })
  },

  deactivated() {
    this.saveScrollRecord()
  },

  methods: {
    getSmallImage,
    setSwiperOptions() {
      this.options = {
        on: {
          slideChange: () => {
            this.swiperIndex = this.$headerSwiper.realIndex
          },
        },
      }
    },
    addToCart(item) {
      this.$store.commit('shoppingCart/add', item)
    },
    hasCart(item) {
      return this.shoppingCartList.some(someItem => someItem.id === item.id)
    },
    removeFormCart(item) {
      if (item) {
        this.$store.commit('shoppingCart/remove', item)
      } else {
        this.$store.commit('shoppingCart/clear')
        this.deleteConfirm = false
      }
    },
    loadData() {
      if (this.loading)
        return
      this.loading = true

      const getData = () => getProductList({
        pageNum: this.page,
        pageSize: 30,
        brandId: localStorage.getItem('brandId'),
        styleCategory: this.selectedCategory,
      })

      promise = getData()
      const current = promise

      promise.then((res) => {
        // 对比promise是否是当前的
        if (promise !== current)
          return
        const { collocationList } = res.body
        if (collocationList.length) {
          this.collocationList = this.page === 1
            ? collocationList
            : this.collocationList.concat(collocationList)
          this.page++

          if (isEmpty(this.$store.state.selectedProduct))
            this.$store.commit('selectProduct', this.collocationList[0])
        }
      })
        .finally(() => {
          // 延迟一会，避免频繁请求
          timer = setTimeout(() => {
            this.loading = false
          }, 1000)
        })
    },
    async getCategory() {
      const res = await getCategory()
      this.categoryList = res
    },
    scroll(e) {
      const {
        clientWidth,
        scrollLeft,
        scrollWidth,
      } = e.target

      if (scrollWidth - clientWidth - scrollLeft < 500)
        this.loadData()
    },
    changeBtn(value) {
      this.deleteConfirm = value
    },
    zoomPreview() {
      this.showPreview = true
      // this.$router.push({
      //   name: 'Carousel',
      //   params: { preview: true },
      // })
    },
    saveScrollRecord(scrollLeft) {
      if (this.$refs.shoppingCartList)
        scrollRecord.shoppingCartList = scrollLeft ?? this.$refs.shoppingCartList.scrollLeft

      if (this.$refs.collocationList)
        scrollRecord.collocationList = scrollLeft ?? this.$refs.collocationList.scrollLeft
    },
    setScrollRecord() {
      this.loading = true
      this.$nextTick(() => {
        if (this.$refs.shoppingCartList)
          this.$refs.shoppingCartList.scrollLeft = scrollRecord.shoppingCartList

        if (this.$refs.collocationList)
          this.$refs.collocationList.scrollLeft = scrollRecord.collocationList

        setTimeout(() => {
          this.loading = false
        })
      })
    },
    toDetails(id, brandId) {
      this.$router.push({
        name: 'MatchingList',
        params: {
          id,
          brandId,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$screen-width: 1080px;
$screen-height: 1920px;

$header-height: 620px;
$category-height: 180px;
$footer: 250px;

$product-preview-width: $header-height / 4 * 3;

.home {
  width: $screen-width;
  height: $screen-height;
  aspect-ratio: 9/16;
  display: grid;
  grid-template-rows: $header-height $category-height 1fr $footer;

  .header {
    height: $header-height;

    .product-preview {
      flex-shrink: 0;
      width: $product-preview-width;
      height: $header-height;
    }
  }

  .category {
    height: $category-height;
  }

  .product-list {
    @apply flex-1 bg-gray;
  }

  ::v-deep .vertical-btn {
    flex-direction: column;
    padding: 10px 0;

    .v-btn__content {
      flex-direction: inherit;
    }

    .vertical-text {
      text-align: center;
      writing-mode: vertical-lr;
    }
  }
}

.description {
  display: -webkit-box;
  overflow: hidden;
  max-height: calc(1.75rem * 3);
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
