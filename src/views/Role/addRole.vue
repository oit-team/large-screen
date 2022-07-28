<template>
  <div class="pageCommonStyle" id="addRole">
    <el-page-header @back="goBack" :content="editFlag?'新增角色':'编辑角色'"></el-page-header>
    <el-divider></el-divider>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName" >
        <el-input v-model="ruleForm.roleName" style="width:60%;" maxlength="10" placeholder="请选择角色名称"></el-input >
      </el-form-item>
      <el-form-item label="角色描述" prop="roleRemark">
        <el-input v-model="ruleForm.roleRemark" style="width:60%;" maxlength="32" placeholder="请输入角色描述"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-tree
          :data="menuList"
          ref="tree"
          node-key="menuId"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
          :show-checkbox="true"
        >
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" v-if="editFlag" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'addRole',
  components:{},
  data(){
    return {
      menuIds:"",
      editFlag:true,//判断是否出现重置
      menuList:"",//树形菜单列表
      title:"",
      brandId:0,
      ruleForm: {},
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个汉字', trigger: 'blur' }
        ],
        roleRemark:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个汉字', trigger: 'blur' }
        ],
      },
      // 菜单
      roleIds:[],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      menuList: [],
      defaultProps: {
        children: 'childrenMenu',
        label: 'menuName'
      }
    };

  },
  created(){
  },
  mounted(){
    // this.updateCharacter()
  },
  activated(){
    if(this.$route.query.item){
      this.title = "编辑角色"
      this.editFlag = false;
      this.power();//获取此角色菜单列表
      this.ruleForm = this.$route.query.item
    }else{
      this.title = "新增角色";
      this.ruleForm = {}
      this.getHomeMenuList();//获取菜单树
    }
  },
  methods:{
    goBack(){
      this.$router.go(-1);
    },
    // 获取菜单树
    getHomeMenuList(){
      let _this = this;
      let con = {
        roleId:"0",
        userId:"0",   // 这个userId传死值“0”，为了兼容首页左侧菜单必须要有的
        isShowMenu:"0"
      };
      let jsonParam = this.GLOBAL.paramJson(con);
      _this.$axios.post(this.Api.getCharacterTree, jsonParam).then((res) => {
        if(res.data.head.status == 0){
          _this.menuList = res.data.body.resultList;
          // 循环拿取菜单树第一层id
          let treeFirst = [];
          for(let i=0;i<_this.menuList.length;i++){
            treeFirst.push(_this.menuList[i].menuId)
          }
          this.defaultExpandedKeys = treeFirst
        }else{
          _this.$message({
            message: res.data.head.msg,
            type: 'warning'
          });
        }
      }).catch(err=>{
        // console.log(err)
      });
    },
    // 获取此角色菜单列表
    power(){
      let _this = this; 
      let con = {
        userId:"0",   // 这个userId传死值“0”，为了兼容首页左侧菜单必须要有的
        roleId:this.$route.query.item?.roleId ?? 0,
        isShowMenu:"0"
      };
      let jsonParam = this.GLOBAL.paramJson(con);
      _this.$axios.post(this.Api.getCharacterTree, jsonParam).then((res) => {
        if(res.data.head.status == 0){
          _this.defaultCheckedKeys = res.data.body.menuIdList;

          this.getHomeMenuList();//获取菜单树
        }else{
          _this.$message({
            message: res.data.head.msg,
            type: 'warning'
          });
        }
      }).catch(err=>{
        // console.log(err)
      });
    },
    // 保存
    submitForm(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();        // 半选中的节点所组成的数组
          let checkedKeys = this.$refs.tree.getCheckedKeys();     // 选中的节点所组成的数组

          for(let j=0;j<halfCheckedKeys.length;j++){
            checkedKeys.push(halfCheckedKeys[j])
          }
          this.menuIds = checkedKeys;

          if(_this.ruleForm.roleId === 0 || _this.ruleForm.roleId ){
            let con = {
              roleName:this.ruleForm.roleName,
              roleCode:this.ruleForm.roleCode,
              roleRemark:this.ruleForm.roleRemark,
              userId:sessionStorage.userId,
              roleId:this.ruleForm.roleId,
              menuIds:this.menuIds.toString()
            };
            let jsonParam = this.GLOBAL.paramJson(con);
            _this.$axios.post(this.Api.updateCharacter, jsonParam).then((res) => {
              if(res.data.head.status == 0){
                _this.$message({
                  message: res.data.head.msg,
                  type: 'success'
                });
                _this.$bus.$emit('detailShow',_this.ruleForm) // 事件分发
                _this.$router.back();
              }else{
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning'
                });
              }
            }).catch(err=>{
              // console.log(err)
            });
          }else{
            let con = {
              roleName:this.ruleForm.roleName,
              roleCode:this.ruleForm.roleCode,
              roleRemark:this.ruleForm.roleRemark,
              userId:sessionStorage.userId,
              roleId:this.ruleForm.roleId,
              brandId:sessionStorage.brandId,
              menuIds:this.menuIds.toString()
            };
            let jsonParam = _this.GLOBAL.paramJson(con);
            _this.$axios.post(this.Api.addCharacter, jsonParam).then((res) => {
              if(res.data.head.status == 0){
                _this.$bus.$emit('detailShow',_this.ruleForm) // 事件分发
                _this.$router.back();
              }else{
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning'
                });
              }
            }).catch(err=>{
              // console.log(err)
            });
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.tree.setCheckedKeys([]);
    }
  }
}
</script>

<style lang="scss" scoped>
#addRole{
  min-height: 82vh;
}

</style>
