<script>
import VcUpload from '@/components/classify/Upload'
import { addAdvertsRes } from '@/api/liveStream'
import FILE_TYPE from '@/enums/FILE_TYPE'

const previewList = new Map()

export default {
  name: 'CarouselResourcesUpdate',

  components: {
    VcUpload,
  },

  data: () => ({
    uploadList: [],
    selectedItem: null,
    maxMB: 50,
  }),

  computed: {
    uploadOption() {
      return {
        drag: true,
        showFileList: false,
        multiple: true,
        typeOption: {
          'video/*': {
            data: {
              fileType: 1,
            },
          },
        },
        maxSize: 1024 * this.maxMB,
        limit: 20,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*,video/*',
        onChange: (file, fileList) => {
          this.uploadList = fileList
        },
      }
    },
  },

  beforeDestroy() {
    this.uploadList.forEach((item, index) => this.removeFile(index, item))
  },

  methods: {
    removeFile(index, item) {
      this.$refs.upload.abort(item)
      this.uploadList.splice(index, 1)
      item.url && URL.revokeObjectURL(item.url)
      if (item === this.selectedItem) this.selectedItem = null
    },
    preview(item) {
      item.url = item.url || URL.createObjectURL(item.raw)
      this.selectedItem = item
    },
    submit() {
      if (!this.uploadList.length) return this.$message.warning('请先上传文件')
      if (!this.$refs.upload.checkUploadDone()) return this.$message.warning('请等待文件全部上传完成后在提交')

      const params = this.uploadList.map((item) => {
        const type = item.raw.type
        if (/video/.test(type)) {
          return {
            resName: item.name,
            resUrl: item.response.data.fileUrl,
            videoImg: item.response.data.thumbUrl,
            resType: FILE_TYPE.VIDEO,
          }
        }
        else if (/image/.test(type)) {
          return {
            resName: item.name,
            resUrl: item.response.data.data.fileUrls[0].fileUrl,
            resType: FILE_TYPE.IMAGE,
          }
        }
        return {}
      })

      addAdvertsRes({
        resList: params,
      }).then((res) => {
        this.$message.success('文件提交成功')
        this.$router.back()
      })
    },
  },
}
</script>

<template>
  <page-container column>
    <page-header content="上传文件" />
    <div class="flex overflow-hidden flex-1 mb-2">
      <div class="inline-flex flex-col h-full">
        <vc-upload v-bind="uploadOption" ref="upload">
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <div class="el-upload__tip">
            只能上传图片或视频文件，单次提交最多{{ uploadOption.limit }}个，且不得超过{{ maxMB }}MB
          </div>
        </vc-upload>
        <ul class="overflow-y-auto flex-1 mb-2 space-y-1 upload-list">
          <li
            v-for="(item, index) of uploadList"
            :key="item.uid"
            class="px-2 py-1 rounded-lg border border-gray-300 border-solid cursor-pointer"
            :class="{ 'bg-blue-50': item === selectedItem }"
            @click="preview(item)"
          >
            <div class="flex items-center">
              <span class="mr-2">
                <i v-if="/image/.test(item.raw.type)" class="text-xl el-icon-picture-outline" />
                <i v-if="/video/.test(item.raw.type)" class="text-xl el-icon-video-camera" />
              </span>
              <span class="flex-1 mr-2 truncate">{{ item.name }}</span>
              <span v-if="item.percentage > 0 && item.percentage < 100">{{ Math.floor(item.percentage) }}%</span>
              <span v-if="item.percentage >= 100" class="text-green-500">完成</span>
              <i
                class="ml-1 w-4 h-4 text-xl text-red-400 rounded-lg el-icon-close hover:bg-gray-100 flex-center"
                @click.stop="removeFile(index, item)"
              />
            </div>
            <el-progress :show-text="false" :stroke-width="2" :percentage="item.percentage" />
          </li>
        </ul>
        <el-button type="primary" plain @click="submit()">
          提交
        </el-button>
      </div>
      <div class="flex overflow-hidden flex-1 ml-2 rounded-lg border flex-center">
        <template v-if="selectedItem">
          <el-image
            v-if="/image/.test(selectedItem.raw.type)"
            class="w-full h-full"
            :src="selectedItem.url"
            fit="scale-down"
          />
          <video
            v-if="/video/.test(selectedItem.raw.type)"
            class="w-full h-full bg-white"
            :src="selectedItem.url"
            controls
          />
        </template>
        <el-empty v-else description="未选中文件" />
      </div>
    </div>
  </page-container>
</template>

<style scoped>
.upload-list {
  width: 360px;
}
</style>

<style lang="less">
.el-upload .el-upload-dragger {
  height: 150px;

  .el-icon-upload {
    margin-top: 20px;
  }
}
</style>
