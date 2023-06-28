<script setup lang="ts">
import { Message, MessageBox } from 'element-ui'
import { convertImageSize } from '@/utils/helper'
import { getProductDisplayNone, getProductIndex, removeProductDisplayNone } from '@/api/product'
import store from '@/store'

const data = shallowRef([])
const total = ref(0)
const fields = shallowRef()
const table = ref()
const blacklistDrawer = ref(false)
const drawerLoading = ref(false)

async function open() {
  blacklistDrawer.value = true
  await getProductIndexData()
  await refresh()
}

function close() {
  blacklistDrawer.value = false
}

async function getProductIndexData() {
  drawerLoading.value = true
  const res = await getProductIndex().finally(() => drawerLoading.value = false)
  fields.value = res.body.resultList
}

async function getProductBlackList(params: any) {
  const res = await getProductDisplayNone(params)
  total.value = res.body.count
  data.value = res.body.resultList
}

async function deleteBatchBlackList() {
  if (table.value.selected.length === 0) {
    Message({
      message: '请至少选择其中一项数据！',
      type: 'warning',
    })
    return
  }
  const selectedIds = table.value.selected.map(({ productId }: any) => productId)

  await MessageBox.confirm('要从隐藏列表移出此项吗？', '提示')

  await removeProductDisplayNone({
    productIdList: selectedIds,
  })

  Message.success('移出成功')
  refresh()
  table.value.clearSelection()
  close()
}

const tablePageOption = computed(() => ({
  promise: getProductBlackList,
  actions: [
    {
      name: '批量移出',
      type: 'primary',
      click: () => deleteBatchBlackList(),
    },
  ],
  table: {
    data: data.value,
    selection: true,
    actions: {
      width: 100,
      buttons: [
        {
          tip: '移出',
          icon: 'el-icon-minus',
          type: 'info',
          click: async ({ row }: any) => {
            await MessageBox.confirm('要从隐藏列表移出此项吗？', '提示')
            await removeProductDisplayNone({
              productIdList: [row.productId],
            })
            Message.success('移出成功')
            refresh()
            close()
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

defineExpose({
  open,
  close,
})
</script>

<template>
  <ElDrawer
    size="55%"
    :visible.sync="blacklistDrawer"
    title="隐藏列表"
  >
    <div class="h-full px-4 py-2 flex-1">
      <TablePage v-bind="tablePageOption" ref="table" :fields="fields">
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
      </TablePage>
    </div>
  </ElDrawer>
</template>

<style lang='scss' scoped>
</style>
