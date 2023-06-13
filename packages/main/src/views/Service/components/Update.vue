<script>
import { Editor } from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/i18n/zh-cn'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Upload } from '@oit/element-ui-extend'
import { addOrUpdateServiceInfo, getServiceInfoDetail } from '@/api/serviceManage'

export default {
  name: 'ServiceUpdate',
  components: {
    VcUpload: Upload,
    Editor,
  },
  props: {},
  data: () => ({
    isLoading: false,
    updateServiceLoading: false,
    isEdit: false, // 是否编辑
    pageTitle: '',
    id: '',
    maxMB: 60,
    detail: '',
    editorHtml: '',
    editorRemarkHtml: '',
    form: {
      name: '',
      content: '',
      price: '',
      tags: '',
      // relevanceType: '',
      shelfStatus: '',
      serviceStatus: '',
      resourceType: 1,
      resourceList: [], // 资源暂时支持图片上传 resourceType: 1
      remarks: '',
      labels: '', // 标签
      detail: '', // 详情
    },
    checkedImgList: [],
    dynamicTags: [],
    inputVisible: false,
    inputValue: '',
    rules: {
      name: [
        { required: true, message: '请输入名称名称', trigger: 'blur' },
        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
      ],
      content: [
        { required: true, message: '请输入服务内容', trigger: 'blur' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
      ],
      price: [
        { required: true, message: '请输入价格', trigger: 'blur' },
      ],
      // relevanceType: [
      //   { required: true, message: '请选择关联对象类型', trigger: 'blur' },
      // ],
      shelfStatus: [
        { required: true, message: '请选择上架状态', trigger: 'blur' },
      ],
      serviceStatus: [
        { required: true, message: '请选择服务状态', trigger: 'blur' },
      ],
      // resourceList: [
      //   { required: true, message: '请选择上传图片', trigger: 'blur' },
      // ],
    },
  }),
  computed: {
    uploadOption() {
      return {
        drag: true,
        showFileList: true,
        multiple: true,
        maxSize: 1024 * this.maxMB,
        limit: 6,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onError: (e, file) => {
          this.$message.error(`${file.name} 上传失败，请重试！`)
        },
      }
    },
  },
  created() {
    const params = this.$route?.query
    if (params.id) {
      this.id = params?.id
      this.isEdit = params?.isEdit ? params?.isEdit : false
      this.isCheck = params?.isCheck ? params?.isCheck : false
      this.pageTitle = params?.isCheck ? '查看' : '编辑'
      this.getServiceInfoDetail()
    }
    else {
      this.isEdit = false
      this.pageTitle = '新增'
    }
  },
  methods: {
    // 富文本失去焦点
    onBlur() {
      const editor = this.$refs.editorRef?.editor
      const text = editor.wwEditor.el.textContent
      this.editorText = text.trim() ? this.$refs.editorRef?.editor.getHTML() : ''
    },
    onRemarkEditorBlur() {
      const editor = this.$refs.editorRemarkRef?.editor
      const text = editor.wwEditor.el.textContent
      this.editorRemarkText = text.trim() ? this.$refs.editorRef?.editor.getHTML() : ''
    },
    // 删除tag
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    async getServiceInfoDetail() {
      this.isLoading = true
      const res = await getServiceInfoDetail({
        id: this.id,
      }).finally(() => this.isLoading = false)

      this.form = res.body.serviceInfo
      this.dynamicTags = this.form.labels.split(',')
      this.$refs.editorRemarkRef?.editor.setHTML(this.form.remarks)
      this.$refs.editorRef?.editor.setHTML(this.form.detail)

      this.checkedImgList = res.body.serviceInfo.resourceList.map(item => ({
        url: item.resourceUrl,
        resourceType: item.resourceType,
      }))
    },

    async updateService() {
      this.updateServiceLoading = true
      const idObj = this.id ? { id: this.id } : {}

      this.form.labels = this.dynamicTags.join()
      this.form.remarks = this.$refs.editorRemarkRef?.editor.getHTML()
      this.form.detail = this.$refs.editorRef?.editor.getHTML()

      await addOrUpdateServiceInfo({
        ...idObj,
        ...this.form,
      }).finally(() => this.updateServiceLoading = false)

      const describ = this.isEdit ? '修改' : '添加'
      this.$message.success(`${describ}成功！`)
      this.$router.back()
    },

    // 提交
    async submit(formName) {
      await this.$refs[formName].validate()
      this.form.resourceList = []
      const upload = this.$refs.upload

      if (!upload.checkUploadDone())
        return this.$message.warning('请等待文件上传完成')

      const files = this.$refs.upload.getUploadResults()

      files.forEach((item) => {
        this.form.resourceList.push({
          resourceType: 1, // 目前是图片
          resourceUrl: item.url,
        })
      })

      if (!files.length) {
        this.$message({
          message: '图片不能为空！',
          type: 'warning',
        })
        return
      }
      await this.updateService()
    },
  },
}
</script>

<template>
  <div>
    <PageHeader :content="pageTitle">
      <template #actions>
        <ElButton type="primary" :loading="updateServiceLoading" @click="submit('form')">
          保存
        </ElButton>
      </template>
    </PageHeader>
    <div v-loading="isLoading" class="w-full h-full mb-4 overflow-y-auto">
      <ElForm ref="form" :model="form" label-position="right" :rules="rules" :disabled="isCheck" label-width="80px" class="demo-ruleForm">
        <div class="grid grid-cols-2">
          <div class="m-6 pr-6 border-r">
            <ElFormItem label="服务名称" prop="name">
              <ElInput v-model="form.name" />
            </ElFormItem>
            <ElFormItem label="服务说明" prop="content">
              <ElInput
                v-model="form.content"
                type="textarea"
                maxlength="20"
                show-word-limit
              />
            </ElFormItem>
            <ElFormItem label="服务标签" prop="labels">
              <ElTag
                v-for="tag in dynamicTags"
                :key="tag"
                closable
                effect="plain"
                style="margin-left:10px;"
                type="info"
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </ElTag>
              <ElInput
                v-if="inputVisible"
                ref="saveTagInput"
                v-model="inputValue"
                class="input-new-tag"
                style="width:50%;margin-left:10px;"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <ElButton
                v-else
                class="button-new-tag"
                style="margin-left:10px;"
                icon="el-icon-plus"
                size="small"
                type="primary"
                plain
                @click="showInput"
              >
                点击新增
              </ElButton>
            </ElFormItem>
            <ElFormItem label="价格" prop="price">
              <ElInput v-model="form.price" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" />
            </ElFormItem>
            <!-- <ElFormItem label="关联对象类型" prop="relevanceType">
                  <ElSelect v-model="form.relevanceType">
                    <ElOption label="暂无" value="0" />
                    <ElOption label="商品" value="1" />
                  </ElSelect>
                </ElFormItem> -->
            <!-- <ElFormItem label="上架状态" prop="shelfStatus">
                  <ElSelect v-model="form.shelfStatus">
                    <ElOption label="未上架" :value="0" />
                    <ElOption label="已上架" :value="1" />
                  </ElSelect>
                </ElFormItem> -->
            <!-- <ElFormItem label="服务状态" prop="serviceStatus">
                  <ElSelect v-model="form.serviceStatus">
                    <ElOption label="不可用" :value="0" />
                    <ElOption label="可用" :value="1" />
                  </ElSelect>
                </ElFormItem> -->
            <!-- <ElFormItem label="备注" prop="remarks">
              <ElInput
                v-model="form.remarks"
                type="textarea"
                maxlength="50"
                show-word-limit
              />
            </ElFormItem> -->
            <ElFormItem label="服务详情">
              <Editor
                ref="editorRef"
                initial-edit-type="wysiwyg"
                preview-style="vertical"
                height="300px"
                :options="{
                  autofocus: false,
                  hideModeSwitch: true,
                  toolbarItems: [
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol'],
                  ],
                  language: 'zh-CN',
                }"
                @blur="onBlur"
              />
            </ElFormItem>
            <ElFormItem label="服务备注">
              <Editor
                ref="editorRemarkRef"
                initial-edit-type="wysiwyg"
                preview-style="vertical"
                height="300px"
                :options="{
                  autofocus: false,
                  hideModeSwitch: true,
                  toolbarItems: [
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol'],
                  ],
                  language: 'zh-CN',
                }"
                @blur="onRemarkEditorBlur"
              />
            </ElFormItem>
          </div>
          <div>
            <ElFormItem label="图片">
              <VcUpload
                v-bind="uploadOption"
                ref="upload"
                action="/api/system/file/uploadFile"
                list-type="picture-card"
                :show-file-list="true"
                :file-list="checkedImgList"
              >
                <i class="el-icon-plus" />
              </VcUpload>
              <div class="el-upload__tip text-red">
                *只能上传图片，单次提交最多{{ uploadOption.limit }}个，且不得超过{{ maxMB }}MB
              </div>
            </ElFormItem>
          </div>
        </div>
      </ElForm>
    </div>
  </div>
</template>

<style lang='scss' scoped>
::v-deep{
  .el-select{
    width: 100%;
  }
  .el-upload-dragger{
    width: 148px;
    height: 148px;
  }
}
</style>
