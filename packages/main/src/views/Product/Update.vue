<script setup lang="ts">
import { addProductInfo, getProductAttrAndInfo } from '@/api/product'
import store from '@/store'

const formRef = ref()
const config = shallowRef()

onMounted(async () => {
  const res = await getProductAttrAndInfo({ tradeId: store.state.userData.industryId })
  config.value = JSON.parse(res.body.productAttr)
})

async function handleAddProductInfo(form: any) {
  const { imgs, detailsImg, video, ...fields } = form

  await addProductInfo({
    tradeId: store.state.userData.industryId,
    productInfo: JSON.stringify(fields),
    imgs,
    detailsImg,
    video,
  })
}
</script>

<template>
  <div>
    <FormilyForm ref="formRef" :config="config" @submit="handleAddProductInfo" />
  </div>
</template>
