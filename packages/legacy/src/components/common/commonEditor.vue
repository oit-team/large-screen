<script>
export default {
  name: 'Kindeditor',
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '400px',
    },
    minHeight: {
      type: Number,
      default: 200,
    },
    content: {
      type: String,
    },
    id: {
      type: String,
      default: 'editor_id',
    },
    fullscreenMode: {
      type: Boolean,
      default: false,
    },
    isDeletImg: {
      type: Boolean,
      default: false,
    },
    afterCreate: Function,
    // afterUpload:Function,
  },
  data() {
    return {
      items: [
        'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste', 'plainpaste', 'wordpaste',
        '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent',
        'outdent', 'subscript', 'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/', 'formatblock',
        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight',
        'removeformat', '|', 'image', 'media', 'table', 'hr', 'emoticons', 'pagebreak', 'anchor', 'link',
        'unlink', '|', 'about',
      ],
      // 'multiimage',  // 多张图片上传
      resizeType: 0,
      random: Math.random(),
    }
  },
  created() {
    if (this.isDeletImg) {
      this.items = [
        'fontsize',
        'forecolor',
        'bold',
        'italic',
        'underline',
        'undo',
        'redo',
        'justifyleft',
        'justifycenter',
        'justifyright',
        'justifyfull',
        'wordpaste',
        'selectall',
        'link',
        'subscript',
        'superscript',
        'insertorderedlist',
        'insertunorderedlist',
        'fullscreen',
      ]
    }
  },
  methods: {
    afterSelectFile(val) {
      console.log('------------,', val)
    },
    afterUpload(url, data, name) { // 上传文件后执行的回调函数，必须为3个参数
      console.log('afterUpload')
      if (name == 'image' || name == 'multiimage') { // 单个和批量上传图片时
        console.log('0000000000000000000000', url, data, name)
      }
    },
    onContentChange(val) {
      this.editorText = val
      this.$emit('kindeditorChange', this.editorText)
    },
  },
}
</script>

<template>
  <!--
         参数：
        content：传进来的数据
        @kindeditorChange：获取数据的事件 传回一个参数：数据
  -->
  <div class="kindeditor">
    <Editor
      :id="id"
      :allow-image-remote="false"
      :min-height="minHeight"
      :width="width"
      :content="content"
      :items="items"
      :resize-type="resizeType"
      :upload-json="`${GLOBAL.system_manager_server}/file/uploadFile`"
      :load-style-mode="false"
      :fullscreen-mode="fullscreenMode"
      :after-select-file="afterSelectFile"
      :after-create="afterCreate"

      @on-content-change="onContentChange"
    />
    <!-- :afterUpload="afterUpload" -->
    <!-- :uploadJson="GLOBAL.system_manager_server + '/file/uploadFile'" -->
    <!-- pluginsPath="static/kindeditor/plugins/" -->
    <!-- allowImageRemote   隐藏网络图片上传  -->
    <!-- :height="height" -->
    <!-- :uploadJson=" rootDir + '/api/Upload/uploadImg2'" -->
    <!-- :uploadJson=" rootDir + '/api/Upload/uploadImg'" -->
  </div>
</template>

<style>

</style>
