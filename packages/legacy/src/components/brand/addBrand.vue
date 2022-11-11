<script>
export default {
  name: 'AddBrand',
  components: {},
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
      },

      // 选择
      tableRadio: '',
      rules: {
        orgName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        adminName: [
          { required: true, message: '请输入管理员名称，长度在 2 到 10 个字符', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入英文字母或数字', trigger: 'blur' },
        ],
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
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

    }
  },
  watch: {

  },
  created() {

  },
  mounted() {
    this.companyShow()
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
        console.log('查询公司列表==========', res.data.body)
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
          // adminName: "管理员名称",           必填
          // brandName: "品牌名称",             必填
          // orgId: "公司ID",                   必填
          // mailbox: "邮箱（非必填）",
          // contacts: "联系人（非必填）",
          // telephone: "电话（非必填）",
          // bueTime: "品牌到期时间",           必填
          // gradeS: "S级人员数量",
          // gradeA: "A级人员数量",
          // gradeB: "B级人员数量",
          // gradeC: "C级人员数量",
          // totalNumShop: "店铺总数量"       必填
          // :this.imageUrl
            brandLogo: this.ruleForm.brandLogo,

            orgId: this.tableRadio.orgId,
            adminName: this.ruleForm.adminName + this.ADMIN,
            brandName: this.ruleForm.brandName,
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
    <ElPageHeader content="新增品牌" @back="goBack" />
    <ElDivider />
    <ElSteps :active="activeStep" finish-status="success" simple style="margin:10px 0px;">
      <ElStep title="选择公司信息" />
      <ElStep title="填写品牌信息" />
      <ElStep title="填写品牌配置" />
    </ElSteps>
    <div v-show="activeStep == 0" class="content">
      <div class="operateBtn">
        <ElButton size="small" icon="el-icon-plus" class="addBtnOnly" type="success" @click="addCompany()">
          新增公司
        </ElButton>
        <ElDrawer
          ref="drawer"
          :title="ruleForm.orgId ? '编辑公司' : '新增公司'"
          :visible.sync="dialog"
          direction="rtl"
          custom-class="demo-drawer"
        >
          <div class="demo-drawer__content">
            <ElForm ref="addRuleForm" :model="ruleForm" :rules="rules" label-width="80px">
              <ElFormItem label="公司名称" prop="orgName">
                <ElInput v-model="ruleForm.orgName" placeholder="请输入公司名称" autocomplete="off" />
              </ElFormItem>
              <ElFormItem label="公司地址" prop="address">
                <ElInput v-model="ruleForm.address" placeholder="请输入公司地址" autocomplete="off" />
              </ElFormItem>
            </ElForm>
            <div class="demo-drawer__footer">
              <ElButton @click="cancelForm">
                取 消
              </ElButton>
              <ElButton v-if="ruleForm.orgId" type="primary" @click="handleClose('addRuleForm')">
                保存
              </ElButton>
              <ElButton v-else type="primary" @click="handleClose('addRuleForm')">
                提交
              </ElButton>
            </div>
          </div>
        </ElDrawer>
      </div>
      <ElTable
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
        <ElTableColumn label="选择" width="55">
          <template slot-scope="scope">
            <ElRadio v-model="tableRadio" :label="scope.row">
              <i />
            </ElRadio>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="orgName"
          label="公司名称"
        />
        <ElTableColumn
          prop="address"
          label="公司地址"
        />
        <ElTableColumn
          prop="createTime"
          label="创建时间"
        />
        <ElTableColumn
          fixed="right"
          label="操作"
          width="140"
        >
          <template slot-scope="scope">
            <ElTooltip class="item" effect="dark" content="编辑公司" placement="top">
              <ElButton size="mini" type="primary" icon="el-icon-edit" class="editBtnOnly" circle @click="editRoleItem(scope.row, scope.$index)" />
            </ElTooltip>
            <ElTooltip class="item" effect="dark" content="删除公司" placement="top">
              <ElButton size="mini" type="danger" icon="el-icon-delete" class="delBtnOnly" circle @click="delRoleItem(scope.row, scope.$index)" />
            </ElTooltip>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <div v-show="activeStep == 1" class="content">
      <ElForm ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <ElFormItem label="品牌Logo">
          <!-- action="http://192.168.9.71:8089/gdy/system/file/uploadFile" -->
          <ElUpload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :http-request="changeFile"
          >
            <img v-if="imageUrl" :src="imageUrl" class="imgLogo">
            <ElButton class="upBtn">
              上传品牌Logo
            </ElButton>
          </ElUpload>
        </ElFormItem>
        <ElFormItem label="品牌名称" prop="brandName">
          <ElInput v-model="ruleForm.brandName" placeholder="请输入品牌名称" autocomplete="off" style="width:60%;" />
        </ElFormItem>
        <ElFormItem label="品牌简称" prop="abbreviation">
          <ElInput v-model="ruleForm.abbreviation" placeholder="请输入品牌简称" autocomplete="off" style="width:60%;" />
        </ElFormItem>
        <ElFormItem label="管理员名称" prop="adminName">
          <ElInput v-model="ruleForm.adminName" maxlength="10" placeholder="请输入管理员名称" autocomplete="off" style="width:60%;">
            <template slot="append">
              {{ ADMIN }}
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem label="品牌入驻时间" prop="bueStartTime">
          <ElDatePicker
            v-model="ruleForm.bueStartTime"
            style="width:60%;"
            type="date"
            placeholder="请选择品牌入驻时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </ElFormItem>
        <ElFormItem label="品牌到期时间" prop="bueEndTime">
          <ElDatePicker
            v-model="ruleForm.bueEndTime"
            style="width:60%;"
            type="date"
            placeholder="请选择品牌到期时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </ElFormItem>
        <ElFormItem label="联系人">
          <ElInput v-model="ruleForm.contacts" placeholder="请输入联系人" autocomplete="off" style="width:60%;" />
        </ElFormItem>
        <ElFormItem label="电 话">
          <ElInput v-model="ruleForm.telephone" placeholder="请输入电话" autocomplete="off" style="width:60%;" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" />
        </ElFormItem>
        <ElFormItem label="邮 箱">
          <ElInput v-model="ruleForm.mailbox" type="email" placeholder="请输入邮箱" autocomplete="off" style="width:60%;" />
        </ElFormItem>
      </ElForm>
    </div>
    <div v-show="activeStep == 2" class="content">
      <h3 style="text-align:left;line-height:40px;">
        店铺&人员限制
      </h3>
      <ElForm ref="form" :model="ruleForm" :rules="rules" label-width="100px">
        <ElFormItem label="店铺总数量" prop="totalNumShop">
          <ElInput v-model="ruleForm.totalNumShop" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入店铺总数量" autocomplete="off" style="width:60%;" />
        </ElFormItem>
        <ElFormItem label="S级人员数量">
          <ElInput v-model="ruleForm.gradeS" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入S级人员数量" autocomplete="off" style="width:60%;" />
        </ElFormItem>
        <ElFormItem label="A级人员数量">
          <ElInput v-model="ruleForm.gradeA" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入A级人员数量" autocomplete="off" style="width:60%;" />
        </ElFormItem>
        <ElFormItem label="B级人员数量">
          <ElInput v-model="ruleForm.gradeB" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入B级人员数量" autocomplete="off" style="width:60%;" />
        </ElFormItem>
        <ElFormItem label="C级人员数量">
          <ElInput v-model="ruleForm.gradeC" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入C级人员数量" autocomplete="off" style="width:60%;" />
        </ElFormItem>
      </ElForm>
    </div>
    <div class="step">
      <ElButton style="margin-left:auto;" type="primary" plain :disabled="prevDisabled" @click="clickPerv()">
        上一步
      </ElButton>
      <ElButton v-if="activeStep < 2" type="primary" plain @click="clickNext('ruleForm')">
        下一步
      </ElButton>
      <ElButton v-if="activeStep >= 2" type="primary" plain @click="regbrand('form')">
        提交
      </ElButton>
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
