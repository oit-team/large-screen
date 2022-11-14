<script>
// import { VueCropper } from 'vue-cropper'
import commonSearch from '../common/commonSearch'

export default {
  name: 'MenuList',
  components: { CommonSearch: commonSearch },
  filters: {
    formatType(val) {
      // console.log("--------------",val)
      return val == '0' ? 'HOME' : 'APP'
    },
  },
  data() {
    const item = {
      name: '菜单名称',
      menuUrl: '/menuList',
      menuCode: 'menuList',
      menuIcon: '',
    }
    return {
      tableEmptyText: '',
      loading: false,

      tableData: [],
      headTitArr: [],
      pageNum: 0,
      pageSize: 15,
      total: 0,

      searchVal1: '',

      foldFlag: true, // true  折叠   false  展开

      height: '160px',
      requestUrl: '/menu/getAllMenuList', // 请求列表url
      editIndex: null,

      dynamicParam: [], // 动态参数  需要用户自定义
    }
  },

  watch: {
    $route(to, from) {},
  },
  created() {
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    // console.log("this.headTitArr========",this.headTitArr);
    if (!this.headTitArr) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
      return
    }
    this.dynamicParam = [
      { key: 'pageNum', value: this.pageNum, isTrue: true, msg: '请确认pageNum.' },
      { key: 'pageSize', value: this.pageSize, isTrue: true, msg: '请确认pageSize.' },
    ]
  },
  mounted() {
    this.pageNum = 1
    this.dynamicParam.forEach((el) => {
      if (el.key == 'pageNum') {
        el.value = this.pageNum
      }
    })
    this.$refs.child.parentMsgs(this.dynamicParam)
  },
  activated() {
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    // console.log("this.headTitArr========",this.headTitArr);
    if (!this.headTitArr) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    const _this = this
    _this.$bus.$off('detailShow')
    _this.$bus.$on('detailShow', (data) => { // 接收
      // console.log("----------data---------",data)
      if (!data.menuId) { // 是新增还是编辑
        _this.$nextTick(() => {
          _this.$refs.child.resetSearch(this.dynamicParam)
        })
      }
      else {
        _this.$set(_this.tableData, _this.editIndex, data) // 用set方法修改数据
      }
    })
  },

  methods: {
    // ==========================
    showChildData(tableData, total, tableEmptyText, pageNum) {
      // console.log("搜索组件传递过来的数据====",tableData,total,tableEmptyText,pageNum)
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
      if (total === 0) {
        this.total = 0
        this.pageNum = 1
      }
    },
    changeLoad(val) {
      // console.log("--------val------",val);
      this.loading = val
    },
    rowClass({ row, rowIndex }) {
      // console.log(rowIndex)      //0   表头行标号为0
      return this.GLOBAL.tableHeadStyle
    },
    tableCellStyle() {
      return this.GLOBAL.tableCellStyle
    },

    addMenu() {
      this.$router.push({
        path: '/menu/addMenu',
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then((_) => {
        done()
      }).catch((_) => {})
    },
    editMenuItem(item, index) {
      // console.log("editMenuItem===",item);
      this.editIndex = index
      this.$router.push({
        path: '/menu/addMenu',
        query: {
          menuItem: item,
          plan: new Date().getTime(),
        },
      })
    },
    // 删除菜单
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
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/menu/delMenuById`, jsonParam).then((res) => {
          // console.log("delMenuById==========",res.data.body);
          if (res.data.head.status == 0) {
            _this.tableData.splice(index, 1)
            if (_this.total > 0) {
              _this.total = _this.total - 1
            }
            if (_this.tableData.length == 0 && _this.total > 0) {
              _this.pageNum = _this.pageNum - 1
              _this.dynamicParam.forEach((el) => {
                if (el.key == 'pageNum') {
                  el.value = _this.pageNum
                }
              })
              _this.$refs.child.parentMsgs(_this.dynamicParam)
            }
            _this.$message({
              type: 'success',
              message: '删除成功!',
            })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.dynamicParam.forEach((el) => {
        if (el.key == 'pageSize') {
          el.value = this.pageSize
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNum = val
      this.dynamicParam.forEach((el) => {
        if (el.key == 'pageNum') {
          el.value = this.pageNum
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
  },
}
</script>

<template>
  <div id="menuList" class="pageCommonStyle page-container text-sm">
    <common-search
      ref="child"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :server-name="GLOBAL.system_manager_server"
      :request-url="requestUrl"
      @changeLoading="changeLoad"
      @sendData="showChildData"
    />

    <div class="operateBtn">
      <el-button size="small" icon="el-icon-plus" class="addBtnOnly" type="success" @click="addMenu">
        新增菜单
      </el-button>
    </div>

    <el-divider />

    <el-table
      v-loading="loading"
      element-loading-text="小易拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :style="GLOBAL.tableStyle"
      stripe
      border
      :header-cell-style="rowClass"
      :cell-style="tableCellStyle"
    >
      <template slot="empty">
        <p>{{ tableEmptyText }}</p>
      </template>
      <el-table-column
        v-for="(item, index) in headTitArr"
        :key="index"
        show-overflow-tooltip
        sortable
        :prop="item.fieldKey"
        :min-width="GLOBAL.minCellWidth"
        :label="item.fieldName"
      />
      <el-table-column
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        prop="type"
        label="所属类型"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type | formatType }}</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        style="border-lrft:none;"
        width="140"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑菜单" placement="top">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle class="editBtnOnly" @click="editMenuItem(scope.row, scope.$index)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除菜单" placement="top">
            <el-button size="mini" type="danger" icon="el-icon-delete" class="delBtnOnly" circle @click="delMenuItem(scope.row, scope.$index)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="pageNum"
      :page-sizes="[15, 20, 30]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="less" scoped>
@deep:~">>>";
#menuList{
  @{deep} .el-tooltip {
    padding: 7px 7px!important;
  }
  .operateBtn{
    margin-bottom:10px;
    display:flex;
    .clearSearch{
      margin-right:auto;
    }
  }
}
</style>
