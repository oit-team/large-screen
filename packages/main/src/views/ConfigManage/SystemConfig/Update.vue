<script>
import { Upload } from '@oit/element-ui-extend'
import { omit } from 'lodash-es'
import { addDictitemInfo, getConfigDetailed, updateDictitemInfo } from '@/api/systemConfig'
export default {
  name: 'UpdateConfig',
  components: { VcUpload: Upload },
  data: () => ({
    updateLoading: false,
    isEdit: false,
    maxMB: 5,
    params: {}, // 参数
    checkedImg: [], // 反显图片列表
    dictCode: '',
    form: {
      dictCode: '',
      dictitemCode: '',
      dictitemDisplayName: '',
      remark: '',
      imgUrl: '',
    },
    rules: {
      dictCode: [
        { required: true, message: '请输入类型标识', trigger: 'blur' },
        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
      ],
      dictitemCode: [
        { required: true, message: '请输入标识', trigger: 'blur' },
        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
      ],
      dictitemDisplayName: [
        { required: true, message: '请输入名称', trigger: 'blur' },
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
  created() {
    this.params = this.$route.query
    // 编辑
    if (this.params.dictitemCode) {
      this.isEdit = true
      this.getConfigDetailed()
    }
    else {
      this.form.dictCode = this.$route.query.dictCode
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // 新增
    async addDictitemInfo() {
      this.updateLoading = true
      await addDictitemInfo({
        ...this.form,
      }).finally(() => this.updateLoading = false)
      this.$message.success('新增成功！')
    },

    // 详情
    async getConfigDetailed() {
      const res = await getConfigDetailed({
        ...this.params,
      })
      this.form = omit(res.body.result, ['createTime', 'updateTime'])
      this.checkedImg = this.form.imgUrl ? [{ url: res.body.result?.imgUrl }] : []
    },

    // 编辑
    async updateDictitemInfo() {
      this.updateLoading = true
      await updateDictitemInfo({
        ...this.form,
      }).finally(() => this.updateLoading = false)
      this.$message.success('编辑成功！')
    },

    // 提交
    async onSubmit() {
      if (!this.form.dictitemCode && !this.form.dictitemDisplayName) {
        this.$message.warning('请填写必填项')
        return
      }
      const upload = this.$refs.upload
      if (!upload.checkUploadDone()) return this.$message.warning('请等待文件上传完成')

      const files = this.$refs.upload.getUploadResults()
      this.form.imgUrl = files[0]?.url
      await this.isEdit ? this.updateDictitemInfo() : this.addDictitemInfo()
      this.$router.back()
    },

    cancel() {
      this.form = {}
      this.checkedImg = []
      this.$router.back()
    },
  },
}
</script>

<template>
  <div id="updateConfig" class="h-full flex flex-col page-container" back-top>
    <ElPageHeader :content="`${isEdit ? '编辑' : '新增'}配置`" class=" text-sm" @back="goBack" />
    <ElDivider />
    <div class="w-[60%] h-full mb-4">
      <ElForm ref="form" :model="form" :rules="rules" label-width="80px">
        <ElFormItem label="类型编码" prop="dictCode">
          <ElInput v-model="form.dictCode" readonly />
        </ElFormItem>
        <ElFormItem label="配置编码" prop="dictitemCode">
          <ElInput v-model="form.dictitemCode" :readonly="isEdit" />
        </ElFormItem>
        <ElFormItem label="配置内容" prop="dictitemDisplayName">
          <ElInput v-model="form.dictitemDisplayName" />
        </ElFormItem>
        <ElFormItem label="描述">
          <ElInput v-model="form.remark" />
        </ElFormItem>

        <ElFormItem label="图片">
          <VcUpload
            v-bind="uploadOption"
            ref="upload" action="/api/system/file/uploadFile"
            list-type="picture-card"
            :show-file-list="true"
            :file-list="checkedImg"
          >
            <i class="el-icon-plus" />
          </VcUpload>
          <div class="el-upload__tip text-red">
            *只能上传图片，单次提交最多{{ uploadOption.limit }}个，且不得超过{{ maxMB }}MB
          </div>
        </ElFormItem>
      </ElForm>
      <div class="w-[50%] flex justify-around">
        <ElButton v-loading="updateLoading" type="primary" @click="onSubmit('form')">
          保存
        </ElButton>
        <ElButton @click="cancel('form')">
          取消
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
::v-deep{
  .el-upload-dragger{
  width: 150px;
  height: 150px;
 }
}
</style>
