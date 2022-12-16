<script>
import { Upload } from '@oit/element-ui-extend'
import { addProductType, getProductParent, getProductTypeById, updateProductType } from '@/api/category'
export default {
  name: 'UpdateCategory',
  components: { VcUpload: Upload },
  data: () => ({
    maxMB: 50,
    isEdit: false,
    requestLoading: false,
    typeId: null,
    labelPosition: 'right',
    checkedImg: [], // 反显选中的图片列表
    form: {
      typeName: '', // 名称
      typeSort: '', // 排序
      typeImg: '', // 图片
      typeId: null,
      typeParentId: '', // 父级类别
    },
    productParent: [],
    rules: {
      typeName: [
        { required: true, message: '请输入类别名称', trigger: 'blur' },
        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
      ],
      typeSort: [
        { required: true, message: '请输入类别排序', trigger: 'blur' },
      ],

    },
  }),

  computed: {
    uploadOption() {
      return {
        drag: true,
        showFileList: true,
        multiple: true,
        maxSize: 1024 * this.maxMB,
        limit: 1,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onError: (e, file) => {
          this.$message.error(`${file.name} 上传失败，请重试！`)
        },
      }
    },
  },
  async created() {
    // 查询父级
    await this.getProductParent()
    const typeId = this.$route.query.typeId
    if (typeId) {
      this.typeId = typeId
      this.isEdit = true
      this.getProductTypeById()
    }
  },

  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 新增
    async addProductType() {
      await addProductType({
        ...this.form,
      }).finally(() => {
        this.requestLoading = false
      })
      this.$message.success('新增成功！')
      this.$router.back()
    },

    // 编辑
    async updateProductType() {
      await updateProductType({
        ...this.form,
      }).finally(() => {
        this.requestLoading = false
      })
      this.$message.success('修改成功！')
      this.$router.back()
    },

    // 查看详情
    async getProductTypeById() {
      const res = await getProductTypeById({
        typeId: this.typeId,
      })
      this.form = res.body
      this.checkedImg = [{
        url: res.body.typeImg,
      }]
    },

    async getProductParent() {
      const res = await getProductParent()
      this.productParent = res.body.resultList
    },

    // 提交
    async onSubmit(formName) {
      this.requestLoading = true
      const upload = this.$refs.upload
      if (!upload.checkUploadDone())
        return this.$message.warning('请等待文件上传完成')

      const files = this.$refs.upload.getUploadResults()

      if (files.lengh !== 0) {
        this.form.typeImg = files[0].url
      }

      // 提交保存
      await this.isEdit ? this.updateProductType() : this.addProductType()
    },

    cancel(formName) {
      this.checkedImg = []
      this.form.typeParentId = null
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<template>
  <div id="updateCategory" class="h-full flex overflow-hidden flex-col page-container" back-top>
    <ElPageHeader :content="`${isEdit ? '编辑' : '新增'}`" class="text-sm" @back="goBack" />
    <ElDivider />
    <div class="w-full h-full mb-4 overflow-y-auto">
      <div class="ml-10 w3/5">
        <ElForm ref="form" :label-position="labelPosition" :model="form" :rules="rules" label-width="80px">
          <ElFormItem label="类别名称" prop="typeName">
            <ElInput v-model="form.typeName" placeholder="请输入类别名称" />
          </ElFormItem>
          <ElFormItem label="父级类别">
            <ElSelect v-model="form.typeParentId" :disabled="isEdit" class="w-full" placeholder="请选择父级类别">
              <ElOption
                v-for="item of productParent"
                :key="item.typeId"
                :label="item.typeName"
                :value="item.typeId"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="类别排序" prop="typeSort">
            <ElInput v-model="form.typeSort" placeholder="请输入类别排序" />
          </ElFormItem>
          <ElFormItem label="类别图片" prop="typeImg">
            <VcUpload
              v-bind="uploadOption"
              ref="upload" action="/api/system/file/uploadFile"
              list-type="picture-card"
              :show-file-list="true"
              :file-list="checkedImg"
            >
              <i class="el-icon-plus" />
            </VcUpload>
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" :loading="requestLoading" @click="onSubmit('form')">
              保存
            </ElButton>
            <ElButton @click="cancel('form')">
              取消
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
::v-deep{
  .el-textarea .el-textarea__inner{
    height: 100px;
  }
 .el-upload-dragger{
  width: 150px;
  height: 150px;
 }
 .el-range-editor.el-input__inner{
  width: 100%;
 }
}
.checkedFilesBox{
  .checkedFiles{
    width: 90px;
    height: 90px;
  }
}
</style>
