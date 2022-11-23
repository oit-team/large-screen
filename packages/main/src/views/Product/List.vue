<script setup lang="ts">
import { Message, MessageBox } from 'element-ui'
import { deleteProductInfo, getProductAll, getProductIndex, updateProductState } from '@/api/product'
import router from '@/router'
import store from '@/store'

const data = shallowRef([])
const total = ref(0)
const fields = shallowRef()
const table = ref()

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
      width: 150,
      buttons: [
        {
          tip: '编辑',
          icon: 'el-icon-edit',
          type: 'primary',
          click: ({ row }: any) => router.push(`/product/edit/${row.productId}`),
        },
        {
          tip: ({ row }: any) => ['上架', '下架'][row.productStateKey],
          icon: ({ row }: any) => ['el-icon-top', 'el-icon-bottom'][row.productStateKey],
          type: 'warning',
          click: async ({ row }: any) => {
            const state = row.productStateKey ? 0 : 1
            const type = ['上架', '下架'][row.productStateKey]
            await MessageBox.confirm(`要${type}该商品吗？`, '提示')
            await updateProductStateData({
              id: row.productId,
              productState: state,
            })
            Message.success(`${type}成功`)
            row.productStateKey = state
          },
        },
        {
          tip: '删除',
          icon: 'el-icon-delete',
          type: 'danger',
          click: async ({ row }: any) => {
            await MessageBox.confirm('要删除该商品吗？', '提示')
            const res = await deleteProductInfo({
              id: row.productId,
              brandId: store.state.userData.brandId,
            })
            Message.success('删除成功')
            refresh()
          },
        },
      ],
    },
  },
  pager: {
    total: total.value,
  },
}))

function refresh() {
  table.value.loadData()
}

onActivated(refresh)
</script>

<template>
  <div class="p-2">
    <TablePage v-bind="tablePageOption" ref="table" :fields="fields">
      <template #content:productUrl="{ row }">
        <ElImage :src="row.imgUrl" class="max-w-100px max-h-100px" />
      </template>
    </TablePage>
  </div>
</template>
