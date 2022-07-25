<template>
  <div id="taskList" class="pageCommonStyle">
    <vc-search
      ref="child"
      :headTitArr='headTitArr'
      :pageNum='pageNum'
      :pageSize='pageSize'
      :requestUrl='requestUrl'
      @changeLoading='changeLoad'
      @sendData='showChildData'/>
    <div class="operateBtn">
      <el-button size="small" @click="addMenu" icon="el-icon-plus" type="primary">新增角色</el-button>
    </div>
    <el-divider></el-divider>
    <el-table
        v-loading="loading"
        element-loading-text="拼命加载中..."
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          :index="indexMethod"
          width="50">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          sortable
          v-for="(item,index) in headTitArrNew"
          :key="index"
          :min-width="GLOBAL.minCellWidth"
          :prop="item.fieldKey"
          :label="item.fieldName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="128">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                class="editBtnOnly"
                circle
                :disabled="scope.row.type == 2"
                @click="editRoleItem(scope.row,scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                class="delBtnOnly"
                :disabled="scope.row.type == 2"
                @click="delRoleItem(scope.row,scope.$index)"
                circle>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-thumb"
                class="authBtnOnly"
                @click="authUsers(scope.row)"
                circle>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[15, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
  </div>
</template>

<script>
import VcSearch from '../../components/basic/CommonSearch'

export default {
  name: 'Home',
  components: {
    VcSearch,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      total: 0,
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
  computed:{
    headTitArrNew() {
      console.log(this.headTitArr.filter(item => !item.noTableShow))
      return this.headTitArr.filter(item => !item.noTableShow)
    },
  },
  created() {
    // this.requestUrl = this.Api.getRoleList
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
    this.dynamicParam.forEach(el => {
      if (el.key === 'pageNum') {
        el.value = this.pageNum
      }
    })
    // this.$refs.child.parentMsgs(this.dynamicParam)
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
      if (!data.roleId) {
        _this.$nextTick(() => {
          console.log('新增')
          _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
        })
      } else {
        console.log('修改')
        _this.$set(_this.tableData, _this.editIndex, data)
      }
    })
  },
  watch: {},
  methods: {
    editRoleItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/role/addrole',
        query: {
          item,
        },
      })
    },
    delRoleItem(item, index) {
      this.$confirm('确认删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log('同意')
        const _this = this
        const con = {
          roleId: item.roleId,
          roleCode: item.roleCode,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.Api.delRoleById, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.tableData.splice(index, 1)
            if (_this.total > 0) {
              _this.total -= 1
            }
            if (_this.tableData.length === 0 && _this.total > 0) {
              _this.pageNum -= 1
              _this.dynamicParam.forEach(el => {
                if (el.key === 'pageNum') {
                  el.value = _this.pageNum
                }
              })
              _this.$refs.child.parentMsgs(_this.dynamicParam)
            }
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
        console.log('取消删除')
      })
    },
    changeLoad(val) {
      this.loading = val
    },
    showChildData(tableData, total, tableEmptyText, pageNum) {
      console.log('tableData', tableData)
      console.log('total', total)
      console.log('tableEmptyText', tableEmptyText)
      console.log('pageNum', pageNum)
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
    handleSizeChange(val) {
      this.pageSize = val
      this.dynamicParam.forEach(el => {
        if (el.key === 'pageSize') {
          el.value = this.pageSize
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.dynamicParam.forEach(el => {
        if (el.key === 'pageNum') {
          el.value = this.pageNum
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    addMenu() {
      this.$router.push({
        path: '/role/addRole',
      })
    },
    authUsers(item) {
      this.$router.push({
        path: '/role/authUsersByRoleId',
        query: {
          item,
        },
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
  },
}
</script>
