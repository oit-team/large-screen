<script setup lang="ts">
import { createForm } from '@formily/core'
import type { ISchema } from '@formily/vue'
import { FormProvider, createSchemaField, useField } from '@formily/vue'
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
import type { PropType } from 'vue'
import { Upload as CustomUpload } from '@oit/element-ui-extend'
import FEditor from './FEditor'

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
  effects: {
    type: Function,
    default: () => {},
  },
})

const Upload = defineComponent({
  inheritAttrs: false,
  setup() {
    const fieldRef = useField<any>()
    const initialValue = fieldRef.value.initialValue || []

    return function (this: any) {
      return h(CustomUpload, {
        ref: 'upload',
        props: {
          action: '/api/system/file/uploadFile',
          listType: 'picture-card',
          fileKeyMap: {
            uid: 'resId',
            url: 'thumbUrl',
          },
          ...fieldRef.value.componentProps,
          fileList: initialValue,
          onChange: (file: any, _files: any) => {
            const files = _files
              .map((item: any) => {
                const data = item.response?.data || item._data
                if (!data) return null

                item.url = data.thumbUrl
                return {
                  fileUrl: data.fileUrl,
                  thumbUrl: data.thumbUrl,
                }
              })
              .filter((item: any) => item)

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
    Editor: FEditor,
  },
})

const formCreated = ref(createForm({}))

const fieldScope = {
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
