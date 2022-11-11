<script>
import { Quill, quillEditor } from 'vue-quill-editor'
import AudioBlot from '../../assets/js/audioBlot'

import video from '../../assets/js/videoBlot'
// 注册audio
Quill.register(AudioBlot)
// 注册audio
Quill.register(video, true)

const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
export default {
  name: '',
  components: {},
  props: {
    value: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '200px',
    },
    editorSetting: {
      type: Array,
      default: () => [],
    },
    fromPath: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      quill: null,
      fullscreenLoading: false,

      txt: '',
      editorOption: {
        placeholder: '请输入......',
        theme: 'snow',
        modules: {
          // clipboard: {
          //   // 粘贴板，处理粘贴时候的自带样式,用这个方式反显的时候图片音视频都没了，pass
          //   matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]],
          // },
          toolbar: {
            // container: [
            //   // ['bold', 'italic', 'underline', 'strike'],
            //   // [{ 'size': ['small', false, 'large', 'huge'] }],
            //   // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            //   // [{ 'color': [] }, { 'background': [] }],
            //   // // ['blockquote', 'code-block'],
            //   // ['image' , 'video'],
            //   // ['voice']     //新添加的工具
            // ],
            container: this.editorSetting,
            handlers: {
              voice(value) { // 添加工具方法，即点击时模仿点击上传组件的按钮
                document.querySelector('.uploadVoiceBtn').click()
              },
              image(value) {
                if (value) { // 值为 true 或 false
                  // console.log("自定义上传图片：",value)
                  document.querySelector('.uploadImgBtn').click()
                }
                else {
                  this.quill.format('image', false)
                }
              },
              video(value) {
                if (value) {
                  // console.log("自定义上传视频：",value)
                  document.querySelector('.uploadVideoBtn').click()
                }
                else {
                  this.quill.format('video', false)
                }
              },
            },
          },
        },
        initVoiceButton() { // 初始化"voice"按钮样式
          const voiceButton = document.querySelector('.ql-voice') // "ql-" 是插件自动加的前缀
          // 添加样式，使用fontawesome初始化图标的样式
          voiceButton.classList.add('fa')
          voiceButton.classList.add('fa-volume-up')
          voiceButton.classList.add('fa-lg')

          // 当然，可以直接手写样式，如：
          // voiceButton.style.cssText = "width:80px; border:1px solid #ccc; border-radius:5px;background-color:pink;";
          // voiceButton.innerText="上传音频";
        },
      },

      uploadTimer: null,
      perValue: '',
      iNum: 0, // 分段上传视频的i值
      errCount: 0, // 分段上传视频的次数，针对不同的i值

    }
  },
  created() {
  },
  mounted() {
    // 传过来的工具栏数组长度为0时，将工具栏设为不可见：display:none
    if (this.editorSetting.length == 0) {
      const len = document.querySelectorAll('.ql-toolbar').length
      for (let i = 0; i < len; i++) {
        document.querySelectorAll('.ql-toolbar')[i].style.display = 'none'
      }
    }

    if (document.querySelectorAll('.editorStyle').length == 1) {
      document.querySelector('.editorStyle').style.height = this.height
    }
    if (document.querySelectorAll('.editorStyle').length > 1) {
      const len = document.querySelectorAll('.editorStyle').length
      for (let i = 0; i < len; i++) {
        document.querySelectorAll('.editorStyle')[i].style.height = this.height
      }
    }
    // 区分新增题库 和 新增商品
    if (this.fromPath) {
      // console.log("this.editorSetting:",this.editorSetting)
      this.editorOption.initVoiceButton() // 初始化音频图标，这样才能显示
    }

    this.txt = this.value
    if (this.txt) {
      this.$emit('changeVal', this.txt)
    }

    this.quill = this.$refs.myTextEditor.quill
    this.quill.on('text-change', (val) => {
      // console.log("监听编辑器内容变化44444：",this.txt)
      this.$emit('changeVal', this.txt)
    })
  },

  methods: {
    // 处理粘贴过来的内容的格式,反显也会清掉格式，pass
    handleCustomMatcher(node, delta) {
      // 文字、图片等，从别处复制而来，清除自带样式，转为纯文本
      const opsList = []
      delta.ops.forEach((op) => {
        if (op.insert && typeof op.insert === 'string') {
          opsList.push({
            insert: op.insert,
          })
        }
      })
      delta.ops = opsList
      return delta
    },
    // 通过请求来反显相应数据
    getVal(val) {
      this.txt = val
      if (this.txt) {
        this.$emit('changeVal', this.txt)
      }
    },
    // 自定义上传图片==========================
    beforeUploadImage(file) {
      // console.log("上传图片前：",file)
      const pointIndex = file.name.lastIndexOf('.')
      let fileType = file.name.substring(pointIndex + 1) // 获取到文件后缀名
      fileType = fileType.toLowerCase()// string  大写转小写
      const isJPG = (fileType === 'jpg' || fileType === 'png')
      const isLt4M = file.size / 1024 / 1024 < 4
      // console.log('isJPG===',isJPG)
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG , PNG格式!')
        this.$emit('changeLoad', false)
        return
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!')
        this.$emit('changeLoad', false)
        return
      }
      return isJPG && isLt4M
    },
    uploadingImage() {
      this.fullscreenLoading = true
    },
    requestUploadImage(params) {
      this.$emit('changeLoad', true)
      const reader = new FileReader()
      const arr = []
      let fileResult = ''
      const _this = this

      // console.log("file",params.file)
      reader.readAsDataURL(params.file)
      // //开始转
      reader.onload = function (e) {
        fileResult = e.currentTarget.result // base64文件流
        arr.push(fileResult)
        const con = {
          files: arr.join('#@#'),
          fileType: 0,
          userId: sessionStorage.userId,
        }

        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/file/uploadFile`, con).then((res) => {
          // console.log("上传图片返回信息-----",res.data);
          if (res.data.code == 200) {
            _this.$emit('changeLoad', false)
            // 获取光标所在位置
            const length = _this.quill.selection.savedRange.index
            // 插入图片，res为服务器返回的图片链接地址
            _this.quill.insertEmbed(length, 'image', res.data.data.fileUrls[0].fileUrl)
            // 调整光标到最后
            _this.quill.setSelection(length + 1)

            // console.log(this.txt);
            _this.$emit('changeVal', _this.txt) // 将内容同步到父组件中
          }
          else {
            _this.$emit('changeLoad', false)
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 默认的上传图片成功处理事件，自定义后就不需要了
    handleSuccessImage(res, file) {
      // console.log("默认的上传图片成功后：",file)
      // //alert(JSON.stringify(res));
      // //获取富文本组件实例
      // // let quill = this.$refs.myTextEditor.quill;
      // //如果上传成功
      // if (res) {
      // 	//动态添加 ref  通过 eval () 去执行
      //   let toeval = this.$refs.myTextEditor.quill;
      //   //eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码。
      //   let quill = eval(toeval);
      //   console.log(quill);
      //   //获取光标所在位置
      //   let length = quill.selection.savedRange.index;
      //   // 插入图片，res为服务器返回的图片链接地址
      //   quill.insertEmbed(length, "image", res.url);
      //   // 调整光标到最后
      //   quill.setSelection(length + 1);
      // } else {
      //   // 提示信息，需引入Message
      //   this.$message.error("图片插入失败");
      // }
      // //this.form.unscramble = res.fileName;
    },

    // 自定义上传音频===========================
    // 上传音频前校验文件格式
    beforeUploadAudio(file) {
      // 自己获取后缀名判断文件格式
      const pointIndex = file.name.lastIndexOf('.')
      let fileType = file.name.substring(pointIndex + 1) // 获取到文件后缀名
      fileType = fileType.toLowerCase()// string  大写转小写
      if (fileType !== 'mp3' && fileType !== 'ogg' && fileType !== 'wav') {
        this.$message.error('你选择的文件不是音频哦，仅支持mp3和ogg格式')
        return false
      }
    },
    // 自定义上传音频函数
    requestUploadAudio(params) {
      // console.log("上传音频参数：",params.file);
      const _this = this
      _this.$emit('changeLoad', true)
      const file = params.file
      const fileType = 2 // 1 视频 2 音频  默认设为1
      const limitUpCount = 200 * 1024 * 1024 // 限制上传大小，大于200M不可以上传
      const upFileSize = file.size
      // console.log("要上传的字节大小===",upFileSize,"限制上传的字节大小===",limitUpCount)
      if (upFileSize <= limitUpCount) {
        // console.log("文件小于200M,可以上传");
        const chunkSize = 2 * 1024 * 1024// 每个chunk的大小，2兆
        const totalChunk = Math.ceil(upFileSize / chunkSize)	// 总分片数
        // console.log("总分片数----:",totalChunk)
        const userID = sessionStorage.userId
        // let tempFileName = file.name;
        const nameArr = file.name.split('.')
        const curtime = new Date().getTime() // name不可以带中文，以时间戳的形式重新组合传给后端
        const tempFileName = `${curtime}.${nameArr[1]}`
        _this.uploadSliceData(0, totalChunk, chunkSize, upFileSize, file, fileType, userID, tempFileName)
      }
      else {
        _this.$message({
          type: 'warning',
          message: '文件超过限制大小200M，不可上传',
        })
        return false
      }
    },
    // 上传时显示loading
    uploadIngAudio() {
      this.fullscreenLoading = true
    },
    // 上传成功后
    handleSuccessAudio(res, file, fileList) {
      this.fullscreenLoading = false //  上传成功，取消loading状态
      // 获取富文本组件实例
      const quill = this.$refs.myTextEditor.quill // 已测试，可以拿到实例
      // 调用上传音频接口

      if (res.code === 0) { // 如果上传成功
        const length = quill.getSelection().index // 获取光标所在位置

        const BlockEmbed = Quill.import('blots/block/embed')
        class AudioBlot extends BlockEmbed {
          static create(value) {
            const node = super.create()
            node.setAttribute('src', value.url) // 设置audio的src属性
            node.setAttribute('controls', true) // 设置audio的controls，否则他将不会显示
            node.setAttribute('controlsList', 'nodownload') // 设置audio的下载功能为不能下载
            node.setAttribute('id', 'voice') // 设置一个id
            return node
          }
        }
        AudioBlot.blotName = 'audio'
        AudioBlot.tagName = 'audio' // 自定义的标签为audio
        Quill.register(AudioBlot)

        // insertEmbed(index: Number(插入的位置), type: String(标签类型), value: any(参数，将传入到create的方法中去), source: String = 'api')
        quill.insertEmbed(length, 'audio', { url: res.data.url }, 'api')
        quill.setSelection(length + 1) // 光标位置向后移动一位
      }
      else {
        this.$message.error(res.msg) // 上传失败，提示错误信息
      }
    },

    // 自定义上传视频===========================
    // 上传视频前校验
    beforeUploadVideo(file) {
      // console.log(file)
      // 自己获取后缀名判断文件格式
      const pointIndex = file.name.lastIndexOf('.')
      let fileType = file.name.substring(pointIndex + 1) // 获取到文件后缀名
      fileType = fileType.toLowerCase()// string  大写转小写
      if (fileType !== 'mp4') {
        this.$message.error('仅支持mp4视频格式哦')
        return false
      }
    },
    // 自定义上传函数
    requestUploadVideo(params) {
      // console.log('params.file====:',params.file)
      const _this = this
      _this.$emit('changeLoad', true)
      const file = params.file
      const fileType = 1 // 1 视频 2 音频  默认设为1
      const limitUpCount = 200 * 1024 * 1024 // 限制上传大小，大于200M不可以上传
      const upFileSize = file.size
      // console.log("要上传的字节大小===",upFileSize,"限制上传的字节大小===",limitUpCount)
      if (upFileSize <= limitUpCount) {
        // console.log("文件小于200M,可以上传");
        const chunkSize = 2 * 1024 * 1024// 每个chunk的大小，2兆
        const totalChunk = Math.ceil(upFileSize / chunkSize)	// 总分片数
        // console.log("总分片数----:",totalChunk)
        const userID = sessionStorage.userId
        // let tempFileName = file.name;

        const nameArr = file.name.split('.')
        // console.log(nameArr)
        const curtime = new Date().getTime() // name不可以带中文，以时间戳的形式重新组合传给后端
        // console.log('curtime===',curtime)
        const tempFileName = `${curtime}.${nameArr[1]}`

        _this.uploadSliceData(0, totalChunk, chunkSize, upFileSize, file, fileType, userID, tempFileName)
      }
      else {
        // console.log("超过限制大小，不可以上传");
        // console.log('大小超过200M，不可以上传');
        _this.$message({
          type: 'warning',
          message: '文件大小超过200M,不可以上传',
        })
        return false
      }
    },
    uploadingVideo() {
      this.fullscreenLoading = true
      // console.log("-----上传视频加载中------",this.fullscreenLoading)
    },

    // 分段上传音视频函数
    uploadSliceData(i, totalChunk, chunkSize, totalSize, file, fType, userId, tempFileName) {
      const _this = this
      if (this.uploadTimer != null) {
        clearTimeout(this.uploadTimer)
        this.uploadTimer = null
      }

      this.perValue = `${(i * 100 / totalChunk).toFixed(1)}%`	// 进度
      // console.log("进度显示------",this.perValue);
      _this.$emit('changeLoad', true, _this.perValue)

      const startPos = i * chunkSize // 当前上传文件块的起始位置
      const endPos = Math.min(file.size, startPos + chunkSize)
      // fileType  资源类型 1 视频  2 音频
      // userId
      // noThumb   是否要截图  传 1
      // fname    资源名称  不用做处理
      // totalSize    资源总大小
      // startPos    每一个分片上传的开始点
      // endPos      每一个分片上传的结束点
      const formData = new FormData()
      formData.append('file', blobSlice.call(file, startPos, endPos))
      formData.append('totalSize', totalSize)
      formData.append('startPos', startPos)
      formData.append('endPos', endPos)
      formData.append('fileType', fType)
      formData.append('userId', userId)
      formData.append('fname', tempFileName)
      formData.append('noThumb', 0)

      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/file/upVideoOrAudio`, formData).then((res) => {
        // console.log("分片上传视频接口返回信息====",res);
        if (res.data.status == 101) {
          // 上传下一下分片
          _this.uploadTimer = setTimeout(() => {
            _this.uploadSliceData(i + 1, totalChunk, chunkSize, totalSize, file, fType, userId, tempFileName)
          }, 50)
        }
        else if (res.data.status == 0) {
          _this.$emit('changeLoad', false, '100%')
          // console.log("分片上传音视频完成：====",res.data);
          // fileUrl: "http://192.168.9.26:9107/ZDNAS/0/20210526/tmp.mp4"
          // status: 0
          // thumbUrl: "http://192.168.9.26:9107/ZDNAS/0/20210526/tmp_s.jpg"
          const resourceUrl = res.data.fileUrl
          if (fType == 1) {
            const length = _this.quill.getSelection().index
            // console.log("视频地址：",resourceUrl);
            let newVideoUrl = resourceUrl
            // 拿到的路径http://res.gaodanyi.com:8102是有跨域还是其他问题，反正就是需要把路径替换为https://app.gaodanyi.com:9443
            if (resourceUrl.includes('http://res.gaodanyi.com:8102')) {
              newVideoUrl = resourceUrl.replace('http://res.gaodanyi.com:8102', 'https://app.gaodanyi.com:9443')
            }

            _this.quill.insertEmbed(length, 'video', newVideoUrl)
            _this.quill.setSelection(length + 1) // 光标位置向后移动一位
            _this.$emit('changeVal', _this.txt) // 将内容同步到父组件中
          }
          else if (fType == 2) {
            const length = _this.quill.getSelection().index
            _this.quill.insertEmbed(length + 1, 'audio', { url: resourceUrl }, 'api')
            _this.quill.insertText(length, '')
            _this.quill.setSelection(length + 2) // 光标位置向后移动一位
            _this.$emit('changeVal', _this.txt) // 将内容同步到父组件中
          }
        }
        else {
          _this.perValue = ''
          _this.$emit('changeLoad', false)
          _this.$message({
            type: 'error',
            message: '上传失败，请重试',
          })
          return false
        }
      })
    },
  },
}
</script>

<template>
  <div id="quillEditor">
    <QuillEditor ref="myTextEditor" v-model="txt" class="editorStyle" :options="editorOption" />
    <!-- @change="onEditorChange($event)" 监听内容变化的方法，可以试一下 -->
    <!-- 自定义上传图片 -->
    <!--
      http-request="requestUploadImage"   覆盖默认的上传事件
      :on-success="handleSuccessImage"  默认上传成功事件
      v-loading.fullscreen.lock：设置上传时显示loading，值为true/false；默认上传时才有效
      v-loading.lock="fullscreenLoading"
      :on-progress="uploadingImage"
     -->
    <div style="display:none;">
      <ElUpload
        class="upload-demo"
        action="#"
        name="file"
        accept=".jpg,.png"
        :http-request="requestUploadImage"
        :before-upload="beforeUploadImage"
        :on-success="handleSuccessImage"
        multiple
      >
        <ElButton size="small" class="uploadImgBtn" type="primary" />
      </ElUpload>
    </div>

    <!--
      自定义上传音频模拟上传组件
      首先，必须隐藏这个元素：display:none；
      v-loading.fullscreen.lock：设置上传时显示loading，值为true/false；
      action：设置上传的地址；
      before-upload：上传前的钩子函数，验证是否为音频文件；
      on-success：上传成功的钩子函数；
      on-progress：上传时的钩子函数，设置显示loading
      :on-progress="uploadIngAudio"
      v-loading.fullscreen.lock="fullscreenLoading"
    -->
    <div style="display:none">
      <ElUpload
        action="#"
        accept=".mp3,.aac,.m4a"
        :before-upload="beforeUploadAudio"
        :http-request="requestUploadAudio"
        :on-success="handleSuccessAudio"
      >
        <ElButton size="small" class="uploadVoiceBtn" type="primary">
          upload
        </ElButton>
      </ElUpload>
    </div>

    <!--
      v-loading.lock="fullscreenLoading"
      :on-success="handleSuccessAudio"
      :on-progress="uploadingVideo"
     -->
    <div style="display:none">
      <ElUpload
        action="#"
        accept=".mp4"
        :before-upload="beforeUploadVideo"
        :http-request="requestUploadVideo"
      >
        <ElButton size="small" class="uploadVideoBtn" type="primary">
          upload
        </ElButton>
      </ElUpload>
    </div>
  </div>
</template>

<style scoped lang='less'>
@deep:~">>>";
#quillEditor{
  position: relative;
  text-align: left;
  .editorStyle{
    color:#333;
    margin-bottom:40px;
  }
 @{deep} video{
   width:260px;
   height: 200px;
 }

  @{deep} .ql-container{
    border-top:1px solid #ccc;
  }
}
</style>
