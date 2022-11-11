<script>
export default {
  name: 'AddMenu',
  components: {},
  data() {
    return {
      editFlag: false, // 是否是编辑菜单   false 新增  true 编辑
      userId: 1, // 即createdId
      pId: '', // 父菜单id   新增菜单时不选父菜单则默认为一级菜单，pId 传 "0"
      labelPosition: 'left',
      pMenu: {},

      menuOption: [],
      checked: false, // 是否新增根菜单

      ruleForm: {
        menuName: '',
        menuUrl: '',
        menuCode: '',
        menuRemark: '',
        menuImg: '',
        orderBy: '',
        type: '', // 0 HOME 1 APP
        isPay: 0, // 0 免费  1 付费
      },
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ],
        menuUrl: [
          { required: true, message: '请填写菜单访问路径', trigger: 'blur' },
        ],
        menuCode: [
          { required: true, message: '请输入菜单编码', trigger: 'blur' },
        ],
        menuRemark: [
          { required: true, message: '请输入菜单描述', trigger: 'blur' },
        ],
        menuImg: [
          { required: true, message: '请输入菜单Icon', trigger: 'blur' },
        ],
        orderBy: [
          { required: true, message: '请输入菜单排序', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择菜单所属类型', trigger: 'blur' },
        ],
        isPay: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
      },

    }
  },
  created() {
    // console.log("this.$route.query.menuItem====",this.$route.query.menuItem)
    if (this.$route.query && this.$route.query.menuItem) {
      this.editFlag = true
      this.ruleForm = this.$route.query.menuItem
      if (this.ruleForm.path.length == 1) {
        this.pId = this.ruleForm.path
        if (this.ruleForm.path != '0') {
          this.pMenu.menuId = this.ruleForm.menuId
        }
        // // console.log("this.pMenu===",this.pMenu)
      }
      else {
        // // console.log('this.ruleForm.path====',this.ruleForm.path)
        const arr = this.ruleForm.path.split(',')
        // // console.log(this.ruleForm.path,arr);
        this.pId = this.ruleForm.path
        this.pMenu.menuId = arr[arr.length - 2]
        // // console.log("this.pMenu===",this.pMenu)
      }
      // this.pMenu = this.ruleForm.menuId;
      // // console.log("转为Number类型之后的 this.pMenu",this.pMenu)
    }
    else {
      this.pId = '0'
    }
    this.userId = this.userId
  },
  mounted() {
    this.getAllMenuList()
  },
  methods: {
    goBack() {
      // // console.log('go back');
      // this.$router.go(-1)
      // // console.log('sessionStorage.headTitString',sessionStorage.headTitString)
      this.$router.back()
    },
    getAllMenuList() {
      const _this = this
      const con = {
        pageNum: 1,
        pageSize: 9999,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/getAllMenuList`, jsonParam).then((res) => {
        // console.log("getAllMenuList==========",res.data.body);
        if (res.data.head.status == 0) {
          _this.menuOption = res.data.body.resultList
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    changePmenu(item) {
      // console.log("父级菜单选中项的item--------",item);

      // console.log(item.path);
      const lastStr = item.path.substring(item.path.length - 1)
      if (lastStr == ',') {
        this.pId = `${item.path}${item.menuId},`
      }
      else {
        this.pId = `${item.path},${item.menuId},`
      }
      // console.log("this.pId======",this.pId)
    },
    changeIsPay(val) {
      // console.log("是否付费：",val);
    },
    changePayType(val) {
      // console.log("所属付费类型",val)
    },

    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');  // 通过组件验证
          // console.log('_this.ruleForm',_this.ruleForm,_this.ruleForm.menuId)

          const con = {
            pId: _this.pId,
            menuName: _this.ruleForm.menuName,
            menuUrl: _this.ruleForm.menuUrl,
            menuRemark: _this.ruleForm.menuRemark,
            menuCode: _this.ruleForm.menuCode,
            menuImg: _this.ruleForm.menuImg,
            orderBy: _this.ruleForm.orderBy,
            menuId: _this.ruleForm.menuId,
            userId: _this.userId, // 只要点击了保存操作，传递的userId一定是当前登录人id么？
            type: _this.ruleForm.type,
            isPay: _this.ruleForm.isPay,
          }

          if (this.ruleForm.menuId) {
            // 编辑菜单
            const jsonParam = _this.GLOBAL.g_paramJson(con)
            _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/updateMenuById`, jsonParam).then((res) => {
              // console.log("addMenu==========",res.data.body);
              if (res.data.head.status == 0) {
                // console.log("编辑菜单成功===");
                _this.$message({
                  message: '编辑菜单成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
                _this.$router.back()
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
            // 新增菜单
            const jsonParam = _this.GLOBAL.g_paramJson(con)
            _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/insertMenu`, jsonParam).then((res) => {
              // console.log("addMenu==========",res.data.body);
              if (res.data.head.status == 0) {
                // console.log("新增菜单成功===");
                _this.$message({
                  message: '新增菜单成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
                _this.$router.back()
                // this.$parent.getAllMenuList();
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.pMenu = {}
    },
  },
}
</script>

<template>
  <div id="addMenu" class="pageCommonStyle page-container text-sm">
    <ElBacktop target="#addMenu" :visibility-height="200" :right="70" :bottom="100" />

    <ElPageHeader :content="editFlag ? '编辑菜单' : '新增菜单'" @back="goBack" />
    <ElDivider />
    <ElForm ref="ruleForm" style="margin-top:20px;" :model="ruleForm" :rules="rules" label-width="90px" :label-position="labelPosition" class="demo-ruleForm">
      <ElFormItem label="菜单名称" prop="menuName">
        <ElInput v-model="ruleForm.menuName" style="width:60%;" placeholder="请选择菜单名称" />
      </ElFormItem>
      <ElFormItem label="父菜单">
        <!--  value-key="id"     -->
        <ElSelect
          v-model="pMenu"
          filterable
          :disabled="editFlag"
          placeholder="请选择父级菜单(不选默认添加根菜单)"
          value-key="menuId"
          style="width:60%;"
          @change="changePmenu"
        >
          <ElOption
            v-for="(item, index) in menuOption"
            :key="index"
            :label="item.menuName"
            :value="item"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="访问路径" prop="menuUrl">
        <ElInput v-model="ruleForm.menuUrl" style="width:60%;" placeholder="请选择菜单访问路径" />
      </ElFormItem>
      <ElFormItem label="菜单编码" prop="menuCode">
        <ElInput v-model="ruleForm.menuCode" style="width:60%;" placeholder="请选择菜单编码" />
      </ElFormItem>
      <ElFormItem label="菜单描述" prop="menuRemark">
        <ElInput v-model="ruleForm.menuRemark" style="width:60%;" placeholder="请输入菜单描述" />
      </ElFormItem>
      <ElFormItem label="菜单图标" prop="menuImg">
        <ElInput v-model="ruleForm.menuImg" style="width:60%;" placeholder="请选择菜单Icon相应的name" />
      </ElFormItem>
      <ElFormItem label="菜单排序" prop="orderBy">
        <ElInput v-model="ruleForm.orderBy" style="width:60%;" placeholder="请输入菜单排序(数字类型)" />
      </ElFormItem>

      <ElFormItem label="所属类型" prop="type">
        <ElSelect
          v-model="ruleForm.type"
          placeholder="请确认付费菜单类型"
          style="width:60%;"
          @change="changePayType"
        >
          <ElOption label="APP" value="1" />
          <ElOption label="HOME" value="0" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="是否需付费" prop="isPay">
        <ElSelect
          v-model="ruleForm.isPay"
          placeholder="请确认该菜单类型"
          style="width:60%;"
          @change="changeIsPay"
        >
          <ElOption label="付费" :value="1" />
          <ElOption label="免费" :value="0" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem>
        <ElButton size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">
          保存
        </ElButton>
        <ElButton v-if="!editFlag" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">
          重置
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped>
#addMenu{
  height: calc(100vh - 180px);
  // height: 2000px;
  overflow:auto;

}
</style>
