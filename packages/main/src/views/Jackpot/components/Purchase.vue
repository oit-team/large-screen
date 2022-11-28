<script setup>
import { SearchForm } from '@oit/element-ui-extend'
import Big from 'big.js'
import { Message } from 'element-ui'
import { addProcurementOrder, getJackpotStyleList } from '@/api/jackpot'
import { fieldStorage } from '@/utils/fieldStorage'

const data = shallowRef([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(30)
const searchForm = ref({})
const fields = ref([])
const shoppingCartDrawer = ref(false)
const shoppingCartData = ref({})
const shoppingCartCount = ref({})
const shoppingCartList = computed(() => Object.values(shoppingCartData.value))
const instance = getCurrentInstance().proxy
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

async function addProcurementOrderData() {
  const res = await addProcurementOrder({
    orderTotalPrice: totalPrice.value,
    styles: shoppingCartList.value.map(item => ({
      jackpotId: item.jackpotId,
      jackpotNum: shoppingCartCount.value[item.jackpotId],
    })),
  })
  Message.success('采购成功')
  shoppingCartDrawer.value = false
}

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

function removeCart(item) {
  instance.$delete(shoppingCartData.value, item.jackpotId)
  instance.$delete(shoppingCartCount.value, item.jackpotId)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <SearchForm :fields="fields" @query="searchForm = $event" @reset="searchForm = $event" />
    <div>
      <ElButton size="small" type="primary" @click="shoppingCartDrawer = true">
        购物车
      </ElButton>
    </div>
    <div class="flex-1 overflow-auto mt-2">
      <div class="grid lt-xl:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 pb-2">
        <ElCard v-for="item of data" :key="item.jackpotId" :body-style="{ padding: 0 }">
          <img :src="item.impUrl" class="w-full aspect-square">
          <div class="p-2">
            <div>{{ item.vouchersName }}</div>
            <div class="text-xs grid grid-cols-2">
              <span>库存：{{ item.jackpotInventory }}</span>
              <span>价格：{{ item.jackpotBuyPrice }}</span>
            </div>
            <div class="flex mt-2">
              <ElButton size="mini" @click="shoppingCartCount[item.jackpotId] ? removeCart(item) : addCart(item)">
                {{ shoppingCartCount[item.jackpotId] ? `已添加(${shoppingCartCount[item.jackpotId]})` : '添加购物车' }}
              </ElButton>
            </div>
          </div>
        </ElCard>
      </div>
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
              <ElImage v-if="row.impUrl" :src="row.impUrl" class="w-60px h-60px" fit="cover" />
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
        <div class="p-2 flex justify-between items-center">
          <div>总计：￥{{ totalPrice }}</div>
          <ElButton type="primary" @click="addProcurementOrderData()">
            提交
          </ElButton>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>
