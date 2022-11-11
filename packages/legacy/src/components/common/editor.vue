<script>
import E from 'wangeditor'
// let editor = new E('#editorBar', '#editor');  // 创建编辑器

// import E from 'wangeditor'
export default {
  name: 'Editoritem',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    isClear: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // uploadPath,
      editor: null,
      editorInfo: null,
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.editorInfo = null
      }
    },
    value(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    },
    // value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    seteditor() {
      const customMenus = {
        audio: {
          title: '音频',
          type: 'btn',
          command: 'audio',
          callback() {
            // alert("自定义函数")
          },
        },
      }
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      console.log('this.editor===', this.editor)
      // this.wangEditor({
      //   'customMenus':customMenus
      // })
      // 隐藏网络上传图片和视频
      this.editor.config.showLinkImg = false
      this.editor.config.showLinkVideo = false
      this.editor.config.debug = true // 开启wangEditor的错误提示，有利于我们更快的找到出错的地方

      this.editor.config.uploadImgHeaders = { } // 自定义 header
      this.editor.config.uploadFileName = 'image' // 后端接受上传文件的参数名
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.config.uploadImgMaxLength = 3 // 限制一次最多上传 3 张图片
      this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

      this.editor.config.uploadImgShowBase64 = true // base 64 存储图片
      // this.editor.config.uploadImgServer = `/gdy/${this.GLOBAL.system_manager_server}/file/uploadFile`;     //'/file/upload_images';   // 配置服务器端地址
      // this.editor.config.uploadImgParams = {   // 自定义参数
      //   token: 'xxxxx',
      //   x: 100
      // }

      const _this = this
      // 自定义上传函数，自己实现上传图片
      this.editor.config.customUploadImg = async function (files, insert) {
        // files 是数组形式的
        console.log('files=====', files)
        const arr = []
        await files.forEach((file) => {
          const isJPG = file.type === 'image/jpeg'
          const isPNG = file.type === 'image/png'
          if (!isJPG && !isPNG) {
            _this.$message.error('上传头像图片只能是 JPG、PNG 格式!')
            return
          }

          const reader = new FileReader()
          let fileResult = ''
          console.log('file', file)
          reader.readAsDataURL(file)
          // //开始转
          reader.onload = function (e) {
            // console.log(e.currentTarget.result)
            fileResult = e.currentTarget.result
            arr.push(fileResult)
            console.log('arr=====', arr)
            console.log(files.length, '----', arr.length)
            if (arr.length == files.length) {
              console.log('上传图片并插入编辑器')
              const con = {
                files: arr.join('#@#'),
                fileType: 0,
                userId: sessionStorage.userId,
              }

              // let jsonParam = _this.GLOBAL.g_paramJson(con);  // 这个接口跟平常不一样，不走head封装
              _this.$axios.post(`${_this.GLOBAL.system_manager_server}/file/uploadFile`, con).then((res) => {
                console.log('上传图片返回信息-----', res.data)
                if (res.data.code == 200) {
                  // // 单个文件
                  // let curImgUrl = res.data.data.fileUrls[0].thumbUrl;
                  // insert(curImgUrl)
                  // console.log('curImgUrl',curImgUrl)
                  console.log('res.data.data.fileUrls==', res.data.data.fileUrls)

                  const curImgs = res.data.data.fileUrls
                  console.log()
                  for (let i = 0; i < curImgs.length; i++) {
                    console.log('url===', res.data.data.fileUrls[i].fileUrl)
                    insert(curImgs[i].fileUrl)
                  }
                }
                else {
                  _this.$message({
                    message: res.data.head.msg,
                    type: 'warning',
                  })
                }
              }).catch((err) => {
                console.log(err)
              })
            }
          }
        })
      }

      this.editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
        // resultFiles 是 input 中选中的文件列表
        // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
        console.log('-------上传视频-----', resultFiles, insertVideoFn)
        const file = resultFiles[0]
        const reader = new FileReader()
        let fileResult = ''
        console.log('file', file)
        reader.readAsDataURL(file)
        // //开始转
        reader.onload = function (e) {
          // console.log(e.currentTarget.result)
          fileResult = e.currentTarget.result

          const con = {
            files: fileResult,
            fileType: 1,
            userId: sessionStorage.userId,
          }
          _this.$axios.post(`${_this.GLOBAL.system_manager_server}/file/uploadFile`, con).then((res) => {
            console.log('上传视频返回信息-----', res.data)
            if (res.data.code == 200) {
              // // 单个文件
              // let curImgUrl = res.data.data.fileUrls[0].thumbUrl;
              // insert(curImgUrl)
              // console.log('curImgUrl',curImgUrl)
              // console.log('res.data.data.fileUrls==',res.data.data.fileUrls)

              // let curImgs = res.data.data.fileUrls;
              // console.log()
              // for(let i=0;i<curImgs.length;i++){
              //   console.log('url===',res.data.data.fileUrls[i].thumbUrl)
              //   insert(curImgs[i].thumbUrl)
              // }

            }
            else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        }

        // 上传视频，返回结果，将视频地址插入到编辑器中
        // insertVideoFn(videoUrl)
      }

      // this.editor.config.uploadVideoServer = `/gdy/${this.GLOBAL.system_manager_server}/file/uploadFile`;   // 配置服务器端地址

      // 配置菜单
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'video', // 插入视频
        //  'video', // 插入视频
        'audio',
        'voice',
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
        'fullscreen', // 全屏
      ]

      this.editor.config.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          // result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
          // console.log(result.data[0].url)
          // insertImg()为插入图片的函数
          // 循环插入图片
          // for (let i = 0; i < 1; i++) {
          // console.log(result)
          const url = `http://otp.cdinfotech.top${result.url}`
          insertImg(url)
          // }
        },
      }

      this.editor.config.uploadVedioHooks = {
        customInsert(val) {
          console.log('上传视频', val)
        },
      }
      this.editor.config.uploadAudioHooks = {
        customInsert(val) {
          console.log('上传音频', val)
        },
      }

      // 编辑器里面的内容发生变化时，将内容同步到父组件中
      this.editor.config.onchange = (html) => {
        this.editorInfo = html // 绑定当前逐渐地值
        console.log(' this.editorInfo=======', this.editorInfo)
        this.$emit('change', this.editorInfo) // 将内容同步到父组件中
      }
      // 创建富文本编辑器
      this.editor.create()
    },

  },
}
</script>

<template>
  <div class="editorBox">
    <div id="editorBar" ref="toolbar" class="toolbar" />
    <div id="editor" ref="editor" style="height:340px" />
  </div>
</template>

<style lang="less" scoped>
@deep:~">>>";
.editorBox{
  text-align: left;
}
.toolbar {
  padding: 5px 10px;
  background: #fff;
  border: 1px solid #ccc;
  @{deep} .w-e-toolbar{
    z-index: 2!important;
  }
}

#editor {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-top: none;
  @{deep} .w-e-text-container{
    z-index: 1!important;
  }

  @{deep} .w-e-text img{
    width: 30%;
    // height: 100px ;
  }
}
</style>
