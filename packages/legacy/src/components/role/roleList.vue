<script>
import commonSearch from '../common/commonSearch'
export default {
  name: 'RoleList',
  components: { CommonSearch: commonSearch },
  data() {
    return {
      tableEmptyText: '',
      loading: false,
      requestUrl: '/role/getRoleList',
      headTitArr: [],
      tableData: [],
      brandId: 0,
      type: '0',
      pageNum: 1,
      pageSize: 15,
      total: 0,
      editIndex: null,
      dynamicParam: [], // 动态参数  需要用户自定义
    }
  },
  watch: {
    $route(to, from) {},
  },
  created() {
    console.log(this)
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

    this.dynamicParam = [
      { key: 'pageNum', value: this.pageNum, isTrue: true, msg: '请确认pageNum.' },
      { key: 'pageSize', value: this.pageSize, isTrue: true, msg: '请确认pageSize.' },
      { key: 'brandId', value: sessionStorage.brandId, isTrue: true, msg: '请确认品牌Id.' },
    ]
  },
  mounted() {
    this.pageNum = 1
    this.dynamicParam.forEach((el) => {
      if (el.key == 'pageNum') {
        el.value = this.pageNum
      }
    })
    // console.log("======roleList====mounted=======",this.dynamicParam)
    this.$refs.child.parentMsgs(this.dynamicParam)
  },
  activated() {
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    // this.$refs.tableRef.doLayout()//解决表格错位问题，doLayout方法table重新布局
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
      // console.log("--------detailShow--data---------",data)
      if (!data.roleId) { // 是新增还是编辑
        _this.$nextTick(() => {
          // 新增数据后走公共搜索组件里的清空搜索进行重新请求数据
          _this.$refs.child.resetSearch(this.dynamicParam)
        })
      }
      else {
        _this.$set(_this.tableData, _this.editIndex, data) // 用set方法修改数据
      }
    })
  },
  methods: {
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

      this.$nextTick(this.$refs.table.doLayout)
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

    // 新增角色
    addRole() {
      this.$router.push({
        name: 'addRole',
      })
    },
    // 编辑角色
    editRoleItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/role/addRole',
        query: {
          item,
        },
      })
    },
    // 删除角色
    delRoleItem(item, index) {
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          roleId: item.roleId,
        }
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/role/delRoleById`, jsonParam).then((res) => {
          // console.log("delRoleList==========",res.data.body);
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
    // 把角色赋予用户
    authUsers(item) {
      // console.log("--角色item---",item);
      this.$router.push({
        name: 'authUsersByRoleId',
        params: {
          item,
        },
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      // this.pageNum = 2;
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
      // this.pageNum = 2;
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
  <div id="roleList" class="pageCommonStyle page-container text-sm">
    <!-- 操作框 -->
    <!-- :loading="loading" -->
    <CommonSearch
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
      <ElButton class="addBtnOnly" size="small" icon="el-icon-plus" type="success" @click="addRole">
        新增角色
      </ElButton>
    </div>
    <ElDivider />
    <!-- ref="tableRef" -->
    <ElTable
      ref="table"
      v-loading="loading"
      :style="GLOBAL.tableStyle"
      element-loading-text="小易拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      stripe
      border
      :header-cell-style="rowClass"
      :cell-style="tableCellStyle"
    >
      <template slot="empty">
        <p>{{ tableEmptyText }}</p>
      </template>
      <ElTableColumn
        v-for="(item, index) in headTitArr"
        :key="index"
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        :prop="item.fieldKey"
        :label="item.fieldName"
      />

      <ElTableColumn
        fixed="right"
        label="操作"
        width="140"
      >
        <template slot-scope="scope">
          <ElTooltip class="item" effect="dark" content="编辑角色" placement="top">
            <ElButton class="editBtnOnly" size="mini" type="primary" icon="el-icon-edit" circle @click="editRoleItem(scope.row, scope.$index)" />
          </ElTooltip>
          <ElTooltip class="item" effect="dark" content="删除角色" placement="top">
            <ElButton class="delBtnOnly" size="mini" type="danger" icon="el-icon-delete" circle @click="delRoleItem(scope.row, scope.$index)" />
          </ElTooltip>
          <ElTooltip class="item" effect="dark" content="角色授权" placement="top">
            <ElButton class="authBtnOnly" size="mini" type="warning" icon="el-icon-thumb" circle @click="authUsers(scope.row)" />
          </ElTooltip>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElPagination
      background
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

#roleList{
  .operateBtn{
    margin-bottom:10px;
    display:flex;
  }
  @{deep} .el-tooltip {
    padding: 7px 7px!important;
  }
}
</style>

