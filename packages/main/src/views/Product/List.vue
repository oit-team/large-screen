<script setup lang="ts">
import { getProductAll, getProductIndex } from '@/api/product'

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

const tablePageOption = computed(() => ({
  promise: getProductAllData,
  table: {
    data: data.value,
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
