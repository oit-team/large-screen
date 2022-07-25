<template>
  <div class="pageCommonStyle" id="addGoods">
    <el-page-header @back="goBack" :content="title"></el-page-header>
    <el-divider></el-divider>
    <el-form
      style="margin-top: 20px"
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
      label-width="98px"
      label-position="right">
      <div class='goodsFormBox'>
        <div class='baseInfoBox'>
          <el-collapse v-model="activeName" >
              <el-collapse-item title="基础信息" name="1">
                <el-form-item label="商品名称" prop="goodsName">
                  <el-input v-model="ruleForm.goodsName" placeholder="请输入商品名称" style="width:96%;"></el-input>
                </el-form-item>
                <el-form-item label="作者编号" prop="authorId">
                  <!-- <el-input v-model="ruleForm.authorId" placeholder="请输入作者编号" style="width:96%;"></el-input> -->
                  <el-select v-model="ruleForm.authorId" filterable placeholder="请选择作者" style="width:96%;">
                      <el-option
                        v-for="item in authorList"
                        :key="item.id"
                        :label="item.authorName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品风格" prop="goodsStyle">
                  <el-input v-model="ruleForm.goodsStyle" placeholder="请输入商品风格" style="width:96%;"></el-input>
                </el-form-item>
                <el-form-item label="商品类型" prop="goodsCategory">
                  <el-select v-model="ruleForm.goodsCategory" placeholder="请选择商品类型" style="width:96%;">
                      <el-option
                        v-for="item in goodsTypeList"
                        :key="item.id"
                        :label="item.dictitemDisplayName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                  <el-input v-model="ruleForm.price" placeholder="请输入商品价格" style="width:96%;"></el-input>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item title="配置信息" name="2">
                <el-form-item label="商品尺寸" prop="goodsSize">
                  <el-input v-model="ruleForm.goodsSize" placeholder="请输入商品尺寸" style="width:96%;"></el-input>
                </el-form-item>
                <el-form-item label="商品材质" prop="goodsMaterials">
                  <el-input v-model="ruleForm.goodsMaterials" placeholder="请输入商品材质" style="width:96%;"></el-input>
                </el-form-item>
                <el-form-item label="外观描述" prop="appearanceDescription">
                  <el-input v-model="ruleForm.appearanceDescription" placeholder="请输入外观描述" style="width:96%;"></el-input>
                </el-form-item>
                <el-form-item label="商品标签" prop="goodsLabel">
                  <el-input v-model="ruleForm.goodsLabel" placeholder="请输入商品标签" style="width:96%;"></el-input>
                </el-form-item>
                <el-form-item label="适用场景" prop="purposes">
                  <el-input v-model="ruleForm.purposes" placeholder="请输入适用场景" style="width:96%;"></el-input>
                </el-form-item>
                <el-form-item label="注意事项" prop="mattersNeeding">
                  <el-input v-model="ruleForm.mattersNeeding" placeholder="请输入注意事项" style="width:96%;"></el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
        </div>
        
        <div class="fileInfoBox">
          <el-form-item label="商品图片">
            <el-upload
              :action="uploadUrl"
              :data="uploadData"
              :headers="headersData"
              multiple
              :limit="6"
              :file-list="fileList"
              :on-change="uploadChange"
              list-type="picture-card"
              accept='image/jpeg,image/jpg'
              :before-upload="beforeUploadImg"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <p class="tip">*最多可以上传6张图片(按住Ctrl或Alt键选择多张图片上传)，仅支持jpg格式</p>
          <el-form-item label="商品视频">
            <el-upload
              :action="uploadUrl"
              :data="uploadData"
              :headers="headersData"
              :on-progress="uploadVideoProcess"
              multiple
              :show-file-list="false"
              list-type="picture-card"
              accept='.mp4,.mov'
              :class="videoSrc?'el-upload-video':''"
              :before-upload="beforeUploadVideo"
              :on-success="VideoUploadSuccess"
            >
              <video
                style=""
                v-if='videoSrc'
                class="avatar video-avatar"
                :src="videoSrc"
                controls="controls">
                您的浏览器不支持视频播放
              </video>
              <el-progress v-if="!videoSrc&&uploadVideoFlag" type="circle" :percentage="perValue"></el-progress>
              <i v-if="!videoSrc&&!uploadVideoFlag" class="el-icon-plus"></i>
            </el-upload>
            <div v-if="videoSrc" style="margin-top:10px"> <el-button @click="delVideo">删除视频</el-button> </div>
          </el-form-item>
          <p class="tip">*最多可以上传1个视频,推荐格式mp4</p>
          <el-form-item label="视频贴图">
            <el-upload
              :action="uploadUrl"
              :data="uploadData"
              :headers="headersData"
              multiple
              :limit="1"
              :file-list="videoImgList"
              :on-change="VideouploadChange"
              list-type="picture-card"
              accept='image/jpeg,image/jpg'
              :before-upload="beforeUploadImg"
              :on-exceed="handleVideoExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleVideoImgRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <p class="tip">*最多可以上传1张图片，仅支持jpg格式</p>
        </div>
      </div>
      
      <el-form-item class="buttonBox">
        <el-button size="small" icon="el-icon-check" v-if="flag != 'read'" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" v-if="!editFlag" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :show-close="true" :before-close="handleClose">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'AddGoods',
  props: {},
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      uploadVideoFlag: false,
      perValue:0,
      videoSrc: '',
      goodsTypeList: [],
      authorList:[],
      uploadUrl: '',
      uploadData: {
        totalSize: '',
        startPos: 0,
        endPos: '',
        fileType: 1,
        userId: '',
        fname: '',
        noThumb: '',
      },
      headersData: {
        token: ''
      },
      activeName: '1', //折叠面板展开
      fileList: [], //商品图片上传
      videoImgList: [], //视频贴图上传
      timerType: '',
      TreeMenuList: [],
      editFlag: false,
      title: '',
      ruleForm: {
        goodsName: '',
        authorId: '',
        goodsStyle: '',
        goodsCategory: '',
        price: '',
        goodsId: '',
        goodsSize: '',
        goodsMaterials: '',
        appearanceDescription: '',
        mattersNeeding: '',
        goodsLabel: '',
        purposes: '',
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        authorId: [
          { required: true, message: '请选择作者编号', trigger: 'blur' },
        ],
        goodsStyle: [
          { required: true, message: '请输入商品风格', trigger: 'blur' },
        ],
        goodsCategory: [
          { required: true, message: '请选择商品类型', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
      },
      flag:'',
    }
  },
  created() {
    if (this.$route.query.item) {
      this.title = '编辑商品'
      this.editFlag = true
      this.ruleForm.goodsId = this.$route.query.item.goodsId
      this.ruleForm.goodsName = this.$route.query.item.goodsName
      this.ruleForm.authorId = this.$route.query.item.authorId
      this.ruleForm.goodsStyle = this.$route.query.item.goodsStyle
      this.ruleForm.price = this.$route.query.item.price
      this.ruleForm.goodsSize = this.$route.query.item.goodsSize
      this.ruleForm.goodsMaterials = this.$route.query.item.goodsMaterials
      this.ruleForm.appearanceDescription = this.$route.query.item.appearanceDescription
      this.ruleForm.purposes = this.$route.query.item.purposes
      this.ruleForm.mattersNeeding = this.$route.query.item.mattersNeeding
      this.ruleForm.goodsLabel = this.$route.query.item.goodsLabel
      this.ruleForm.goodsCategory = Number(this.$route.query.item.goodsCategory)
      this.fileList = this.$route.query.item.mainImage?this.setFileList(this.$route.query.item.mainImage):[]
      this.videoSrc = this.$route.query.item.video
      this.videoImgList = this.$route.query.item.videoImage?this.setFileList([{'resUrl':this.$route.query.item.videoImage}]):[]
      if (this.$route.query.flag) {
        this.flag = this.$route.query.flag
        console.log(this.flag)
      }
    } else {
      this.title = '新增商品'
    }
  },
  mounted() {
    this.headersData.token = sessionStorage.accessToken
    this.uploadData.userId = sessionStorage.userId
    this.uploadUrl = this.Api.uploadFile
    this.getGoodsType()
    this.getAuthorList()
  },
  activated() {},
  watch: {},
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    goBack() {
      this.$router.go(-1)
    },
    getAuthorList() {
      const _this = this
      const con = {
        pageNum: 1,
        pageSize: 9999,
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.getAuthorInfoList, jsonParam).then((res) => {
        if(res.data.head.status === 0) {
          _this.authorList = res.data.body.resultList
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
       
      })
    },
    getGoodsType() {
      const _this = this
      const con = {
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.getGoodsCategory, jsonParam).then((res) => {
        _this.goodsTypeList = res.data.body.result
      })
    },
    setFileList(res) {
      const imgList = []
      res.forEach((item) => {
        const NameIndex = item.resUrl.lastIndexOf("/");
        const name = item.resUrl.substring(NameIndex+1);
        imgList.push({'name':name,'url':item.resUrl})
      })
      return imgList
    },
    getImgList(imgList) {
      let mainImage = []
      imgList.forEach((item) => {
        if(item.response){
          mainImage.push(item.response.fileUrl)
        } else {
          mainImage.push(item.url)
        }
      })
      return mainImage.toString()
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const con = {
            goodsName: _this.ruleForm.goodsName,
            authorId: _this.ruleForm.authorId,
            goodsStyle: _this.ruleForm.goodsStyle,
            goodsCategory: _this.ruleForm.goodsCategory,
            price: _this.ruleForm.price,
            mainImage: _this.getImgList(_this.fileList),
            goodsSize: _this.ruleForm.goodsSize,
            goodsMaterials: _this.ruleForm.goodsMaterials,
            appearanceDescription: _this.ruleForm.appearanceDescription,
            mattersNeeding: _this.ruleForm.mattersNeeding,
            goodsLabel: _this.ruleForm.goodsLabel,
            video: _this.videoSrc,
            videoImage: _this.getImgList(_this.videoImgList),
            purposes: _this.ruleForm.purposes,
          }
          if (_this.editFlag) {
            con.goodsId = _this.ruleForm.goodsId
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateGoodsInfo, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑任务成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow','')
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.addGoodsInfo, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增商品成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', '')
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleVideoImgRemove(file, fileList) {
      this.videoImgList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传图片
    beforeUploadImg(file){
      this.uploadData.totalSize = parseInt(file.size/1024)
      this.uploadData.endPos = file.size
      this.uploadData.fileType = '0'
      const pointIndex = file.name.lastIndexOf(".");
      const fileType = file.name.substring(pointIndex+1);   //获取到文件后缀名
      const isJPG = (fileType === "jpg");
      const isLt4M = file.size / 1024 / 1024 < 4;
      const hour = Math.floor(Date.now() / (1000 * 60 * 60))
      const md5FileName = `${ this.md5(file.name + hour).toString() }.${ fileType }`
      this.uploadData.fname = md5FileName
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
        return false
      }
      if (!isLt4M) {
        this.$message.error("上传图片大小不能超过 4MB!");
        return false
      }
      return isJPG && isLt4M;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleVideoExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    uploadChange(files, fileList) {
      this.fileList = fileList;
    },
    VideouploadChange(files, fileList) {
      this.videoImgList = fileList
    },
    uploadVideoProcess(event, file, fileList) {
      this.uploadVideoFlag = true;
      this.perValue = file.percentage.toFixed(0) * 1;
    },
    beforeUploadVideo(file){
      this.delVideo()
      this.uploadData.totalSize = parseInt(file.size/1024)
      this.uploadData.endPos = file.size
      this.uploadData.fileType = '1'
      const pointIndex = file.name.lastIndexOf(".");
      const fileType = file.name.substring(pointIndex+1);   //获取到文件后缀名
      const isVideo = (fileType === "mp4" || fileType === "mov");
      const isLt4M = file.size / 1024 / 1024 < 50;
      const hour = Math.floor(Date.now() / (1000 * 60 * 60))
      const md5FileName = `${ this.md5(file.name + hour).toString() }.${ fileType }`
      this.uploadData.fname = md5FileName
      if (!isVideo) {
        this.$message.error("上传视频只能是 mp4，mov 格式!");
        return false
      }
      if (!isLt4M) {
        this.$message.error("上传视频大小不能超过 50MB!");
        return false
      }
      return isVideo && isLt4M;
    },
    VideoUploadError() {
      
    },
    VideoUploadSuccess(res,file){
      // this.isShowUploadVideo = true;
      this.uploadVideoFlag = false;
      this.perValue = 0;
      if (res.status === 0) {
        this.videoSrc = res.fileUrl
      } else {
        this.$message.error('上传失败');
      }
    },
    delVideo() {
      this.videoSrc = ''
    }
  },
}
</script>
<style lang="scss" scoped>
  .tip{
    color:red;
  }
  #addGoods{
    min-height: 82vh;
    text-align: left;
  
    //商品基础信息
    .goodsFormBox{
      width:100%;
      line-height: 100%;
      display: flex;
      justify-content: space-between;
      // border:2px solid red;
      .baseInfoBox{
        width: 46%;
        // border:2px solid red;
        .labelList{
          padding-left:90px;
          display: flex;
          flex-wrap: wrap;
          .labelItem{
            border:1px solid #DCDFE6;
            padding:6px 10px;
            margin-right:10px;
            margin-bottom:10px;
          }
        }
      }
      .fileInfoBox{
        width: 54%;
        border-left:1px solid #DCDFE6;
        .patchImage{
          width: 148px;
          height: 148px;
          display: block;
        }
      }
    }
    .tip{
      padding-left:90px;
      color:#e60012;
      margin:12px 0px;
    }
    .el-upload-video{
      height:200px;
      ::v-deep .el-form-item{
        margin-bottom:20px;
      }
      ::v-deep .el-upload{
        width:70%;
        border:0px;
      }
      ::v-deep video{
          width:100%;
          height: 200px;
      }
    }
    .addVideoIcon{
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      line-height: 146px;
      vertical-align: top;
    }

  
    // 商品尺码
    .goodsSizeBox{
      // border:2px solid green;
      .noSizeInfo{
        text-align: center;
        line-height: 60px;
      }
    }
    .saveBtnBox{
      display: flex;
      justify-content: center;
      margin:20px 0px;
    }
    ::v-deep .el-tooltip {
      padding: 7px!important;
    }
    ::v-deep .el-table__empty-block {
      height: 50px!important;
    }
    ::v-deep .el-table .cell{
      text-overflow: clip;
    }
    ::v-deep .el-table .cell input{
      width:80%;
      height:20px;
      border:none;
      outline: 1px solid #aaa;
    }
    ::v-deep .el-table .cell input:focus {//获取焦点
      outline: 1px solid #1978fe;//边框不用border，用outline
      // background: rgba(3, 16, 28, 0);//背景色
    }
    .buttonBox{
      text-align: center;
      ::v-deep .el-form-item__content{
        margin-left:-8%!important;
      }
    }
  }
</style>

