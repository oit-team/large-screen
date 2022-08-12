<template>
  <div id="taskList" class="pageCommonStyle">
    <VcSearch
      ref="child"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :request-url="requestUrl"
      @changeLoading="changeLoad"
      @sendData="showChildData"
    />
    <div class="operateBtn">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addMenu">
        新增菜单
      </el-button>
    </div>
    <el-divider></el-divider>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="menuId"
      border
      default-expand-all
      :tree-props="{ children: 'childrenMenu', hasChildren: 'true' }"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        width="50"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in headTitArr"
        :key="index"
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        :prop="item.fieldKey"
        :label="item.fieldName"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="128"
      >
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.menuType !== 2" class="item" effect="dark" content="编辑" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              class="editBtnOnly"
              circle
              @click="editMenuItem(scope.row, scope.$index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.menuType !== 2" class="item" effect="dark" content="删除" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="delBtnOnly"
              circle
              @click="delMenuItem(scope.row, scope.$index)"
            >
            </el-button>
          </el-tooltip>
          <el-tooltip v-show="isShowBtn(scope.row)" class="item" effect="dark" content="按钮权限" placement="top">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-thumb"
              class="authBtnOnly"
              circle
              @click="authBtn(scope.row)"
            >
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div
        v-for="(tag, index) in dynamicTags"
        :key="index"
        class="tabBox"
      >
        <el-input
          v-show="tag.edit"
          :ref="`editableInput${index}`"
          v-model="tag.name"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleInputEdit(index)"
          @blur="handleInputEdit(index)"
        >
        </el-input>
        <el-tag
          v-show="!tag.edit"
          closable
          :disable-transitions="false"
          @close="handleTagClose(tag)"
        >
          {{ tag.name }}
          <i class="el-icon-edit" @click="handleTagEdit(index)"></i>
        </el-tag>
      </div>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button class="button-new-tag" size="small" @click="showInput">
        + 添加按钮权限
      </el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addMenuButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VcSearch from '../../components/basic/CommonSearch'

export default {
  components: {
    VcSearch,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      activeMenuId: [],
      dialogTitle: '',
      dynamicTags: [],
      inputVisible: false,
      dialogVisible: false,
      inputValue: '',
      times: 0,
      pageNum: 0,
      pageSize: 15,
      requestUrl: '',
      editIndex: null,
      dynamicParam: [],
      loading: true,
      tableData: [],
      headTitArr: [],
    }
  },
  computed: {
    headTitArrNew() {
      return this.headTitArr.filter(item => !item.noTableShow)
    },
  },
  watch: {},
  created() {
    // this.requestUrl = this.Api.getAllMenuAndTree
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    this.dynamicParam = [
      {
        key: 'pageNum',
        value: '1',
        isTrue: true,
        msg: '请确认pageNum',
      },
      {
        key: 'pageSize',
        value: '15',
        isTrue: true,
        msg: '请确认pageSize',
      },
    ]
  },
  mounted() {
    this.pageNum = 1
    this.dynamicParam.forEach((el) => {
      if (el.key === 'pageNum') {
        el.value = this.pageNum
      }
    })
  },
  activated() {
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    const _this = this
    _this.$bus.$off('detailShow')
    /* 接收参数 */
    _this.$bus.$on('detailShow', (data) => {
      if (!data.menuId) {
        _this.$nextTick(() => {
          _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
        })
      } else {
        _this.$set(_this.tableData, _this.editIndex, data)
      }
    })
  },
  methods: {
    editMenuItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/menu/addmenu',
        query: {
          item,
        },
      })
    },
    delMenuItem(item, index) {
      this.$confirm('确认删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          menuId: item.menuId,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.Api.delMenuById, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.$refs.child.parentMsgs(_this.dynamicParam)
            _this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else {
            _this.$message({
              type: 'error',
              message: res.data.head.msg,
            })
          }
        })
      }).catch(() => {
      })
    },
    changeLoad(val) {
      this.loading = val
    },
    showChildData(tableData, total, tableEmptyText, pageNum) {
      if (tableData) {
        this.tableData = tableData
      }
      if (total) {
        this.total = total
      }
      if (tableEmptyText) {
        this.tableEmptyText = tableEmptyText
      }
      if (pageNum) {
        this.pageNum = pageNum
      }
    },
    addMenu() {
      this.$router.push({
        path: '/menu/addmenu',
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
    authBtn(data) {
      const dynamicTags = []
      if (data.childrenMenu.length > 0) {
        data.childrenMenu.forEach((item, i) => {
          dynamicTags.push({ name: item.menuName, edit: false })
        })
        this.dynamicTags = dynamicTags
      }
      if (data.path === '0') {
        this.activeMenuId = data.menuId
      } else {
        this.activeMenuId = `${data.path},${data.menuId}`
      }
      this.dialogTitle = `${data.menuName}按钮权限`
      this.dialogVisible = true
    },
    handleClose() {
      this.dynamicTags = []
      this.dialogVisible = false
    },
    getMenuNameList(data) {
      const arr = []
      data.forEach((item, i) => {
        arr.push(item.name)
      })
      return arr
    },
    addMenuButton() {
      if (this.dynamicTags.length === 0) {
        this.$message({
          message: '请添加按钮权限',
          type: 'warning',
        })
        return
      }
      const _this = this
      const menuName = this.getMenuNameList(this.dynamicTags)
      const con = {
        pId: this.activeMenuId,
        menuName,
        menuType: '2',
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.addMenuButton, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.$message({
            message: '编辑按钮权限成功',
            type: 'success',
          })
          _this.handleClose()
          this.$refs.child.parentMsgs(this.dynamicParam)
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    handleTagClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push({ name: inputValue, edit: false })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleTagEdit(index) {
      this.dynamicTags[index].edit = true
      const ref = `editableInput${index}`
      this.$nextTick((_) => {
        this.$refs[ref][0].$refs.input.focus()
      })
    },
    handleInputEdit(index) {
      this.dynamicTags[index].edit = false
    },
    isShowBtn(data) {
      if (data.childrenMenu !== null) {
        if (data.childrenMenu.length === 0 && data.menuType === 0) {
          return true
        } else if (data.childrenMenu.length > 0 && data.childrenMenu[0].menuType === 2) {
          return true
        }
      }
    },
  },
}
</script>

<style scoped>
   .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    .el-icon-edit{
      padding:2px;
      border-radius:50%;
      cursor:pointer
    }
    .el-icon-edit:hover{
      background:#409eff;
      color:#fff;
    }
    .tabBox{
      display: inline-block;
      margin-left: 10px;
    }
    .tabBox .input-new-tag{
      margin-left: 0px;
      vertical-align: middle;
    }
</style>
