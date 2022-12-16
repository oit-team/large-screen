<script setup lang="ts">
import { useRoute } from 'vue-router/composables'
import { Message } from 'element-ui'
import { addProductInfo, getGoodsTypeConfig, getProductAttrAndInfo, updateProductInfo } from '@/api/product'
import store from '@/store'
import router from '@/router'

const updateGoodsLoading = ref(false)
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

async function submitForm() {
  formRef.value.form.submit(async (form: any) => {
    updateGoodsLoading.value = true
    await (isEdit ? updateProductInfoData(form) : addProductInfoData(form)).finally(() => {
      updateGoodsLoading.value = false
    })
    Message.success('保存成功')
    router.back()
  })
}

async function getGoodsTypeConfigData(field: any) {
  field.loading = true
  const res = await getGoodsTypeConfig().finally(() => {
    field.loading = false
  })
  field.dataSource = res.body?.result
}
</script>

<template>
  <div>
    <PageHeader :content="isEdit ? '编辑商品' : '新增商品'">
      <template #actions>
        <ElButton type="primary" :loading="updateGoodsLoading" @click="submitForm()">
          保存
        </ElButton>
      </template>
    </PageHeader>
    <FormilyForm ref="formRef" class="px-4 pb-4" :config="config" :scope="{ getGoodsTypeConfigData }" />
  </div>
</template>
