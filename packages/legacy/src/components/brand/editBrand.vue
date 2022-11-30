<script>
import { Upload } from '@oit/element-ui-extend'
import getIndustryAll from '@/api/brand'

export default {
  name: 'AddBrand',
  components: { VcUpload: Upload },
  filters: {
    formatType(val) {
      return val == '0' ? 'HOME' : 'APP'
    },
  },
  data() {
    return {
      loading: false,
      dialog: false, // 新增公司
      addLoading: false, // 新增公司loading
      total: 0, // 共多少条
      activeStep: 0,
      prevDisabled: true, // 上一步按钮是否可用
      status: true,
      formLabelWidth: '80px',
      timer: null,
      ADMIN: 'Admin',
      // 新增品牌入参
      orgId: '',
      orgName: '',
      address: '',
      adminName: '',
      brandName: '',
      contacts: '',
      mailbox: '',
      bueStartTime: '',
      bueEndTime: '',
      gradeS: '',
      gradeA: '',
      gradeB: '',
      gradeC: '',
      totalNumShop: '',
      telephone: '',

      // 选择
      tableRadio: '',

      brandArr: [],
      brandList: {},
      rules: {
        brandLogo: [
          { required: true, message: '请上传品牌logo', trigger: 'blur' },
        ],
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        abbreviation: [
          { required: true, message: '请输入品牌简称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        industryId: [
          { required: true, message: '请选择所属行业', trigger: 'blur' },
        ],
        brandType: [
          { required: true, message: '请选择所属类型', trigger: 'blur' },
        ],
        dueStartTime: [
          { required: true, message: '请选择入驻时间', trigger: 'blur' },
        ],
        dueEndTime: [
          { required: true, message: '请选择到期时间', trigger: 'blur' },
        ],
        totalNumShop: [
          { required: true, message: '请输入店铺总数量', trigger: 'blur' },
        ],
      },
      allPayMenuList: [
        {
          childrenMenu: null,
          createDate: '2021-07-21',
          createId: 1,
          fieldDes: null,
          isPay: 1,
          menuCode: 'courseList',
          menuId: '300',
          menuImg: 'el-icon-warning',
          menuName: '微课堂',
          menuRemark: 'courseList',
          menuUrl: '/classList/courseList',
          orderBy: 0,
          path: '0',
          type: '1',
          updateId: 0,
          updateTime: '2021-07-21',
        },
        {
          childrenMenu: null,
          createDate: '2021-07-21',
          createId: 1,
          fieldDes: null,
          isPay: 1,
          menuCode: 'testList1',
          menuId: '301',
          menuImg: 'el-icon-warning',
          menuName: '测试列表1',
          menuRemark: 'testList1',
          menuUrl: '/classList/testList1',
          orderBy: 0,
          path: '0',
          type: '1',
          updateId: 0,
          updateTime: '2021-07-21',
        },
        {
          childrenMenu: null,
          createDate: '2021-07-21',
          createId: 1,
          fieldDes: null,
          isPay: 1,
          menuCode: 'testList2',
          menuId: '302',
          menuImg: 'el-icon-warning',
          menuName: '测试列表2',
          menuRemark: 'testList2',
          menuUrl: '/classList/testList2',
          orderBy: 0,
          path: '0',
          type: '0',
          updateId: 0,
          updateTime: '2021-07-21',
        },
      ],
      checkedMenuArr: [], // 已选择日期的菜单列表
      payedMenuList: [], // 已付费菜单列表
      uploadFileList: [],

    }
  },
  computed: {
    uploadOption() {
      return {
        drag: true,
        showFileList: true,
        multiple: false,
        maxSize: 1024 * 10,
        limit: 2,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onSuccess: (...e) => {
          this.brandList.brandLogo = ''
          this.brandList.brandLogo = e[0].data.fileUrl
        },
        onError: (e, file) => {
          this.$message.error(`${file.name} 上传失败，请重试！`)
        },
      }
    },
  },
  watch: {

  },
  created() {},
  mounted() {
    this.brandList = this.$route.query.item
    console.log(this.brandList)
    if (this.brandList.brandState) {
      this.status = false
    }
    else {
      this.status = true
    }
    // this.getAllPayMenuList();
    this.getShowMenus()

    this.getIndustryAll()
    // this.changeDate()
  },
  activated() {},
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 图片上传获取地址
    // changeFile(file, fileList) {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: '小易拼命上传中...',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)',
    //     target: document.querySelector('.mainBody'),
    //   })

    //   const _this = this
    //   // this.imageUrl = URL.createObjectURL(file.raw);
    //   const reader = new FileReader()
    //   reader.readAsDataURL(file.file)
    //   reader.onload = function () {
    //     // console.log(reader.result)//base64
    //     const con = {
    //       files: reader.result,
    //       fileType: 0, // 0:图片，1：视频，2：音频
    //       userId: sessionStorage.userId,
    //     }
    //     // {headers: {"Content-Type": "multipart/form-data",},}
    //     _this.$axios.post(`${_this.GLOBAL.system_manager_server}/file/uploadFile`, con).then((res) => {
    //       // console.log('图片地址：',res.data.data)
    //       // console.log(res.data.data.fileUrls[0].fileUrl)
    //       _this.brandList.brandLogo = res.data.data.fileUrls[0].fileUrl

    //       loading.close()
    //     })
    //   }
    // },
    // 获取已付费菜单
    getShowMenus() {
      const _this = this
      const params = {
        brandId: this.$route.query.item.id,
      }
      const jsonParam = this.GLOBAL.g_paramJson(params)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/getPayMenu`, jsonParam).then((res) => {
        // // console.log("获取已付费菜单", res.data.body);
        if (res.data.head.status == '0') {
          _this.payedMenuList = res.data.body.resultList
          _this.getAllPayMenuList()
        }
        else {
          _this.$toast(res.data.message)
        }
      })
    },
    // 获取所有需要付费的菜单
    getAllPayMenuList() {
      const _this = this
      const con = {}
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      // // console.log('获取品牌注册列表参数',con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/getAllPayMenu`, jsonParam).then((res) => {
        // // console.log('获取所有需要付费的菜单:',res.data.body);
        if (res.data.head.status == 0) {
          _this.allPayMenuList = res.data.body.resultList
          _this.allPayMenuList.forEach((el) => {
            _this.$set(el, 'serviceDate', '') // 先给全部数组值设置一个serviceDate属性
          })
          for (let i = 0; i < _this.allPayMenuList.length; i++) {
            for (let j = 0; j < _this.payedMenuList.length; j++) {
              if (_this.allPayMenuList[i].menuId == _this.payedMenuList[j].menuId) {
                // // console.log('this.allPayMenuList[i]:',this.allPayMenuList[i]);
                const arr = []
                arr[0] = _this.payedMenuList[j].startTime
                arr[1] = _this.payedMenuList[j].endTime
                _this.allPayMenuList[i].serviceDate = arr
              }
            }
          }
          _this.changeDate()
          // console.log("111111>>>>",_this.allPayMenuList)
          // console.log('_this.allPayMenuList--->',_this.allPayMenuList)
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    async getIndustryAll() {
      const res = await getIndustryAll()
      this.options = res.body.resultList
    },
    // 获取已选择日期的菜单并格式化为传参需要的格式
    changeDate() {
      this.checkedMenuArr = []
      for (let i = 0; i < this.allPayMenuList.length; i++) {
        if (this.allPayMenuList[i].serviceDate) {
          const obj = {}
          obj.menuId = this.allPayMenuList[i].menuId
          obj.startTime = this.allPayMenuList[i].serviceDate[0]
          obj.endTime = this.allPayMenuList[i].serviceDate[1]
          // // console.log("obj:===",obj);
          this.checkedMenuArr.push(obj)
        }
      }
      // // console.log('被选择日期的菜单数组：',this.checkedMenuArr)
    },
    // 取消
    cancel() {
      this.$router.go(-1)
    },

    // 保存
    conserve(formName) {
      // 上传文件，包括音频、视频、图片文件 文件类型，0:图片，1：视频，2：音频
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const reg = /^[A-Za-z0-9]+$/
          // // console.log(reg.test(this.brandList.adminName))
          if (this.brandList.contacts) {
            if (this.brandList.contacts.length > 2 && this.brandList.contacts.length < 10) {
              //
            }
            else {
              this.$message({
                type: 'warning',
                message: '联系人长度在2-10个字符',
              })
              return
            }
          }
          else {
            this.brandList.contacts = ''
          }
          if (this.brandList.telephone) {
            if (this.brandList.telephone.length != 11) {
              this.$message({
                type: 'warning',
                message: '请检查电话是否正确，长度仅限11位',
              })
              return
            }
          }
          this.brandList.brandId = this.brandList.id
          if (this.status) {
            this.brandList.brandState = 0
          }
          else {
            this.brandList.brandState = 1
          }
          const con = this.brandList
          const jsonParam = _this.GLOBAL.g_paramJson(con)
          // // console.log('编辑品牌参数',con)
          _this.$axios.post(`${_this.GLOBAL.system_manager_server}/brand/updateBrandInfo`, jsonParam).then((res) => {
            if (res.data.head.status == 0) {
              // 保存品牌基础信息后更新付费服务日期
              _this.updateServerDate()
            }
            else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          })
        }
        else {
          // console.log('error submit!!');
          return false
        }
      })
    },
    // 更新付费服务日期
    updateServerDate() {
      const _this = this
      const con = {
        brandId: this.$route.query.item.id,
        menuList: this.checkedMenuArr,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      // // console.log('获取品牌注册列表参数',con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/addOrmordifyBrandMenu`, jsonParam).then((res) => {
        // console.log('编辑品牌信息时保存付费菜单信息:',res.data.body);
        if (res.data.head.status == 0) {
          _this.$message({
            message: '保存品牌信息成功',
            type: 'success',
          })
          _this.$router.push({
            path: '/brand/brandList',
          })
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    test(...e) {
      console.log(e)
    },
  },
}
</script>

<template>
  <div id="addBrand" class="pageCommonStyle pt-4 px-4">
    <el-page-header content="编辑品牌" @back="goBack" />
    <el-divider />
    <div class="content">
      <el-form ref="brandList" :model="brandList" :rules="rules" label-width="120px">
        <el-form-item label="品牌Logo" prop="brandLogo">
          <!-- 上传品牌logo -->
          <vc-upload
            v-bind="uploadOption" ref="upload" action="/system/file/uploadFile"
            class="avatar-uploader"
            :show-file-list="false"
          >
            <img v-if="brandList.brandLogo || uploadFileList.fileUrl" :src="brandList.brandLogo" class="imgLogo">
            <el-button v-if="brandList.brandLogo" class="upBtn">
              修改品牌Logo
            </el-button>
            <el-button v-else class="upBtn">
              上传品牌Logo
            </el-button>
          </vc-upload>
        </el-form-item>
        <el-form-item label="品牌状态">
          <el-switch
            v-model="status"
            active-color="#4FD5AC"
            inactive-color="#e5e5e5"
          />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="brandList.brandName" placeholder="请输入品牌名称" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="品牌简称" prop="abbreviation">
          <el-input v-model="brandList.abbreviation" placeholder="请输入品牌简称" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="品牌类型" prop="brandType">
          <el-select v-model="brandList.brandType" placeholder="请选择品牌类型">
            <el-option label="品牌" :value="0" />
            <el-option label="商场" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业" prop="industryId">
          <el-select v-model="brandList.industryId" placeholder="请选择所属行业">
            <el-option
              v-for="item in options"
              :key="item.industryId"
              :label="item.industryName"
              :value="item.industryId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="品牌入驻时间" prop="dueStartTime">
          <el-date-picker
            v-model="brandList.dueStartTime"
            style="width:60%;"
            type="date"
            placeholder="请选择品牌入驻时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="品牌到期时间" prop="dueEndTime">
          <el-date-picker
            v-model="brandList.dueEndTime"
            style="width:60%;"
            type="date"
            placeholder="请选择品牌到期时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="店铺总数量" prop="totalNumShop">
          <el-input v-model="brandList.totalNumShop" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入店铺总数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="S级人员数量">
          <el-input v-model="brandList.gradeS" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入S级人员数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="A级人员数量">
          <el-input v-model="brandList.gradeA" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入A级人员数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="B级人员数量">
          <el-input v-model="brandList.gradeB" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入B级人员数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="C级人员数量">
          <el-input v-model="brandList.gradeC" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入C级人员数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="brandList.contacts" placeholder="请输入联系人" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="电 话">
          <el-input v-model="brandList.telephone" placeholder="请输入电话" autocomplete="off" style="width:60%;" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>
        <el-form-item label="邮 箱">
          <el-input v-model="brandList.mailbox" placeholder="请输入邮箱" autocomplete="off" style="width:60%;" />
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBox">
      <h3>功能付费授权</h3>
      <div>
        <el-table
          :data="allPayMenuList"
          stripe
          border
        >
          <el-table-column
            prop="menuName"
            label="菜单名称"
            width="140"
          />
          <el-table-column
            prop="menuCode"
            label="菜单编码"
            width="140"
          />
          <el-table-column
            width="100"
            prop="type"
            label="所属类型"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.type | formatType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="付费可用时间"
          >
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.serviceDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @input="changeDate"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="step">
      <el-button type="primary" @click="cancel">
        取消
      </el-button>
      <el-button type="primary" @click="conserve('brandList')">
        保存
      </el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@deep:~">>>";

#addBrand{
  min-height:82vh;
  display: flex;
  flex-direction: column;
  .tableBox{
    >div{
      width:calc(100% - 100px);
      .el-table{
        overflow:unset;
        float:left;
        width:60%;
      }
    }
  }
  h3{
    float:left;
    width:100px;
    padding-right:12px;
    color:#606266;
    font-size:13px;
    text-align:right;
    line-height:40px;
  }

  .content{
    .operateBtn{
      margin-bottom:10px;
      display:flex;
    }
  }
  .step{
    margin:10px 0;
    text-align:right;
  }
  .imgLogo{
    width:40px;
    height:40px;
    border-radius:20px;
  }
  .el-form-item:nth-child(1){
    height:40px;
  }
  @{deep} .el-tooltip {
    padding: 7px 7px!important;
  }
  /deep/.avatar-uploader .el-upload{
    display:flex;
  }
  ::v-deep{
    .el-upload-dragger{
      display: flex;
      width: 18%;
      height: 40px;
      border: 0;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height:40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .imgLogo{
      width:40px;
      height:40px;
      border-radius:20px;
      margin-right:10px;
    }
    // .upBtn{
    // }
  }
}
</style>
