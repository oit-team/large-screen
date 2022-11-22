<script>
import { Upload } from '@oit/element-ui-extend'
import { addJackpotStyle, getJackpotById, updateJackpotStyle } from '@/api/jackpot'
export default {
  name: 'AddJackpot',
  components: { VcUpload: Upload },
  data: () => ({
    maxMB: 50,
    isEdit: false,
    jackpotId: null,
    checkedImg: [], // 反显选中的图片列表
    imageUrlList: [], // 选中的图片
    form: {
      vouchersName: '', // 名称
      jackpotInventory: '', // 库存
      jackpotPrice: '', // 价格
      effectiveType: '0', // 有效期
      effectiveDay: '',
      effectiveStart: '',
      effectiveEnd: '',
      jackpotImp: [],
      jackpotVideo: [],
      jackpotNote: '', // 备注
      jackpotType: 1, // 奖池类型（0:公共，1:私有，2:采购）
    },
    startTime: '',
    videoSrc: '',
    rules: {
      vouchersName: [
        { required: true, message: '请输入商品名称', trigger: 'blur' },
        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
      ],
      jackpotInventory: [
        { required: true, message: '请输入商品库存', trigger: 'blur' },
        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
      ],
      jackpotPrice: [
        { required: true, message: '请输入商品价格', trigger: 'blur' },
      ],
      effectiveType: [
        { required: true, message: '请输入商品有效期', trigger: 'blur' },
      ],
      jackpotImp: [
        { required: true, message: '请添加商品图片', trigger: 'blur' },
      ],

    },
  }),

  computed: {
    uploadVideoOption() {
      return {
        drag: true,
        showFileList: true,
        multiple: false,
        typeOption: {
          'video/*': {
            data: {
              fileType: 1,
            },
          },
        },
        maxSize: 1024 * this.maxMB,
        limit: 1,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'video/*',
        onSuccess: (...e) => {
          this.videoSrc = e[0].data.fileUrl
          this.form.jackpotVideo.push(this.videoSrc)
        },
        onError: (e, file) => {
          this.$message.error(`${file.name} 上传失败，请重试！`)
        },
      }
    },
    uploadOption() {
      return {
        drag: true,
        showFileList: true,
        multiple: true,
        maxSize: 1024 * this.maxMB,
        limit: 5,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onError: (e, file) => {
          this.$message.error(`${file.name} 上传失败，请重试！`)
        },
      }
    },
  },
  mounted() {
    const jackpotId = this.$route.query.jackpotId
    if (jackpotId) {
      this.jackpotId = jackpotId
      this.isEdit = true
      this.getJackpotDetail()
    }
  },

  activated() {
  },

  methods: {
    goBack() {
      this.$router.go(-1)
    },
    delVideo() {
      this.videoSrc = ''
      this.form.jackpotVideo = []
    },
    changeRadio() {
      if (this.form.effectiveType === 0) {
        this.startTime = ''
      }
      if (this.form.effectiveType === 1) {
        this.form.effectiveDay = null
      }
    },
    // 新增
    addJackpotStyle() {
      const upload = this.$refs.upload

      if (!upload.checkUploadDone())
        return this.$message.warning('请等待文件上传完成')

      const files = this.$refs.upload.getUploadResults()

      files.forEach((item) => { this.form.jackpotImp.push(item.url) })
      addJackpotStyle({
        ...this.form,
      }).then((res) => {
        if (res.head.status === 0) {
          this.$router.back()
          this.$message({
            message: '新增成功！',
            type: 'warning',
          })
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'warning',
        })
      })
    },

    // 编辑
    updateJackpotStyle() {
      const upload = this.$refs.upload

      if (!upload.checkUploadDone())
        return this.$message.warning('请等待文件上传完成')

      const files = this.$refs.upload.getUploadResults()

      updateJackpotStyle({
        ...this.form,
      }).then((res) => {
        if (res.head.status === 0) {
          this.$router.back()
          this.$message({
            message: '修改成功！',
            type: 'success',
          })
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'warning',
        })
      })
    },

    // 查看详情
    getJackpotDetail() {
      getJackpotById({
        jackpotId: this.jackpotId,
      }).then((res) => {
        this.form = res.body
        // 0: 按天 1：时间范围
        this.startTime = [this.form.effectiveStart, this.form.effectiveEnd]

        this.checkedImg = res.body.jackpotImp.map(item => ({ url: item }))
        this.videoSrc = res.body.jackpotVideo[0]
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'warning',
        })
      })
    },

    // 提交
    onSubmit(formName) {
      if (this.startTime.length) {
        [this.form.effectiveStart, this.form.effectiveEnd] = this.startTime
      }
      // 提交保存
      this.isEdit ? this.updateJackpotStyle() : this.addJackpotStyle()
      this.$refs[formName].resetFields()
    },
    cancel(formName) {
      this.startTime = ''
      this.checkedImg = []
      this.videoSrc = ''
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<template>
  <div id="addJackpot" class="h-full flex overflow-hidden flex-col page-container" back-top>
    <ElPageHeader :content="`${isEdit ? '编辑' : '新增'}奖品信息`" class=" text-sm" @back="goBack" />
    <ElDivider />
    <div class="w-full h-full mb-4 overflow-y-auto">
      <ElForm ref="form" :model="form" :rules="rules" label-width="80px">
        <div class="grid grid-cols-2">
          <div class="m-6 pr-6 border-r">
            <ElFormItem label="名 称" prop="vouchersName">
              <ElInput v-model="form.vouchersName" />
            </ElFormItem>
            <ElFormItem label="库 存" prop="jackpotInventory">
              <ElInput v-model="form.jackpotInventory" />
            </ElFormItem>
            <ElFormItem label="价 格" prop="jackpotPrice">
              <ElInput v-model="form.jackpotPrice" />
            </ElFormItem>
            <ElFormItem label="有效期" prop="effectiveType" class="rodioDateItem">
              <div style="display: flex; align-items:center;">
                <ElRadio v-model="form.effectiveType" style="margin: 0;" :label="1">
                  <ElDatePicker
                    v-model="startTime"
                    value-format="yyyy-MM-dd"
                    :disabled="form.effectiveType === 0"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </ElRadio>
              </div>
              <div class="mt-2 text-sm" style="display: flex; align-items:center;">
                <ElRadio v-model="form.effectiveType" :label="0" style="margin: 0;" @change="changeRadio">
                  <ElInput v-model="form.effectiveDay" :disabled="form.effectiveType === 1" style="width:80px" type="number" />  / 天
                </ElRadio>
              </div>
            </ElFormItem>
            <ElFormItem label="物品说明" prop="jackpotNote">
              <ElInput
                v-model="form.jackpotNote"
                type="textarea"
                maxlength="100"
                show-word-limit
                resize="none"
              />
            </ElFormItem>
          </div>
          <div>
            <ElFormItem label="图片" prop="jackpotImp">
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
            <ElFormItem label="视频" prop="jackpotVideo">
              <VcUpload
                v-if="!videoSrc"
                ref="videoUpload"
                v-bind="uploadVideoOption" action="/api/system/file/uploadFile"
                list-type="picture-card"
                :show-file-list="false"
              >
                <i class="el-icon-plus" />
              </VcUpload>
              <video
                v-if="videoSrc"
                style="width: 100%;height: 200px;"
                class="avatar video-avatar"
                :src="videoSrc"
                controls="controls"
              >
                您的浏览器不支持视频播放
              </video>
              <div v-if="videoSrc" class="mt-2">
                <ElButton @click="delVideo">
                  删除视频
                </ElButton>
              </div>
              <div class="el-upload__tip text-red">
                *只能上传视频文件，且提交最多{{ uploadVideoOption.limit }}个，不得超过{{ maxMB }}MB
              </div>
            </ElFormItem>
          </div>
        </div>
      </ElForm>
      <div class="w-full flex justify-center items-center">
        <ElButton type="primary" @click="onSubmit('form')">
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
