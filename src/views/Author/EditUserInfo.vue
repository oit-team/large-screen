<template>
  <div id="addRole" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack"></el-page-header>
    <el-divider></el-divider>
    <el-form
      ref="ruleForm"
      style="margin-top: 20px"
      :rules="rules"
      :model="ruleForm"
      label-width="90px"
      label-position="left"
    >
      <div style="width: 50%;display: inline-block;float: left;border-right: 1px solid #DCDFE6;padding-right: 20px;">
        <el-form-item label="用户姓名">
          <el-input v-model="ruleForm.userName" style="width:100%;" :disabled="true" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item v-if="editFlag" label="用户状态" prop="status">
          <el-select
            v-model="ruleForm.status"
            style="width:100%;"
            filterable
            :disabled="true"
            placeholder="请选择用户状态"
          >
            <el-option
              v-for="(item,index) in statusList"
              :key="index"
              :label="item.label"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐码">
          <el-input v-model="ruleForm.invitationCode" style="width:100%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="推荐人">
          <el-select
            v-model="ruleForm.recommender"
            style="width:100%;"
            clearable
            filterable
            placeholder="请选择推荐人"
          >
            <el-option
              v-for="(item,index) in userList"
              :key="index"
              :label="item.nickName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宝玉" prop="bys">
          <el-input
            style="width:100%;"
            type="number"
            readonly
            :value="ruleForm.bys"
            placeholder="请输入宝玉"
            maxlength="10"
            @input="ruleForm.bys = ruleForm.bys.substring(0, 10)"
            @click.native="drawer = true"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input
            style="width:100%;"
            type="number"
            readonly
            :value="ruleForm.integral"
            placeholder="请输入积分"
            maxlength="10"
            @input="ruleForm.integral = ruleForm.integral.substring(0, 10)"
            @click.native="drawer = true"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="ruleForm.passWord" style="width:100%;" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>

      </div>
      <div style="width: 50%;display: inline-block;float: left;padding-left: 20px;">
        <el-form-item label="真实姓名">
          <el-input v-model="ruleForm.nickName" style="width:100%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-input v-model="ruleForm.birthDate" style="width:100%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-if="ruleForm.sex == 0" style="width:100%;" :disabled="true" value="男"></el-input>
          <el-input v-else-if="ruleForm.sex == 1" style="width:100%;" :disabled="true" value="女"></el-input>
          <el-input v-else-if="ruleForm.sex == -1" style="width:100%;" :disabled="true" value="暂无"></el-input>
          <el-input v-else v-model="ruleForm.sex" style="width:100%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="ruleForm.telephone" style="width:100%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="ruleForm.address" style="width:100%;" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="用户头像">
          <el-image
            v-if="ruleForm.headPortrait"
            style="width: 100px; height: 100px"
            :src="ruleForm.headPortrait"
          ></el-image>
          <span v-else="ruleForm.headPortrait" style="color:#BFBFBF">暂无头像</span>
        </el-form-item>
      </div>
      <div style="clear: both;text-align: center;">
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <!-- <el-button size="small" icon="el-icon-refresh" v-if="!editFlag" @click="resetForm('ruleForm')">重置</el-button> -->
      </div>
    </el-form>

    <el-drawer
      :visible.sync="drawer"
      :before-close="handleClose"
      :with-header="false"
    >
      <el-tabs class="py-3 px-4" value="0">
        <el-tab-pane label="宝玉/积分">
          <el-form ref="valueForm" label-position="top" :model="lazyValueForm">
            <el-form-item label="宝玉" prop="bys" :rules="lazyValueForm.byAddType !== 6 ? absRule : null">
              <el-input
                v-model="lazyValueForm.bys"
                type="number"
                placeholder="请输入宝玉"
                maxlength="10"
                @input="lazyValueForm.bys = formatNumber(lazyValueForm.bys)"
                @click.native="drawer = true"
                class="input-with-select"
              >
                <el-select v-model="selectBys" style="width:80px" slot="prepend" placeholder="增加" v-if="lazyValueForm.byAddType === 6 ? true:false">
                    <el-option
                      v-for="item in selectByOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="积分" prop="integral" :rules="lazyValueForm.byAddType !== 6 ? absRule : null">
              <el-input
                v-model="lazyValueForm.integral"
                type="number"
                placeholder="请输入积分"
                maxlength="10"
                @input="lazyValueForm.integral = formatNumber(lazyValueForm.integral)"
                @click.native="drawer = true"
                class="input-with-select"
              >
                 <el-select v-model="selectIntegral" style="width:80px" slot="prepend" placeholder="增加" v-if="lazyValueForm.byAddType === 6 ? true:false">
                     <el-option
                      v-for="item in selectJfOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                  </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="方式" prop="byAddType">
              <el-radio-group v-model="lazyValueForm.byAddType">
                <el-radio :label="3" border>用户充值</el-radio>
                <el-radio :label="5" border>平台赠送</el-radio>
                <el-radio :label="6" border>平台更改</el-radio>
              </el-radio-group>
            </el-form-item>
            <div>
              <el-button class="w-full" type="primary" @click="confirmValue()">确定</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="变更记录" shadow="never">
          <ul class="space-y-3">
            <li v-for="item of recordList" :key="item.id">
              <el-card>
                <div>
                  <span>变更类型：</span>
                  <span>{{ item.type }}</span>
                </div>
                <div class="space-x-2">
                  <span>宝玉</span>
                  <span>{{ item.byType }}</span>
                  <span>剩余</span>
                  <span>{{ item.totalBy }}</span>
                </div>
                <div class="space-x-2">
                  <span>积分</span>
                  <span>{{ item.integralType }}</span>
                  <span>剩余</span>
                  <span>{{ item.totalIntegral }}</span>
                </div>
                <div>
                  <span>变更时间：</span>
                  <span>{{ item.createTime }}</span>
                </div>
              </el-card>
            </li>
          </ul>
          <vc-load-more ref="loadMore" first-load @load="loadRecord"></vc-load-more>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import CryptoJS from '../../assets/js/CryptoJS'
import { isEqual } from 'lodash'

export default {
  name: 'addUser',
  props: {},
  data() {
    return {
      selectByOptions: [{
        value: '1',
        label: '增加'
      }, {
        value: '0',
        label: '减少'
      }],
      selectJfOptions: [{
        value: '1',
        label: '增加'
      }, {
        value: '0',
        label: '减少'
      }],
      selectBys:'', //宝玉选择正负
      selectIntegral:'', //积分选择正负
      userList: '',
      passWord: '',
      editFlag: false,
      statusList: [
        {
          key: 0,
          label: '启用',
        },
        {
          key: 1,
          label: '停用',
        },
      ],
      title: '',
      UserId: '',
      ruleForm: {
        userName: '',
        bys: '',
        integral: '',
        recommender: '',
      },
      lazyValueForm: {},
      valueForm: {
        bys: '',
        integral: '',
        byAddType: 3,
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        bys: [
          { required: true, message: '请输入宝玉', trigger: 'blur' },
        ],
        integral: [
          { required: true, message: '请输入积分', trigger: 'blur' },
        ],
        passWord: [
          { required: false, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少输入6位数字/字母', trigger: 'blur' },
          { max: 20, message: '最多输入20位数字/字母', trigger: 'blur' },
        ],
      },
      drawer: false,
      absRule: {
        validator: (rule, value, callback) => {
          if (+value < 0) callback(new Error('不可输入负值'))
          else callback()
        },
        trigger: 'blur',
      },
      pageNum: 1,
      recordList: [],
    }
  },
  created() {
    this.getUserList()
    if (this.$route.query.item) {
      this.title = '编辑用户'
      this.editFlag = true
      // this.ruleForm = this.$route.query.item
      this.getUserInfo(this.$route.query.item)
    } else {
      this.title = '新增用户'
    }
  },
  mounted() {},
  activated() {
    this.pageNum = 1
  },
  watch: {
    drawer() {
      if (this.drawer) this.lazyValueForm = { ...this.valueForm }
    },
  },
  methods: {
    // 输入宝玉和积分 取绝对值
    formatNumber(number) {
      return Math.abs(number).toString().substring(0, 10)
    },
    loadRecord($state) {
      return this.$axios
        .post(
          'api/order/appointed/getBillingList',
          this.GLOBAL.paramJson({
            userId: this.$route.query.item.id,
            pageNum: this.pageNum,
            pageSize: 20,
          }),
        )
        .then(res => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          const data = res.data.body
          this.recordList = this.pageNum === 1 ? data.resultList : [...this.recordList, ...data.resultList]
          this.recordList.length >= data.count ? $state.done() : $state.next()
          this.pageNum++
        })
        .catch($state.fail)
    },
    isUnique() {
      return false
    },
    goBack() {
      this.$router.go(-1)
    },
    getUserInfo(data) {
      const con = {
        userId: data.id,
      }
      const _this = this
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.getUserById, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (res.data.body.userInfo.recommender == '0') {
            res.data.body.userInfo.recommender = res.data.body.userInfo.recommenderName
          }
          _this.ruleForm = res.data.body.userInfo
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getUserList() {
      const con = {
        pageNum: 1,
        pageSize: 9999,
      }
      const _this = this
      const jsonParam = this.GLOBAL.paramJson(con)

      this.$axios.post(this.Api.getUsers, jsonParam).then((res) => {
        if (res.data.head.status == 0) {
          _this.userList = res.data.body.usersList
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let recommender = this.ruleForm.recommender == this.ruleForm.recommenderName ? '0' : this.ruleForm.recommender
          let valueForm = {}
          if (this.valueForm.bys || this.valueForm.integral) {
            const sureMinus = this.valueForm.byAddType === 6

            valueForm = {
              bys: sureMinus && this.selectBys==0 ? -this.valueForm.bys : this.valueForm.bys,
              integral: sureMinus && this.selectIntegral==0 ? -this.valueForm.integral : this.valueForm.integral,
              byAddType: this.valueForm.byAddType,
            }
          }

          let con = {
            recommender: recommender,
            ...valueForm,
          }
          let encryPwd = ''
          if (_this.editFlag) {
            if (_this.ruleForm.passWord) {
              encryPwd = CryptoJS.encrypt(_this.ruleForm.passWord)
              con.password = encryPwd
            }
            con.id = _this.ruleForm.id
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateUserById, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑用户成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm)
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
            _this.$axios.post(_this.Api.insertUser, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增用户成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm)
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
    async confirmValue() {
      await this.$refs.valueForm.validate()
      this.valueForm = { ...this.lazyValueForm }
      this.drawer = false
    },
    async handleClose() {
      if (!isEqual(this.lazyValueForm, this.valueForm)) {
        await this.$confirm('确定要关闭修改吗？', {
          type: 'warning',
        })
        this.lazyValueForm = { ...this.valueForm }
        this.drawer = false
      } else {
        this.drawer = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
