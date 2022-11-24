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
      // 上传头像
      imageUrl: '',

      loading: false,
      // pageNum:1,
      // pagesize:10,
      dialog: false, // 新增公司
      total: 0, // 共多少条
      activeStep: 0,
      prevDisabled: true, // 上一步按钮是否可用
      brandData: [],
      formLabelWidth: '80px',
      timer: null,
      ADMIN: 'Admin',
      // 新增品牌入参
      ruleForm: {
        orgId: '',
        orgName: '',
        address: '',
        adminName: '',
        brandName: '',
        brandType: '',
        abbreviation: '',
        brandLogo: '',
        bueStartTime: '',
        bueEndTime: '',
        contacts: '',
        mailbox: '',
        gradeS: '',
        gradeA: '',
        gradeB: '',
        gradeC: '',
        totalNumShop: '',
        telephone: '',
        industryId: '',
      },

      // 选择
      tableRadio: '',
      rules: {
        brandLogo: [
          { required: true, message: '请上传品牌Logo', trigger: 'blur' },
        ],
        orgName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        industryId: [
          { required: true, message: '请选择所属行业', trigger: 'blur' },
        ],
        adminName: [
          { required: true, message: '请输入管理员名称，长度在 2 到 10 个字符', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入英文字母或数字', trigger: 'blur' },
        ],
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        brandType: [
          { required: true, message: '请输入品牌类型', trigger: 'blur' },
        ],
        abbreviation: [
          { required: true, message: '请输入品牌简称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
        bueStartTime: [
          { required: true, message: '请选择入驻时间', trigger: 'blur' },
        ],
        bueEndTime: [
          { required: true, message: '请选择到期时间', trigger: 'blur' },
        ],
        totalNumShop: [
          { required: true, message: '请输入店铺总数量', trigger: 'blur' },
        ],
      },
      options: [],

    }
  },
  computed: {
    uploadOption() {
      return {
        drag: true,
        showFileList: true,
        multiple: false,
        maxSize: 1024 * 10,
        limit: 1,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onSuccess: (...e) => {
          this.imageUrl = e[0].data.fileUrl
          this.ruleForm.brandLogo = e[0].data.fileUrl
        },
      }
    },
  },

  watch: {

  },
  created() {

  },
  mounted() {
    this.companyShow()
    this.getIndustryAll()
  },
  activated() {},
  methods: {
    changeFile(file, fileList) {
      const loading = this.$loading({
        lock: true,
        text: '小易拼命上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.mainBody'),
      })
      const _this = this
      // this.imageUrl = URL.createObjectURL(file.raw);
      const reader = new FileReader()
      reader.readAsDataURL(file.file)
      reader.onload = function () {
        // // console.log(reader.result)//base64
        const con = {
          files: reader.result,
          fileType: 0, // 0:图片，1：视频，2：音频
          userId: sessionStorage.userId,
        }
        // {headers: {"Content-Type": "multipart/form-data",},}
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/file/uploadFile`, con).then((res) => {
          // // console.log('图片地址：',res.data.data)
          // // console.log(res.data.data.fileUrls[0].fileUrl)
          _this.ruleForm.brandLogo = res.data.data.fileUrls[0].fileUrl
          _this.imageUrl = res.data.data.fileUrls[0].fileUrl

          loading.close()
        })
      }
    },
    // 公司列表
    companyShow() {
      const _this = this
      const con = {}
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/company/getCompanyList`, jsonParam).then((res) => {
        // console.log('查询公司列表==========', res.data.body)
        if (res.data.head.status == 0) {
          this.brandData = res.data.body.companyList
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
    },
    async getIndustryAll() {
      const res = await getIndustryAll()
      this.options = res.body.resultList
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 新增公司弹框
    addCompany() {
      this.dialog = true
      this.ruleForm.orgId = ''
      this.ruleForm.orgName = ''
      this.ruleForm.address = ''
    },
    // 编辑公司弹框
    editRoleItem(item) {
      this.dialog = true
      this.ruleForm.orgId = item.orgId
      this.ruleForm.orgName = item.orgName
      this.ruleForm.address = item.address
    },
    // 取消新增/编辑公司
    cancelForm() {
      this.dialog = false
      clearTimeout(this.timer)
    },
    // 提交新增/保存编辑公司
    handleClose(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.orgId) {
            const con = {
              orgId: this.ruleForm.orgId,
              orgName: this.ruleForm.orgName,
              address: this.ruleForm.address,
            }
            const jsonParam = _this.GLOBAL.g_paramJson(con)
            // console.log('编辑公司参数',con)
            _this.$axios.post(`${_this.GLOBAL.system_manager_server}/company/updateCompanyInfo`, jsonParam).then((res) => {
              if (res.data.head.status == 0) {
                this.dialog = false
                _this.$message({
                  message: res.data.head.msg,
                  type: 'success',
                })
                this.companyShow()
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
            const con = {
              orgName: this.ruleForm.orgName,
              address: this.ruleForm.address,
            }
            const jsonParam = _this.GLOBAL.g_paramJson(con)
            // console.log('新增公司参数',con)
            _this.$axios.post(`${_this.GLOBAL.system_manager_server}/company/insertCompanyInfo`, jsonParam).then((res) => {
              if (res.data.head.status == 0) {
                this.dialog = false
                _this.$message({
                  message: res.data.head.msg,
                  type: 'success',
                })
                this.companyShow()
              }
              else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            })
          }
        }
        else {
          // console.log('error submit!!');
          return false
        }
      })
    },

    // 删除公司
    delRoleItem(item) {
      this.$confirm('确认删除该公司信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          orgId: item.orgId,
        }
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        // console.log('删除公司参数',con)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/company/deleteCompanyInfo`, jsonParam).then((res) => {
          if (res.data.head.status == 0) {
            // console.log('删除成功')
            _this.$message({
              message: res.data.head.msg,
              type: 'success',
            })
            this.companyShow()
          }
          else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // table样式
    rowClass({ row, rowIndex }) {
      // // console.log(rowIndex)      //0   表头行标号为0
      return this.GLOBAL.tableHeadStyle
    },
    // table样式
    tableCellStyle() {
      return this.GLOBAL.tableCellStyle
    },

    // 选择(table单选)
    clickChange(item) {
      this.tableRadio = item
      // console.log(item)
    },
    // 点击上一步
    clickPerv() {
      this.activeStep = this.activeStep - 1
      // // console.log('this.activeStep====',this.activeStep)
      if (this.activeStep <= 0) {
        this.activeStep = 0
        this.prevDisabled = true
      }
      else {
        this.prevDisabled = false
      }
    },
    // 点击下一步
    clickNext(formName) {
      if (this.activeStep == 0) {
        // 判断是否选中
        if (this.tableRadio.orgId) {
          this.activeStep = this.activeStep + 1
          this.prevDisabled = false
        }
        else {
          this.$message({
            type: 'warning',
            message: '请选择公司',
          })
        }
      }
      else {
        if (this.activeStep == 1) {
          // 校验
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // console.log(this.ruleForm.adminName)
              const reg = /^[A-Za-z0-9]+$/
              // console.log(reg.test(this.ruleForm.adminName))
              if (reg.test(this.ruleForm.adminName)) {
                //
              }
              else {
                this.$message({
                  type: 'warning',
                  message: '管理员名称仅限输入英文字母或数字',
                })
                return
              }
              if (this.ruleForm.contacts) {
                if (this.ruleForm.contacts.length > 2 && this.ruleForm.contacts.length < 10) {
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
                this.ruleForm.contacts = ''
              }
              if (this.ruleForm.telephone) {
                if (this.ruleForm.telephone.length != 11) {
                  this.$message({
                    type: 'warning',
                    message: '请检查电话是否正确，长度仅限11位',
                  })
                  return
                }
              }
              this.prevDisabled = false
              this.activeStep = this.activeStep + 1
            }
            else {
              this.$message({
                type: 'warning',
                message: '请输入必填信息',
              })
            }
          })
        }
      }
    },
    // 新增品牌
    regbrand(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const con = {
            brandLogo: this.ruleForm.brandLogo,
            orgId: this.tableRadio.orgId,
            adminName: this.ruleForm.adminName + this.ADMIN,
            brandName: this.ruleForm.brandName,
            brandType: this.ruleForm.brandType,
            abbreviation: this.ruleForm.abbreviation,
            contacts: this.ruleForm.contacts,
            telephone: this.ruleForm.telephone,
            mailbox: this.ruleForm.mailbox,
            dueStartTime: this.ruleForm.bueStartTime,
            dueEndTime: this.ruleForm.bueEndTime,
            gradeS: this.ruleForm.gradeS,
            gradeA: this.ruleForm.gradeA,
            gradeB: this.ruleForm.gradeB,
            gradeC: this.ruleForm.gradeC,
            totalNumShop: this.ruleForm.totalNumShop,
            industryId: this.ruleForm.industryId,
          }
          // console.log('新增品牌参数',con)
          const jsonParam = _this.GLOBAL.g_paramJson(con)
          _this.$axios.post(`${_this.GLOBAL.system_manager_server}/brand/insertBrandInfo`, jsonParam).then((res) => {
          // console.log("新增品牌-----",res.data.body);
            if (res.data.head.status == 0) {
            // 成功
              _this.$message({
                message: res.data.head.msg,
                type: 'success',
              })
              this.$router.push({
                path: '/brand/brandList',
              })
            }
            else {
            // 失败
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

  },
}
</script>

<template>
  <div id="addBrand" class="pageCommonStyle page-container text-sm">
    <el-page-header content="新增品牌" @back="goBack" />
    <el-divider />
    <el-steps :active="activeStep" finish-status="success" simple style="margin:10px 0px;">
      <el-step title="选择公司信息" />
      <el-step title="填写品牌信息" />
      <el-step title="填写品牌配置" />
    </el-steps>
    <div v-show="activeStep == 0" class="content">
      <div class="operateBtn">
        <el-button size="small" icon="el-icon-plus" class="addBtnOnly" type="success" @click="addCompany()">
          新增公司
        </el-button>
        <el-drawer
          ref="drawer"
          :title="ruleForm.orgId ? '编辑公司' : '新增公司'"
          :visible.sync="dialog"
          direction="rtl"
          custom-class="demo-drawer"
        >
          <div class="demo-drawer__content h-full p-4 flex flex-col justify-between">
            <el-form ref="addRuleForm" :model="ruleForm" :rules="rules" label-width="90px">
              <el-form-item label="公司名称" prop="orgName">
                <el-input v-model="ruleForm.orgName" placeholder="请输入公司名称" autocomplete="off" />
              </el-form-item>
              <el-form-item label="公司地址" prop="address">
                <el-input v-model="ruleForm.address" placeholder="请输入公司地址" autocomplete="off" />
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer flex justify-around">
              <el-button @click="cancelForm">
                取 消
              </el-button>
              <el-button v-if="ruleForm.orgId" type="primary" @click="handleClose('addRuleForm')">
                保存
              </el-button>
              <el-button v-else type="primary" @click="handleClose('addRuleForm')">
                提交
              </el-button>
            </div>
          </div>
        </el-drawer>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="小易拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="brandData"
        style="width: 100%;height:auto;min-height:500px;border-bottom:1px solid #fff;border-top:1px solid #ddd;"
        stripe
        border
        :header-cell-style="rowClass"
        :cell-style="tableCellStyle"
        @current-change="clickChange"
      >
        <el-table-column label="选择" width="55">
          <template slot-scope="scope">
            <el-radio v-model="tableRadio" :label="scope.row">
              <i />
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="公司名称"
        />
        <el-table-column
          prop="address"
          label="公司地址"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="140"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑公司" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" class="editBtnOnly" circle @click="editRoleItem(scope.row, scope.$index)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除公司" placement="top">
              <el-button size="mini" type="danger" icon="el-icon-delete" class="delBtnOnly" circle @click="delRoleItem(scope.row, scope.$index)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="activeStep == 1" class="content">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
        <el-form-item label="品牌Logo" prop="brandLogo">
          <!-- action="http://192.168.9.71:8089/gdy/system/file/uploadFile" -->
          <vc-upload
            v-bind="uploadOption" ref="upload" action="/system/file/uploadFile"
            class="avatar-uploader"
            :show-file-list="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="imgLogo">
            <el-button class="upBtn">
              上传品牌Logo
            </el-button>
          </vc-upload>
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="ruleForm.brandName" placeholder="请输入品牌名称" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="品牌简称" prop="abbreviation">
          <el-input v-model="ruleForm.abbreviation" placeholder="请输入品牌简称" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="所属行业" prop="industryId">
          <el-select v-model="ruleForm.industryId" placeholder="请选择所属行业">
            <el-option
              v-for="item in options"
              :key="item.industryId"
              :label="item.industryName"
              :value="item.industryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="管理员名称" prop="adminName">
          <el-input v-model="ruleForm.adminName" maxlength="10" placeholder="请输入管理员名称" autocomplete="off" style="width:60%;">
            <template slot="append">
              {{ ADMIN }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="品牌类型" prop="brandType">
          <el-select v-model="ruleForm.brandType" placeholder="请选择品牌类型">
            <el-option label="品牌" value="0" />
            <el-option label="商场" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌入驻时间" prop="bueStartTime">
          <el-date-picker
            v-model="ruleForm.bueStartTime"
            style="width:60%;"
            type="date"
            placeholder="请选择品牌入驻时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="品牌到期时间" prop="bueEndTime">
          <el-date-picker
            v-model="ruleForm.bueEndTime"
            style="width:60%;"
            type="date"
            placeholder="请选择品牌到期时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="ruleForm.contacts" placeholder="请输入联系人" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="电 话">
          <el-input v-model="ruleForm.telephone" placeholder="请输入电话" autocomplete="off" style="width:60%;" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>
        <el-form-item label="邮 箱">
          <el-input v-model="ruleForm.mailbox" type="email" placeholder="请输入邮箱" autocomplete="off" style="width:60%;" />
        </el-form-item>
      </el-form>
    </div>
    <div v-show="activeStep == 2" class="content">
      <h3 style="text-align:left;line-height:40px;">
        店铺&人员限制
      </h3>
      <el-form ref="form" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="店铺总数量" prop="totalNumShop">
          <el-input v-model="ruleForm.totalNumShop" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入店铺总数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="S级人员数量">
          <el-input v-model="ruleForm.gradeS" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入S级人员数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="A级人员数量">
          <el-input v-model="ruleForm.gradeA" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入A级人员数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="B级人员数量">
          <el-input v-model="ruleForm.gradeB" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入B级人员数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
        <el-form-item label="C级人员数量">
          <el-input v-model="ruleForm.gradeC" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入C级人员数量" autocomplete="off" style="width:60%;" />
        </el-form-item>
      </el-form>
    </div>
    <div class="step">
      <el-button style="margin-left:auto;" type="primary" plain :disabled="prevDisabled" @click="clickPerv()">
        上一步
      </el-button>
      <el-button v-if="activeStep < 2" type="primary" plain @click="clickNext('ruleForm')">
        下一步
      </el-button>
      <el-button v-if="activeStep >= 2" type="primary" plain @click="regbrand('form')">
        提交
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
  .content{
    // min-height:500px;
    .operateBtn{
      margin-bottom:10px;
      display:flex;
    }
  }
  .step{
    background-color: #fff;
    // border:1px solid #000;
    margin:10px 0;
    // position: fixed;
    // bottom:80px;
    z-index: 4;
    height: 50px;
    display: flex;
    align-items: center;
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

  /deep/.el-step__head{
    display: flex;
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

  // .avatar-uploader .el-upload:hover {
  //   border-color: #409EFF;
  // }
  // .avatar-uploader-icon {
  //   font-size: 28px;
  //   color: #8c939d;
  //   width: 178px;
  //   height: 178px;
  //   line-height: 178px;
  //   text-align: center;
  // }
  // .avatar {
  //   width: 178px;
  //   height: 178px;
  //   display: block;
  // }

  .el-form-item:nth-child(1){
    height:40px;
  }
}
</style>
