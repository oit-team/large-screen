<script setup lang="ts">
import { useRoute } from 'vue-router/composables'
import { Message, MessageBox } from 'element-ui'
import schema from './schema/form.json'
import router from '@/router'
import { addActivity, getActivityById, updateActivity } from '@/api/jackpot'
import { convertImageSize } from '@/utils/helper'

const route = useRoute()
const isEdit = route.query.type === 'edit'
const updateGoodsLoading = ref(false)
const formRef = ref()
const activityInfo = ref()

onMounted(async () => {
  if (isEdit) {
    await getDetailInfo()
    formRef.value.form.setInitialValues({
      ...activityInfo.value,
    })
  }
})

async function getDetailInfo() {
  const res = await getActivityById({
    activityId: route.query.activityId,
  })
  activityInfo.value = res.body
}

async function submitForm() {
  await MessageBox.confirm('确定要保存吗?', '提示', {
    type: 'warning',
  })

  formRef.value.form.submit(async (form: any) => {
    if (isEdit) {
      await updateActivity({
        ...form,
        activityId: route.query.activityId,
      })
    }
    else {
      await addActivity({
        ...form,
      })
    }
    Message.success('成功')
    router.back()
  })
}
</script>

<template>
  <div>
    <PageHeader :content="isEdit ? '编辑活动' : '新增活动'">
      <template #actions>
        <ElButton v-if="isEdit" type="primary" :loading="updateGoodsLoading" @click="submitForm()">
          保存
        </ElButton>
      </template>
    </PageHeader>
    <FormilyForm ref="formRef" class="px-4 pb-4" :config="schema" />
  </div>
</template>
