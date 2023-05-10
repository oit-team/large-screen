<script>
import { Upload } from '@oit/element-ui-extend'

export default {
  components: {
    VcUpload: Upload,
  },
  props: {
    url: String,
    floor: String,
    disabled: Boolean,
  },
  computed: {
    uploadOptionFloorImg() {
      return {
        drag: true,
        showFileList: false,
        multiple: true,
        maxSize: 1024 * 5,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onError: (e, file) => {
          this.$message.error(`${file.name} 上传失败，请重试！`)
        },
        onSuccess: ({ data }) => {
          this.$emit('update:url', data.fileUrl)
        },
      }
    },
  },
}
</script>

<template>
  <div class="relative main" :class="{ 'pointer-events-none': disabled }">
    <VcUpload
      v-bind="uploadOptionFloorImg"
      ref="floorUpload"
      class="floor-uploader"
      action="api/system/file/uploadFile"
      list-type="picture-card"
    >
      <i v-if="!url" class="el-icon-plus" />
      <ElImage v-else style="width: 146px; height: 146px" :src="url" fit="cover" />
      <div v-if="url" class="checkImgMask">
        <i class="el-icon-edit" />
      </div>
    </VcUpload>
    <ElTooltip v-if="!disabled" effect="dark" content="点击删除该楼层及引导图整项" placement="top">
      <div class="deleteItemBtn" @click="$emit('delUploadItem')">
        <i class="el-icon-circle-close" />
      </div>
    </ElTooltip>
    <ElInput :value="floor" size="mini" placeholder="填写楼层号" @input="$emit('update:floor', $event)" />
  </div>
</template>

<style lang='scss' scoped>
  .deleteItemBtn{
    position: absolute;
    top:  -18px;
    right: -7px;
    font-weight: bold;
  }
  .checkImgMask{
    display: none;
    position: absolute;
    top:  0;
    left: 0;
    width: 99%;
    height: 99%;
    background-color: #000;
    opacity: .5;
    border-radius: 5%;
  }

  .floor-uploader:hover .checkImgMask{
    display: block;
  }
</style>
