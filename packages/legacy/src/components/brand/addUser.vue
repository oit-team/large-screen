<script>
// import bus from '../../assets/js/eventBus';
import CryptoJS from '../../assets/js/CryptoJS'
export default ({
  name: 'AddUser',
  components: {},
  data() {
    const checkphone = (rule, value, callback) => {
      const phoneReg = /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/
      if (value == '') {
        callback(new Error('请输入联系电话'))
      }
      else if (!phoneReg.test(value)) { // 引入methods中封装的检查手机格式的方法
        callback(new Error('号码格式不正确或者位数不正确!'))
      }
      else {
        callback()
      }
    }

    return {
      addUserLoading: false,
      editFlag: false,
      ruleForm: {
        userName: '',
        nickName: '',
        telephone: '',
        passWord: '',
        sex: '',
        job: '',
        accountType: '',
        birthDate: '',
        address: '',
        autograph: '',
      },
      rules: {
        // 用户名改为后台生成 不让新增时候自己编辑
        // userName: [
        //   { required: true, message: '请输入用户名称', trigger: 'blur' },
        //   { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        // ],
        nickName: [
          { required: true, message: '请输入用户真实姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
        passWord: [
          { required: false, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]{6,20}$/, message: '只能输入6-20位字母、数字组合' },
        ],
        telephone: [
          { required: true, validator: checkphone, trigger: 'blur' },
        ],
        accountType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' },
          // { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ],
        job: [
          { required: false, trigger: 'blur' },
          { min: 0, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
        address: [
          { required: false, trigger: 'blur' },
          { min: 0, max: 32, message: '长度在 0 到 32 个字符', trigger: 'blur' },
        ],
        autograph: [
          { required: false, trigger: 'blur' },
          { min: 0, max: 32, message: '长度在 0 到 32 个字符', trigger: 'blur' },
        ],

      },

      nodeId: null,
      nodeType: '0',

      shopAndareaList: [],
      shopVal: null,
      checkedNode: null, // 被选中的节点
      oldNodeId: null, // 从编辑页面拿过来的nodeId,临时存储起来，判断用户所属店铺是否更改过

      brandAbbreviation: null, // 品牌缩写
    }
  },
  created() {
    // 编辑
    // console.log(this.$route)
    if (this.$route.query && this.$route.query.item) {
      this.editFlag = true
      this.ruleForm = this.$route.query.item
      // console.log("编辑用户信息===",this.ruleForm,this.ruleForm.telephone);
      if (this.$route.query.item.shopId) {
        this.shopVal = Number(this.$route.query.item.shopId)
      }
      else if (this.$route.query.item.orgStId) {
        this.shopVal = this.$route.query.item.orgStId
      }
      // console.log("this.shopVal====",this.shopVal);
      this.oldNodeId = this.$route.query.nodeId
      this.nodeId = this.$route.query.nodeId
      this.nodeType = this.$route.query.nodeType
      // console.log("query=====",this.nodeId, this.nodeType)
    }
    // 新增
    if (this.$route.params && this.$route.params.nodeId) {
      this.nodeId = this.$route.params.nodeId
      this.nodeType = this.$route.params.nodeType
      // console.log("params=====",this.nodeId, this.nodeType)
    }
  },
  mounted() {
    this.getShopAndAreaList()
  },
  beforeDestroyed() {
    // this.$bus.$emit('detailShow',_this.ruleForm) // 事件分发

  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // 修改用户所属店铺列表，请求数据
    getShopAndAreaList() {
      const _this = this
      const con = {
        // brandId: sessionStorage.brandId,
      }

      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/getTreeOrgList`, jsonParam).then((res) => {
        // console.log("====获取用户所属店铺列表==========",res.data.body);
        if (res.data.head.status == 0) {
          _this.shopAndareaList = res.data.body.orgList[0].childrenList
          if (res.data.body.orgList[0].abbreviation) {
            _this.brandAbbreviation = res.data.body.orgList[0].abbreviation
          }
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    // 修改所属店铺或者区域
    changeShop(val) {
      // console.log("val=====",val);
      const checkedNodeList = this.$refs.chooseOption.getCheckedNodes()
      if (checkedNodeList[0]) {
        this.checkedNode = checkedNodeList[0]
        this.nodeId = this.checkedNode.data.id
        this.nodeType = this.checkedNode.data.isShop ? this.checkedNode.data.isShop : '0'
      }

      // this.checkedNode = this.$refs.chooseOption.getCheckedNodes();
      // console.log("选中的节点=======",this.checkedNode)
    },
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      }
      else {
        return true
      }
    },

    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');  // 通过组件验证
          // console.log('_this.ruleForm',_this.ruleForm);
          this.addUserLoading = true
          let encryPwd = null
          if (_this.ruleForm.passWord) {
            encryPwd = CryptoJS.encrypt(this.ruleForm.passWord)
          }
          // console.log('加密后的密码===',encryPwd);
          // 密码的处理逻辑：
          // 非必填，不填传参为空，后台取默认值六个一，传参的话，使用AES加密，将加密后的字符串传给后台，后台解密后再MD5存储
          if (this.editFlag) {
            // 编辑用户接口
            const con = {
              id: _this.ruleForm.id,
              userName: _this.ruleForm.userName,
              // passWord:_this.ruleForm.passWord,  // passWord逻辑待定
              passWord: encryPwd,
              status: _this.ruleForm.status, // status页面也没让改,传参多余么
              accountType: _this.ruleForm.accountType,
              telephone: _this.ruleForm.telephone,
              headPortrait: _this.ruleForm.headPortrait,
              job: _this.ruleForm.job,
              sex: _this.ruleForm.sex,
              nickName: _this.ruleForm.nickName,
              userId: sessionStorage.userId,
              address: _this.ruleForm.address,
              autograph: _this.ruleForm.autograph,
              hireDate: _this.ruleForm.hireDate,
              birthDate: _this.ruleForm.birthDate,
              // 修改用户所属店铺或区域
              isShop: _this.nodeType,
              // 0 区域 1 店铺 2 品牌  为1或2时isShop有值 为null 自己取'0'
              nodeId: _this.nodeId,
            }

            const jsonParam = _this.GLOBAL.g_paramJson(con)
            // console.log("jsonParam===",jsonParam)
            _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/updateUserById`, jsonParam).then((res) => {
              // console.log("编辑用户接口返回信息==========",res.data.body);
              if (res.data.head.status == 0) {
                this.addUserLoading = false

                _this.$message({
                  message: '编辑保存成功',
                  type: 'success',
                })
                if (_this.ruleForm.accountType == '0') {
                  _this.ruleForm.accountTypeMsg = '小程序用户'
                }
                if (_this.ruleForm.accountType == '1') {
                  _this.ruleForm.accountTypeMsg = '管家用户'
                }
                // if (_this.ruleForm.accountType == '3') {
                //   _this.ruleForm.accountTypeMsg = '小程序及管家用户'
                // }
                if (_this.ruleForm.sex == '1') {
                  _this.ruleForm.sexMsg = '女'
                }
                if (_this.ruleForm.sex == '0') {
                  _this.ruleForm.sexMsg = '男'
                }
                if (_this.oldNodeId == _this.nodeId) {
                  _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
                  _this.$router.back()
                }
                else {
                  _this.$set(_this.ruleForm, 'changeShopFlag', true)
                  _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
                  _this.$router.back()
                }
              }
              else {
                this.addUserLoading = false
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).finally(() => this.addUserLoading = false)
          }
          else {
            // 新增用户接口
            let curUserName = ''
            if (_this.brandAbbreviation) {
              curUserName = `${_this.brandAbbreviation}${_this.ruleForm.userName}`
            }
            else {
              curUserName = _this.ruleForm.userName
            }
            const con = {
              // brandId: sessionStorage.brandId,
              type: _this.nodeType, // 1=店铺;0=区域
              orgStId: _this.nodeId, // 所属组织ID（店铺或区域ID）
              userId: sessionStorage.userId,
              // userName: _this.ruleForm.userName,
              // userName: curUserName,

              // passWord:_this.ruleForm.passWord,
              passWord: encryPwd,
              accountType: _this.ruleForm.accountType, // 账号类型,0:app,1:cms,3:app&cms
              telephone: _this.ruleForm.telephone,
              // headPortrait:_this.ruleForm.headPortrait,
              headPortrait: 'http://res.oitor.com:8099/upload/0/2020/4/ff1b34bb2db24fde8f4d3cbcee55574c.png',
              job: _this.ruleForm.job,
              sex: _this.ruleForm.sex,
              nickName: _this.ruleForm.nickName,
              address: _this.ruleForm.address,
              autograph: _this.ruleForm.autograph,
              hireDate: _this.ruleForm.hireDate,
              birthDate: _this.ruleForm.birthDate,
            }

            const jsonParam = _this.GLOBAL.g_paramJson(con)
            _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/insertUser`, jsonParam).then((res) => {
              // console.log("新增用户接口返回信息==========",res.data.body);
              if (res.data.head.status == 0) {
                this.addUserLoading = false
                _this.$message({
                  message: '新增保存成功',
                  type: 'success',
                })

                _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
                _this.$router.back()
              }
              else {
                this.addUserLoading = true
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).finally(() => this.addUserLoading = false)
          }
        }
        else {
          // console.log('error submit!!');
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

  },
})
</script>

<template>
  <div id="addUser" class="pageCommonStyle p-4">
    <el-backtop target="#addUser" :visibility-height="200" :right="70" :bottom="100" />
    <el-page-header :content="editFlag ? '编辑用户' : '新增用户'" @back="goBack" />
    <el-divider />

    <el-form ref="ruleForm" style="margin-top:20px;" :model="ruleForm" :rules="rules" label-width="106px" label-position="left" class="demo-ruleForm">
      <el-form-item v-if="editFlag" label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" :disabled="editFlag" style="width:60%;" maxlength="20" placeholder="请选择用户名">
          <template v-if="!editFlag && brandAbbreviation" slot="prepend">
            {{ brandAbbreviation }}
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="nickName">
        <el-input v-model="ruleForm.nickName" style="width:60%;" maxlength="20" placeholder="请输入真实姓名" />
      </el-form-item>
      <!-- <el-form-item label="头像" prop="headPortrait">
        <el-input v-model="ruleForm.headPortrait" style="width:60%;"  placeholder="请输入真实姓名"></el-input>
      </el-form-item> -->
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="ruleForm.telephone" style="width:60%;" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="账号类型" prop="accountType">
        <el-select v-model="ruleForm.accountType" placeholder="请选择">
          <el-option label="小程序用户" value="0" />
          <el-option label="管家用户" value="1" />
          <!-- <el-option label="小程序及管家用户" value="3" /> -->
        </el-select>
      </el-form-item>

      <el-form-item v-if="editFlag" label="所属店铺/区域">
        <el-cascader
          ref="chooseOption"
          v-model="shopVal"
          style="width:60%;"
          :options="shopAndareaList"
          filterable
          :show-all-levels="false"
          :props="{ checkStrictly: true, children: 'childrenList', value: 'id', label: 'osName' }"
          @change="changeShop"
        />
      </el-form-item>

      <el-form-item label="用户密码" prop="passWord">
        <el-input v-model="ruleForm.passWord" style="width:60%;" type="password" placeholder="用户密码" />
        <div v-if="editFlag" class="pwdTip">
          <i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;color:#e60012;" />原密码不显示，若要修改请直接输入新密码保存即可
        </div>
        <div v-else class="pwdTip">
          <i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;color:#e60012;" />不填则为默认密码
        </div>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="ruleForm.sex" placeholder="请选择">
          <el-option label="男" value="0" />
          <el-option label="女" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="职位" prop="job">
        <el-input v-model="ruleForm.job" style="width:60%;" maxlength="20" placeholder="请输入职位" />
      </el-form-item>

      <el-form-item label="出生日期" prop="birthDate">
        <el-date-picker
          v-model="ruleForm.birthDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="入职日期" prop="hireDate">
        <el-date-picker
          v-model="ruleForm.hireDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="ruleForm.address" style="width:60%;" maxlength="32" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="个人签名" prop="autograph">
        <el-input v-model="ruleForm.autograph" style="width:60%;" maxlength="32" placeholder="请输入个人签名" />
      </el-form-item>

      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" :loading="addUserLoading" @click="submitForm('ruleForm')">
          保存
        </el-button>
        <el-button v-if="!editFlag" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
#addUser{
  .pwdTip{
    text-align: left;
    line-height: 24px;
  }
  @deep:~">>>";
  // height: calc(100vh - 180px);
  @{deep} .el-select{
    width:60%;
  }
  @{deep} .el-date-editor.el-input{
    width:60%;
  }
  @{deep} .el-form-item {
    margin-bottom: 18px;
  }

}
</style>
