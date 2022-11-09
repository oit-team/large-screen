<script>
import FILE_TYPE from '@/enums/FILE_TYPE'

export default {
  name: 'VcPreviewFile',

  props: {
    fileList: Array,
    index: Number,
    value: Boolean,
  },

  data: () => ({
    FILE_TYPE,
    lazy: false,
  }),

  computed: {
    previewItem() {
      return this.fileList[this.index]
    },
    previewVisible: {
      get() {
        return this.value
      },
      set(e) {
        this.$emit('input', e)
      },
    },
  },

  watch: {
    value() {
      if (this.value) {
        this.lazy = this.value
      }
      else {
        setTimeout(() => {
          this.lazy = this.value
        }, 500)
      }
    },
  },
}
</script>

<template>
  <ElDialog
    class="preview-file"
    :visible.sync="previewVisible"
    :title="previewItem ? previewItem.name : ''"
    top="5vh"
    size=""
  >
    <template v-if="previewItem && lazy">
      <template v-if="previewItem.type === FILE_TYPE.IMAGE">
        <ElImage class="file-res h-full" :src="previewItem.url" />
      </template>
      <template v-if="previewItem.type === FILE_TYPE.VIDEO">
        <video class="file-res" controls :src="previewItem.url" />
      </template>
    </template>
  </ElDialog>
</template>

<style scoped lang='less'>
.preview-file {
  display: flex;
  overflow: hidden;

  .file-res {
    min-height: 300px;
    min-width: 300px;
    max-height: 80vh;
  }

  /deep/ .el-dialog {
    display: inline-block;
    align-self: baseline;
    width: auto;
  }

  /deep/ img {
    max-height: inherit;
    max-width: inherit;
  }
}
</style>
