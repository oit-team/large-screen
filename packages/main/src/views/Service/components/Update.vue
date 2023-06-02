<script>
import { Upload } from '@oit/element-ui-extend'
import { addOrUpdateServiceInfo, getServiceInfoDetail } from '@/api/serviceManage'

export default {
  name: 'ServiceUpdate',
  components: { VcUpload: Upload },
  props: {},
  data: () => ({
    isLoading: false,
    isEdit: false, // 是否编辑
    id: '',
    maxMB: 60,
    form: {
      name: '',
      content: '',
      price: '',
      // relevanceType: '',
      shelfStatus: '',
      serviceStatus: '',
      resourceType: 1,
      resourceList: [], // 资源暂时支持图片上传 resourceType: 1
      remarks: '',
    },
    checkedImgList: [],
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
      this.isEdit = params?.isEdit
      this.id = params?.id
      this.getServiceInfoDetail()
    }
    else {
      this.isEdit = false
    }
  },
  methods: {
    async getServiceInfoDetail() {
      this.isLoading = true
      const res = await getServiceInfoDetail({
        id: this.id,
      }).finally(() => this.isLoading = false)
      this.form = res.body.serviceInfo
      this.checkedImgList = res.body.serviceInfo.resourceList.map(item => ({
        url: item.resourceUrl,
        resourceType: item.resourceType,
      }))
    },

    async updateService() {
      const idObj = this.id ? { id: this.id } : {}
      await addOrUpdateServiceInfo({
        ...idObj,
        ...this.form,
      })
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
      }
      await this.updateService()
    },
  },
}
</script>

<template>
  <div>
    <PageHeader :content="!isEdit ? '新增服务' : '编辑服务'" />
    <ElDivider />
    <div v-loading="isLoading" class="p-2 w-60%">
      <ElForm ref="form" :model="form" label-position="right" :rules="rules" label-width="120px" class="demo-ruleForm">
        <ElFormItem label="服务名称" prop="name">
          <ElInput v-model="form.name" />
        </ElFormItem>
        <ElFormItem label="服务内容" prop="content">
          <ElInput
            v-model="form.content"
            type="textarea"
            maxlength="50"
            show-word-limit
          />
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
        <ElFormItem label="上架状态" prop="shelfStatus">
          <ElSelect v-model="form.shelfStatus">
            <ElOption label="未上架" :value="0" />
            <ElOption label="已上架" :value="1" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="服务状态" prop="serviceStatus">
          <ElSelect v-model="form.serviceStatus">
            <ElOption label="不可用" :value="0" />
            <ElOption label="可用" :value="1" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="备注" prop="remarks">
          <ElInput
            v-model="form.remarks"
            type="textarea"
            maxlength="50"
            show-word-limit
          />
        </ElFormItem>
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
        <ElFormItem>
          <ElButton type="primary" @click="submit('form')">
            保存
          </ElButton>
          <!-- <ElButton>取消</ElButton> -->
        </ElFormItem>
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
