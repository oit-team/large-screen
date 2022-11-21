<script setup lang="ts">
import { MessageBox } from 'element-ui'
import { getProductAll, getProductIndex, updateProductState } from '@/api/product'
import router from '@/router'
import store from '@/store'

const data = shallowRef([])
const total = ref(0)
const fields = shallowRef()

async function getProductAllData(params: any) {
  const res = await getProductAll(params)
  total.value = res.body.count
  data.value = res.body.resultList
}

async function getProductIndexData() {
  const res = await getProductIndex()
  fields.value = res.body.resultList
}
getProductIndexData()

async function updateProductStateData(params: any) {
  const res = await updateProductState({
    brandId: store.state.userData.brandId,
    ...params,
  })
}

const tablePageOption = computed(() => ({
  promise: getProductAllData,
  actions: [
    {
      name: '新增',
      type: 'primary',
      click: () => router.push('/product/new'),
    },
  ],
  table: {
    data: data.value,
    actions: {
      buttons: [
        {
          tip: '编辑',
          icon: 'el-icon-edit',
          click: ({ row }: any) => router.push(`/product/edit/${row.productId}`),
        },
        {
          tip: ({ row }: any) => ['上架', '下架'][row.productState],
          icon: ({ row }: any) => ['el-icon-top', 'el-icon-bottom'][row.productState],
          click: async ({ row }: any) => {
            const state = row.productState ? 0 : 1
            const type = ['上架', '下架'][row.productState]
            await MessageBox.confirm(`要${type}该商品吗？`, '提示')
            await updateProductStateData({
              id: row.productId,
              productState: state,
            })
            row.productState = state
          },
        },
      ],
    },
  },
  pager: {
    total: total.value,
  },
}))
</script>

<template>
  <div class="p-2">
    <TablePage v-bind="tablePageOption" auto :fields="fields" />
  </div>
</template>
