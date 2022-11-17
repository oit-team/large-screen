<script setup lang="ts">
import { createForm } from '@formily/core'
import type { ISchema } from '@formily/vue'
import { FormProvider, createSchemaField, useField, useFieldSchema, useForm } from '@formily/vue'
import {
  ArrayCards,
  ArrayItems,
  ArrayTable,
  ArrayTabs,
  Cascader,
  Checkbox,
  DatePicker,
  Editable,
  Form,
  FormButtonGroup,
  FormCollapse,
  FormDialog,
  FormDrawer,
  FormGrid,
  FormItem,
  FormLayout,
  FormStep,
  FormTab,
  Input,
  InputNumber,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  Switch,
  TimePicker,
  Transfer,
} from '@formily/element'
import { Button } from 'element-ui'
import Vue from 'vue'
import type { PropType } from 'vue'
import { Upload as CustomUpload } from '@oit/element-ui-extend'
import { dictitemInfoAllMethod } from '@/api/common'
import { getToken } from '@/utils/auth'

const props = defineProps({
  scope: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object as PropType<{
      form: { labelCol: number; wrapperCol: number }
      schema: ISchema
    }>,
    default: () => ({}),
  },
})

const Upload = defineComponent({
  inheritAttrs: false,
  setup() {
    const fieldRef = useField()
    return () => {
      return h(CustomUpload, {
        props: {
          action: '/api/system/file/uploadFile',
          listType: 'picture-card',
          ...fieldRef.value.componentProps,
          onChange: (file: any, _files: any) => {
            const files = _files
              .filter((item: any) => item.response)
              .map((item: any) => {
                file.url = item.response.data.thumbUrl
                const data = item.response.data
                return {
                  fileUrl: data.fileUrl,
                  thumbUrl: data.thumbUrl,
                }
              })
            fieldRef.value.setValue(files)
          },
        },
      }, [h('i', { class: 'el-icon-plus' })])
    }
  },
})

const formRef = ref()
const form = computed(() => formRef.value.form)

const { SchemaField } = createSchemaField({
  components: {
    Form,
    FormLayout,
    FormItem,
    FormGrid,
    FormButtonGroup,
    Space,
    Submit,
    Reset,
    Input,
    Password,
    Select,
    DatePicker,
    TimePicker,
    InputNumber,
    Transfer,
    Cascader,
    Radio,
    Checkbox,
    Switch,
    ArrayCards,
    ArrayItems,
    ArrayTable,
    ArrayTabs,
    FormCollapse,
    FormStep,
    FormTab,
    Editable,
    PreviewText,
    Upload,
  },
})

const formCreated = ref(createForm())

function useDictionary(type: string) {
  return async (field: any) => {
    field.loading = true
    const res = await dictitemInfoAllMethod({
      brandId: '1',
      type,
      userId: '0',
    }).finally(() => {
      field.loading = false
    })
    field.dataSource = res.body?.result?.map((item: any) => ({
      label: item.dicttimeDisplayName,
      value: item.dictitemCode,
    }))
  }
}

const fieldScope = {
  useDictionary,
  ...props.scope,
}

defineExpose({
  form,
})
</script>

<template>
  <FormProvider ref="formRef" class="rounded-lg p-2" :form="formCreated">
    <FormLayout :label-col="6" :wrapper-col="10">
      <SchemaField :schema="config.schema" :scope="fieldScope" />
      <FormButtonGroup>
        <Submit @submit="$listeners.submit">
          提交
        </Submit>
      </FormButtonGroup>
    </FormLayout>
  </FormProvider>
</template>

<style lang="scss" scoped>
::v-deep {
  .el-input-number {
    input {
      text-align: left;
    }
  }
}
</style>
