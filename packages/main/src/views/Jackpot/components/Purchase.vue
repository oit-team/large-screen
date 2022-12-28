<script setup>
import { SearchForm } from '@oit/element-ui-extend'
import Big from 'big.js'
import { Message, MessageBox } from 'element-ui'
import { addProcurementOrder, getIndustryAll, getJackpotStyleList, getShopByIntegralNum } from '@/api/jackpot'

import { fieldStorage } from '@/utils/fieldStorage'

import { convertImageSize } from '@/utils/helper'

const data = shallowRef([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(30)
const searchForm = ref({})
const fields = ref([])
const fieldProps = ref({})
const shoppingCartDrawer = ref(false)
const addShopCartLoading = ref(false)
const paymentRadio = ref(1)
const shoppingCartData = ref({})
const shoppingCartCount = ref({})
const shoppingCartList = computed(() => Object.values(shoppingCartData.value))
const instance = getCurrentInstance().proxy
const totalIntegral = ref(0)
const allIntegral = ref(0)
const totalPrice = computed(() => {
  return shoppingCartList.value.reduce((total, item) => {
    return new Big(+item.jackpotBuyPrice).times(shoppingCartCount.value[item.jackpotId]).plus(total).toNumber()
  }, 0)
})

async function getFields() {
  const json = await fieldStorage.get('1669621663084')
  fields.value = JSON.parse(json)
}
getFields()

async function getIntegralNum() {
  const res = await getShopByIntegralNum({
    payIntegral: totalPrice.value,
  })
  allIntegral.value = res.body.integralNumber
  totalIntegral.value = res.body.payIntegralNumber
}

// 获得购物车列表数据
async function getJackpotStyleListData() {
  const res = await getJackpotStyleList({
    ...searchForm.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  })
  total.value = res.body.count
  data.value = res.body.resultList
}

watchEffect(getJackpotStyleListData)

// 提交购物车
async function addProcurementOrderData() {
  const paymentType = paymentRadio.value === 1 ? '支付宝' : '积分兑换'
  await MessageBox.confirm(`确定使用${paymentType}支付吗？`, '提示', { type: 'warning' })
  addShopCartLoading.value = true

  const res = await addProcurementOrder({
    orderTotalPrice: totalPrice.value,
    payType: paymentRadio.value,
    styles: shoppingCartList.value.map(item => ({
      jackpotId: item.jackpotId,
      jackpotNum: shoppingCartCount.value[item.jackpotId],
    })),
  }).finally(() => {
    addShopCartLoading.value = false
  })

  Message.success('采购成功')
  this.getJackpotStyleListData()
  shoppingCartData.value = {}
  shoppingCartCount.value = {}
  shoppingCartDrawer.value = false
}

// 加入购物车
function addCart(item) {
  shoppingCartData.value = {
    ...shoppingCartData.value,
    [item.jackpotId]: item,
  }
  shoppingCartCount.value = {
    ...shoppingCartCount.value,
    [item.jackpotId]: (shoppingCartCount.value[item.jackpotId] || 0) + 1,
  }
}

// 移出购物车内列表
function removeCart(item) {
  instance.$delete(shoppingCartData.value, item.jackpotId)
  instance.$delete(shoppingCartCount.value, item.jackpotId)
}

// 查询搜索栏所属行业
async function loadIndustryState() {
  const res = await getIndustryAll()
  const industryStateList = res.body.resultList

  const newIndustryStateList = industryStateList.map(item => ({
    optionKey: item.industryId,
    optionValue: item.industryName,
  }))

  fieldProps.value = {
    industryId: {
      options: newIndustryStateList,
    },
  }
}
loadIndustryState()

watch(shoppingCartDrawer, () => {
  getIntegralNum()
})
</script>

<template>
  <div class="h-full flex flex-col">
    <SearchForm :fields="fields" :field-props="fieldProps" @query="searchForm = $event" @reset="searchForm = $event" />
    <div>
      <ElButton size="small" type="primary" @click="shoppingCartDrawer = true">
        购物车
      </ElButton>
    </div>
    <div class="flex-1 overflow-auto mt-2">
      <div v-if="data.length !== 0" class="grid lt-xl:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 pb-2">
        <ElCard v-for="item of data" :key="item.jackpotId" :body-style="{ padding: 0 }">
          <ElImage :src="convertImageSize(item.impUrl)" fit="contain" class="w-full aspect-square" />
          <div class="p-2">
            <div>{{ item.vouchersName }}</div>
            <div class="text-xs grid grid-cols-2">
              <span>库存：{{ item.jackpotInventory }}</span>
              <span>价格：{{ item.jackpotBuyPrice }}</span>
            </div>
            <div class="flex mt-2">
              <ElButton size="mini" :disabled="item.jackpotInventory <= 0" @click="shoppingCartCount[item.jackpotId] ? removeCart(item) : addCart(item)">
                {{ shoppingCartCount[item.jackpotId] ? `已添加(${shoppingCartCount[item.jackpotId]})` : '添加购物车' }}
              </ElButton>
            </div>
          </div>
        </ElCard>
      </div>
      <ElEmpty v-else description="暂无数据" />
    </div>
    <ElPagination
      class="py-2"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="pageSize = $event"
      @current-change="pageNum = $event"
    />

    <ElDrawer
      title="购物车"
      :visible.sync="shoppingCartDrawer"
      direction="rtl"
      size="40%"
    >
      <div class="flex flex-col h-full">
        <ElTable
          :data="shoppingCartList"
          style="width: 100%"
          height="auto"
        >
          <ElTableColumn
            prop="vouchersName"
            label="图片"
            width="100"
          >
            <template #default="{ row }">
              <ElImage v-if="row.impUrl" :src="convertImageSize(row.impUrl)" class="w-60px h-60px" fit="cover" />
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="vouchersName"
            label="名称"
          />
          <ElTableColumn
            prop="jackpotInventory"
            label="库存"
          />
          <ElTableColumn
            prop="jackpotBuyPrice"
            label="单价"
          />
          <ElTableColumn
            label="数量"
            width="180"
          >
            <template #default="{ row }">
              <ElInputNumber v-model="shoppingCartCount[row.jackpotId]" :min="1" :max="row.jackpotInventory" label="描述文字" size="small" />
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="操作"
            width="100"
          >
            <template #default="{ row }">
              <ElButton icon="el-icon-delete" size="small" type="danger" circle @click="removeCart(row)" />
            </template>
          </ElTableColumn>
        </ElTable>
        <div class="p-2 flex flex-col">
          <div class="flex">
            <div class="py-2">
              总计：￥{{ totalPrice }}
            </div>
            <div v-if="paymentRadio === 2" class="py-2">
              <div class="flex justify-around ml-8">
                店铺剩余积分：{{ allIntegral }}
                购买所需积分：{{ totalIntegral }}
              </div>
              <div v-if="totalIntegral > allIntegral" class="ml-8 text-sm text-red-400">
                (*剩余积分不足以兑换)
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div>
              <span class="text-red">*</span>
              <span>请选择支付方式：</span>
              <ElRadioGroup v-model="paymentRadio">
                <ElRadio :label="1">
                  支付宝
                </ElRadio>
                <ElRadio :label="2">
                  积分兑换
                </ElRadio>
              </ElRadioGroup>
            </div>

            <ElButton
              type="primary"
              :loading="addShopCartLoading"
              :disabled="paymentRadio === 2 && totalIntegral > allIntegral"
              @click="addProcurementOrderData()"
            >
              {{ paymentRadio === 2 ? '提交' : '下一步' }}
            </ElButton>
          </div>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>
