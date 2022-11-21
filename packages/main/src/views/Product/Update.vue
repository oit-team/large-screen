<script setup lang="ts">
import { useRoute } from 'vue-router/composables'
import { Message } from 'element-ui'
import { addProductInfo, getProductAttrAndInfo, updateProductInfo } from '@/api/product'
import store from '@/store'
import router from '@/router'

const formRef = ref()
const config = shallowRef()
const route = useRoute()
const isEdit = route.meta?.edit
const id = route.params.id

onMounted(async () => {
  const res = await getProductAttrAndInfo({
    tradeId: store.state.userData.industryId,
    productId: id,
  })
  config.value = JSON.parse(res.body.productAttr)
  const productInfo = res.body.productInfo
  if (isEdit) {
    formRef.value.form.setInitialValues({
      ...JSON.parse(productInfo.productInfo),
      imgs: productInfo.mainImgs,
      detailsImg: productInfo.detailsImgs,
      video: productInfo.videoIds,
    })
  }
})

async function addProductInfoData(form: any) {
  const { imgs, detailsImg, video, ...fields } = form

  await addProductInfo({
    tradeId: store.state.userData.industryId,
    productInfo: JSON.stringify(fields),
    imgs,
    detailsImg,
    video,
  })
}

async function updateProductInfoData(form: any) {
  const { imgs, detailsImg, video, ...fields } = form
  const res = await updateProductInfo({
    tradeId: store.state.userData.industryId,
    productId: id,
    productInfo: JSON.stringify(fields),
    imgs,
    detailsImg,
    video,
  })
}

function submitForm(form: any) {
  isEdit ? updateProductInfoData(form) : addProductInfoData(form)
  Message.success('保存成功')
  router.back()
}
</script>

<template>
  <div>
    <PageHeader :content="isEdit ? '编辑商品' : '新增商品'" />
    <FormilyForm ref="formRef" class="px-4 pb-4" :config="config" @submit="submitForm" />
  </div>
</template>
