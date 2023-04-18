<script setup lang="ts">
import { Message, MessageBox } from 'element-ui'
import { convertImageSize } from '@/utils/helper'
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
    {
      slot: 'multiple',
    },
  ],
  table: {
    data: data.value,
    selection: true,
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

// 奖池：批量上下架
async function handleMultiple(state: number) {
  if (table.value.selected.length === 0) {
    Message({
      message: '请至少选择其中一项数据！',
      type: 'warning',
    })
    return
  }
  const selectedIds = table.value.selected.map(({ productId }: any) => productId)
  const jackpotType = ['下架', '上架'][state]

  await MessageBox(`确定要${jackpotType}吗？`, '提示', 'warning')

  await updateProductStateData({
    id: selectedIds,
    productState: state,
  })
  Message.success(`${jackpotType}成功！`)
  table.value.loadData()
  table.value.clearSelection()
}
</script>

<template>
  <div class="p-2">
    <TablePage v-bind="tablePageOption" ref="table" :fields="fields">
      <!-- <template #content:productUrl="{ row }">
        <ElImage :src="convertImageSize(row.imgUrl)" class="max-w-100px max-h-100px file-res" />
      </template> -->
      <template #column:productUrl>
        <ElTableColumn
          prop="productUrl"
          label="图片"
          align="center"
          width="140"
        >
          <div />
          <template slot-scope="scope">
            <ElImage v-if="scope.row.productUrl" :src="convertImageSize(scope.row.productUrl)" class="block w-70px h-70px mx-auto" fit="cover" />
            <div v-else class="text-gray-300">
              暂无
            </div>
          </template>
        </ElTableColumn>
      </template>
      <template slot="actions:multiple">
        <ElDropdown class="mx-2">
          <ElButton type="primary" size="small">
            批量管理<i class="el-icon-arrow-down el-icon--right" />
          </ElButton>
          <ElDropdownMenu slot="dropdown">
            <ElDropdownItem @click.native="handleMultiple(1)">
              上架
            </ElDropdownItem>
            <ElDropdownItem @click.native="handleMultiple(0)">
              下架
            </ElDropdownItem>
          </ElDropdownMenu>
        </ElDropdown>
      </template>
    </TablePage>
  </div>
</template>

<style lang='scss' scoped>
</style>
